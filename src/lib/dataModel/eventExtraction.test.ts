
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractAllEvents } from './eventExtraction';
import * as ScrimsightDataModel from '../ScrimsightDataModel';
import { extractEventsFromFiles } from '../eventExtractionUtils';

// Mock the utility function
vi.mock('../eventExtractionUtils', () => ({
  extractEventsFromFiles: vi.fn(),
}));

describe('extractAllEvents', () => {
  beforeEach(() => {
    // Clear mock history before each test
    vi.clearAllMocks();
  });

  it('should call extractEventsFromFiles for every event type and populate the data model', () => {
    // Create a mock data model with empty arrays for all event types
    const dataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {};
    const parsedFiles: any[] = [{ matchId: 'test-match', logs: [], fileName: 'test.txt', fileModified: 0 }];

    const eventTypes = {
      ability1Used: 'ability1_used',
      ability2Used: 'ability2_used',
      damage: 'damage',
      defensiveAssist: 'defensive_assist',
      dvaDemech: 'dva_demech',
      dvaRemech: 'dva_remech',
      healing: 'healing',
      heroSpawn: 'hero_spawn',
      heroSwap: 'hero_swap',
      kill: 'kill',
      matchEnd: 'match_end',
      matchStart: 'match_start',
      mercyRez: 'mercy_rez',
      offensiveAssist: 'offensive_assist',
      playerStat: 'player_stat',
      roundEnd: 'round_end',
      roundStart: 'round_start',
      setupComplete: 'setup_complete',
      ultimateCharged: 'ultimate_charged',
      ultimateEnd: 'ultimate_end',
      ultimateStart: 'ultimate_start',
    };

    // Set up the mock to return specific data for each event type
    for (const [key, value] of Object.entries(eventTypes)) {
      (extractEventsFromFiles as vi.Mock).mockImplementation((eventName: string) => {
        if (eventName === value) {
          return [{ type: eventName, mock: true }];
        }
        return [];
      });
    }

    extractAllEvents(dataModel as ScrimsightDataModel.ScrimsightDataModel, parsedFiles);

    // Verify that extractEventsFromFiles was called for each event type
    // and that the data model was populated correctly
    for (const [key, value] of Object.entries(eventTypes)) {
      (extractEventsFromFiles as vi.Mock).mockImplementation((eventName: string) => {
        if (eventName === value) {
          return [{ type: eventName, mock: true }];
        }
        return [];
      });
      extractAllEvents(dataModel as ScrimsightDataModel.ScrimsightDataModel, parsedFiles);
      expect(extractEventsFromFiles).toHaveBeenCalledWith(value, parsedFiles);
      expect(dataModel[key as keyof ScrimsightDataModel.ScrimsightDataModel]).toEqual([{ type: value, mock: true }]);
    }
  });

  it('should handle empty parsedFiles array', () => {
    const dataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {};
    const parsedFiles: any[] = [];

    (extractEventsFromFiles as vi.Mock).mockReturnValue([]);

    extractAllEvents(dataModel as ScrimsightDataModel.ScrimsightDataModel, parsedFiles);

    // Ensure all event arrays in the data model are empty
    const eventKeys = Object.keys(dataModel) as (keyof ScrimsightDataModel.ScrimsightDataModel)[];
    eventKeys.forEach(key => {
      if(Array.isArray(dataModel[key])){
        expect(dataModel[key]).toEqual([]);
      }
    });
  });
});
