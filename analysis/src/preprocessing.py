"""
Preprocessing utilities for the Parsertime dataset.

Handles match-level enrichment (map info, winners), role classification,
and composition tagging.
"""

import pandas as pd


# Hero → Role mapping for Overwatch 2
HERO_ROLES = {
    # Tanks
    "D.Va": "Tank", "Doomfist": "Tank", "Junker Queen": "Tank",
    "Mauga": "Tank", "Orisa": "Tank", "Ramattra": "Tank",
    "Reinhardt": "Tank", "Roadhog": "Tank", "Sigma": "Tank",
    "Winston": "Tank", "Wrecking Ball": "Tank", "Zarya": "Tank",
    "Hazard": "Tank",
    # DPS
    "Ashe": "DPS", "Bastion": "DPS", "Cassidy": "DPS",
    "Echo": "DPS", "Genji": "DPS", "Hanzo": "DPS",
    "Junkrat": "DPS", "Mei": "DPS", "Pharah": "DPS",
    "Reaper": "DPS", "Sojourn": "DPS", "Soldier: 76": "DPS",
    "Sombra": "DPS", "Symmetra": "DPS", "Torbjörn": "DPS",
    "Tracer": "DPS", "Widowmaker": "DPS", "Venture": "DPS",
    # Supports
    "Ana": "Support", "Baptiste": "Support", "Brigitte": "Support",
    "Illari": "Support", "Juno": "Support", "Kiriko": "Support",
    "Lifeweaver": "Support", "Lúcio": "Support", "Mercy": "Support",
    "Moira": "Support", "Zenyatta": "Support",
}

# Composition archetype signatures: if a team's heroes include these combos,
# tag the comp accordingly. Checked in priority order.
COMP_SIGNATURES = {
    "Dive": {
        "tanks": {"Winston", "Wrecking Ball", "D.Va", "Doomfist"},
        "dps": {"Tracer", "Genji", "Sombra", "Echo"},
        "supports": {"Lúcio", "Kiriko", "Ana"},
    },
    "Brawl": {
        "tanks": {"Reinhardt", "Junker Queen", "Ramattra", "Mauga"},
        "dps": {"Reaper", "Mei", "Symmetra", "Cassidy"},
        "supports": {"Lúcio", "Brigitte", "Baptiste", "Moira"},
    },
    "Poke": {
        "tanks": {"Sigma", "Orisa"},
        "dps": {"Hanzo", "Widowmaker", "Ashe", "Sojourn", "Soldier: 76", "Junkrat"},
        "supports": {"Ana", "Baptiste", "Zenyatta"},
    },
}


def get_role(hero: str) -> str:
    """Map a hero name to their role (Tank/DPS/Support)."""
    return HERO_ROLES.get(hero, "Unknown")


def add_role_column(df: pd.DataFrame, hero_col: str = "player_hero") -> pd.DataFrame:
    """Add a 'role' column based on hero name."""
    df = df.copy()
    df["role"] = df[hero_col].map(HERO_ROLES).fillna("Unknown").astype("category")
    return df


def determine_match_winner(match_end: pd.DataFrame, match_start: pd.DataFrame) -> pd.DataFrame:
    """
    Create a match-level dataframe with map info and winner.
    Joins MatchStart (map_name, teams) with MatchEnd (scores).
    """
    matches = match_start.merge(
        match_end[["MapDataId", "team_1_score", "team_2_score"]],
        on="MapDataId",
        how="inner",
    )

    def _winner(row):
        if row["team_1_score"] > row["team_2_score"]:
            return row["team_1_name"]
        elif row["team_2_score"] > row["team_1_score"]:
            return row["team_2_name"]
        return "Draw"

    matches["winner"] = matches.apply(_winner, axis=1)
    return matches


def classify_composition(heroes: list[str]) -> str:
    """
    Classify a set of heroes into a composition archetype (Dive/Brawl/Poke/Mixed).
    Uses signature-based matching: scores each archetype by how many heroes
    match its signature, returns the highest-scoring one.
    """
    scores = {}
    for archetype, sigs in COMP_SIGNATURES.items():
        score = 0
        all_sig_heroes = sigs["tanks"] | sigs["dps"] | sigs["supports"]
        for hero in heroes:
            if hero in all_sig_heroes:
                score += 1
        scores[archetype] = score

    best = max(scores, key=scores.get)
    # Require at least 2 heroes to match a signature to avoid false positives
    if scores[best] >= 2:
        return best
    return "Mixed"


def enrich_kills_with_match_info(kills: pd.DataFrame, matches: pd.DataFrame) -> pd.DataFrame:
    """Add map_name, map_type, winner columns to kills via MapDataId."""
    return kills.merge(
        matches[["MapDataId", "map_name", "map_type", "team_1_name", "team_2_name", "winner"]],
        on="MapDataId",
        how="left",
    )


KNOWN_HEROES = set(HERO_ROLES.keys())


def cat_eq(s1: pd.Series, s2: pd.Series) -> pd.Series:
    """Compare two categorical series safely (avoids pandas category mismatch error)."""
    return s1.astype(str) == s2.astype(str)


def cat_ne(s1: pd.Series, s2: pd.Series) -> pd.Series:
    """Not-equal comparison for two categorical series."""
    return s1.astype(str) != s2.astype(str)


def filter_known_heroes(df: pd.DataFrame, hero_cols: list[str] | None = None) -> pd.DataFrame:
    """
    Filter out rows with localized (non-English) hero names.
    ~4% of data has Japanese/Russian/Chinese/French hero names that
    we can't reliably map to roles. Dropping them keeps analysis clean.
    """
    if hero_cols is None:
        # Auto-detect hero columns
        hero_cols = [c for c in df.columns if "hero" in c.lower()]
    mask = pd.Series(True, index=df.index)
    for col in hero_cols:
        if col in df.columns:
            mask &= df[col].isin(KNOWN_HEROES)
    return df[mask].copy()
