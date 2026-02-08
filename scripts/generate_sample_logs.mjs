
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAMPLEDATA_DIR = path.join(__dirname, '../src/lib/sampledata');
// The 5 original source files to use as templates
const TEMPLATES = [
    { file: 'Log-2023-08-28-17-05-38.txt', map: 'Oasis', mode: 'Control', originalTeams: ['Team 1', 'Team 2'] },
    { file: 'Log-2023-08-28-17-29-57.txt', map: 'Hollywood', mode: 'Hybrid', originalTeams: ['Tempest', 'Paradise Aegis'] },
    { file: 'Log-2023-08-28-17-52-17.txt', map: 'Rialto', mode: 'Escort', originalTeams: ['Tempest', 'Paradise Aegis'] },
    { file: 'Log-2023-08-28-18-28-25.txt', map: 'New Queen Street', mode: 'Push', originalTeams: ['Tempest', 'Paradise Aegis'] },
    { file: 'Log-2023-08-28-18-40-39.txt', map: 'Ilios', mode: 'Control', originalTeams: ['Tempest', 'Paradise Aegis'] }
];

const HERO_TEAM_NAME = "SPQR";
const OPPONENT_TEAM_NAME = "Greek Pantheon";

// Base Roster from the logs (Team 1 / Tempest)
const ROSTER_A = ["Huntertain", "Shadowph33r", "KANKAN", "Triage3", "Ranc1dRandy"];
// Base Roster from the logs (Team 2 / Paradise Aegis)
const ROSTER_B = ["BrickWall", "Tubeit", "Alert", "Duelan", "persephone"];

// New Personas
const HERO_PLAYERS = ["Jupiter", "Mars", "Neptune", "Mercury", "Vulcan"];
const OPPONENT_PLAYERS = ["Zeus", "Hera", "Poseidon", "Ares", "Athena"];

// Compatible Map Pools for "Reskinning"
const MAP_pools = {
    'Control': ["Oasis", "Ilios", "Lijiang Tower", "Nepal", "Antarctica Peninsula", "Busan", "Samoa"],
    'Hybrid': ["Hollywood", "King's Row", "Midtown", "Numbani", "Paraíso", "Blizzard World", "Eichenwalde"],
    'Escort': ["Rialto", "Circuit Royal", "Dorado", "Havana", "Junkertown", "Route 66", "Shambali Monastery", "Watchpoint: Gibraltar"],
    'Push': ["New Queen Street", "Colosseo", "Esperança", "Runasapi"],
    'Flashpoint': ["Suravasa", "New Junk City"]
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Loads all template contents into memory
 */
function loadTemplates() {
    return TEMPLATES.map(t => ({
        ...t,
        content: fs.readFileSync(path.join(SAMPLEDATA_DIR, t.file), 'utf-8')
    }));
}

function generate() {
    console.log("Loading templates...");
    const loadedTemplates = loadTemplates();

    // Start date: Friday Sept 1st 2023, 19:00
    let currentBlockDate = new Date('2023-09-01T19:00:00');

    // Generate 5 blocks of 3
    for (let block = 0; block < 5; block++) {
        console.log(`\nGenerating Block ${block + 1} on ${currentBlockDate.toDateString()}`);

        // Randomly shuffle templates for this block to ensure variety within the night
        // We only have 5 templates, maybe pick random 3
        const blockTemplates = [];
        for (let i = 0; i < 3; i++) {
            blockTemplates.push(getRandomItem(loadedTemplates));
        }

        for (let match = 0; match < 3; match++) {
            const template = blockTemplates[match];

            // 1. Determine Time
            const matchTime = new Date(currentBlockDate);
            matchTime.setMinutes(matchTime.getMinutes() + (match * 25) + getRandomInt(-2, 2));

            // 2. Select Map
            // Pick a random compatible map from the pool
            const possibleMaps = MAP_pools[template.mode] || [template.map];
            const targetMap = getRandomItem(possibleMaps);

            // 3. Determine Sides (Flip coin for who plays which 'role' in the log)
            // If flipped=false: SPQR takes Roster A slots, Greek takes Roster B slots.
            // If flipped=true: Greek takes Roster A slots, SPQR takes Roster B slots.
            const flipped = Math.random() < 0.5;

            let team1Name, team2Name; // Map to template's Team 1 / Team 2
            let roster1Map = {}, roster2Map = {};

            if (!flipped) {
                // SPQR is "Team 1" (The Tempest/Team1 slot)
                team1Name = HERO_TEAM_NAME;
                team2Name = OPPONENT_TEAM_NAME;
                // Map Roster A -> Hero Players
                ROSTER_A.forEach((original, i) => roster1Map[original] = HERO_PLAYERS[i]);
                // Map Roster B -> Opponent Players
                ROSTER_B.forEach((original, i) => roster2Map[original] = OPPONENT_PLAYERS[i]);
            } else {
                // Greek is "Team 1"
                team1Name = OPPONENT_TEAM_NAME;
                team2Name = HERO_TEAM_NAME;
                // Map Roster A -> Opponent Players
                ROSTER_A.forEach((original, i) => roster1Map[original] = OPPONENT_PLAYERS[i]);
                // Map Roster B -> Hero Players
                ROSTER_B.forEach((original, i) => roster2Map[original] = HERO_PLAYERS[i]);
            }

            // 4. Process Content
            let newContent = template.content;

            // Map Replacement (Naive replace of the template map name)
            // It usually appears in match_start
            newContent = newContent.split(template.map).join(targetMap);

            // Team Name Replacement
            const [t1Original, t2Original] = template.originalTeams;
            // Use global replace
            newContent = newContent.split(t1Original).join(team1Name);
            newContent = newContent.split(t2Original).join(team2Name);

            // Player Replacement
            // We must replace ALL players from both rosters based on the mapping
            // Merge maps
            const allPlayerMap = { ...roster1Map, ...roster2Map };

            for (const [original, target] of Object.entries(allPlayerMap)) {
                newContent = newContent.split(original).join(target);
            }

            // Write File
            const year = matchTime.getFullYear();
            const month = String(matchTime.getMonth() + 1).padStart(2, '0');
            const day = String(matchTime.getDate()).padStart(2, '0');
            const hour = String(matchTime.getHours()).padStart(2, '0');
            const minute = String(matchTime.getMinutes()).padStart(2, '0');
            const second = String(matchTime.getSeconds()).padStart(2, '0');

            const fileName = `Log-${year}-${month}-${day}-${hour}-${minute}-${second}.txt`;
            const outputPath = path.join(SAMPLEDATA_DIR, fileName);

            fs.writeFileSync(outputPath, newContent);

            // Log what actually happened
            const heroRole = !flipped ? "Team 1" : "Team 2";
            console.log(`  Generated ${fileName}: ${targetMap} (${template.mode}). SPQR is ${heroRole}`);
        }

        // Advance Schedule
        if (currentBlockDate.getDay() === 5) { // Friday -> Saturday
            currentBlockDate.setDate(currentBlockDate.getDate() + 1);
        } else { // Saturday -> Next Friday
            currentBlockDate.setDate(currentBlockDate.getDate() + 6);
        }
    }
}

generate();
