import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { buildDataModel } from './buildDataModel';
import file1 from "@library/sampledata/Log-2023-08-28-17-05-38.txt?raw";
import file2 from "@library/sampledata/Log-2023-08-28-17-29-57.txt?raw";

// Setup mocks before importing the service
vi.mock('comlink', () => ({
  wrap: vi.fn().mockReturnValue({
    processFiles: async (files: any[]) => {
      return buildDataModel(files);
    }
  }),
  expose: vi.fn()
}));

// Mock Worker for testing
class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((error: ErrorEvent) => void) | null = null;
  
  constructor(_url: string | URL, _options?: WorkerOptions) {
    // Simulate worker initialization
  }
  
  postMessage(message: any) {
    // Simulate processing in next tick
    setTimeout(() => {
      try {
        // Simulate the actual worker processing
        const { files } = message;
        const dataModel = buildDataModel(files);
        
        if (this.onmessage) {
          this.onmessage({ data: dataModel } as MessageEvent);
        }
      } catch (error) {
        if (this.onerror) {
          this.onerror({ message: error instanceof Error ? error.message : 'Unknown error' } as ErrorEvent);
        }
      }
    }, 10);
  }
  
  terminate() {
    // Cleanup
  }
}

// Mock the global Worker
global.Worker = MockWorker as any;

// Import the service after mocks are set up
import { ScrimsightDataService } from './ScrimsightDataService';

describe('ScrimsightDataService', () => {
  let service: ScrimsightDataService;

  beforeEach(() => {
    service = new ScrimsightDataService();
  });

  afterEach(() => {
    service.dispose();
  });

  describe('initialization', () => {
    it('should initialize without throwing', () => {
      expect(() => new ScrimsightDataService()).not.toThrow();
    });

    it('should start with no data available', () => {
      expect(service.isDataAvailable()).toBe(false);
    });

    it('should throw when trying to get data model before adding files', () => {
      expect(() => service.getDataModel()).toThrow('No data model available');
    });
  });

  describe('file processing', () => {
    const createMockFile = (name: string, content: string, lastModified: number = Date.now()): File => {
      const blob = new Blob([content], { type: 'text/plain' });
      const file = new File([blob], name, { lastModified });
      return file;
    };

    it('should accept and process files', async () => {
      const mockFiles = [
        createMockFile('test1.txt', file1, new Date("2023-08-28T17:05:38.000Z").getTime()),
        createMockFile('test2.txt', file2, new Date("2023-08-28T17:29:57.000Z").getTime())
      ];

      await service.addFiles(mockFiles);

      expect(service.isDataAvailable()).toBe(true);
      const dataModel = service.getDataModel();
      expect(dataModel).toBeDefined();
      expect(dataModel.scrims.length).toBeGreaterThan(0);
    });

    it('should handle empty file list', async () => {
      await service.addFiles([]);
      
      expect(service.isDataAvailable()).toBe(true);
      const dataModel = service.getDataModel();
      expect(dataModel.scrims).toHaveLength(0);
      expect(dataModel.matches).toHaveLength(0);
    });

    it('should prevent concurrent processing', async () => {
      const mockFiles = [createMockFile('test.txt', file1)];

      // Start first processing
      const firstPromise = service.addFiles(mockFiles);
      
      // Try to start second processing immediately
      await expect(service.addFiles(mockFiles)).rejects.toThrow('Already processing files');

      // Wait for first to complete
      await firstPromise;
    });

    it('should allow processing after previous completion', async () => {
      const mockFiles = [createMockFile('test.txt', file1)];

      await service.addFiles(mockFiles);
      expect(service.isDataAvailable()).toBe(true);

      // Should be able to process again
      await expect(service.addFiles(mockFiles)).resolves.not.toThrow();
    });
  });

  describe('data management', () => {
    const createMockFile = (name: string, content: string, lastModified: number = Date.now()): File => {
      const blob = new Blob([content], { type: 'text/plain' });
      return new File([blob], name, { lastModified });
    };

    it('should clear data when requested', async () => {
      const mockFiles = [createMockFile('test.txt', file1)];
      
      await service.addFiles(mockFiles);
      expect(service.isDataAvailable()).toBe(true);

      service.clearData();
      expect(service.isDataAvailable()).toBe(false);
      expect(() => service.getDataModel()).toThrow('No data model available');
    });

    it('should return the same data model on multiple calls', async () => {
      const mockFiles = [createMockFile('test.txt', file1)];
      
      await service.addFiles(mockFiles);
      
      const dataModel1 = service.getDataModel();
      const dataModel2 = service.getDataModel();
      
      expect(dataModel1).toBe(dataModel2); // Should be the same object reference
    });
  });

  describe('integration with buildDataModel', () => {
    const createMockFile = (name: string, content: string, lastModified: number = Date.now()): File => {
      const blob = new Blob([content], { type: 'text/plain' });
      return new File([blob], name, { lastModified });
    };

    it('should produce the same results as calling buildDataModel directly', async () => {
      const mockFiles = [
        createMockFile('Log-2023-08-28-17-05-38.txt', file1, new Date("2023-08-28T17:05:38.000Z").getTime()),
        createMockFile('Log-2023-08-28-17-29-57.txt', file2, new Date("2023-08-28T17:29:57.000Z").getTime())
      ];

      // Process through service
      await service.addFiles(mockFiles);
      const serviceResult = service.getDataModel();

      // Process directly
      const directFiles = [
        {
          fileName: 'Log-2023-08-28-17-05-38.txt',
          fileModified: new Date("2023-08-28T17:05:38.000Z").getTime(),
          fileContent: file1
        },
        {
          fileName: 'Log-2023-08-28-17-29-57.txt',
          fileModified: new Date("2023-08-28T17:29:57.000Z").getTime(),
          fileContent: file2
        }
      ];
      const directResult = buildDataModel(directFiles);

      // Compare key metrics (deep equality would be complex due to objects)
      expect(serviceResult.scrims.length).toBe(directResult.scrims.length);
      expect(serviceResult.matches.length).toBe(directResult.matches.length);
      expect(serviceResult.teams.length).toBe(directResult.teams.length);
      expect(serviceResult.players.length).toBe(directResult.players.length);
      expect(serviceResult.kill.length).toBe(directResult.kill.length);
      expect(serviceResult.matchStart.length).toBe(directResult.matchStart.length);
    });
  });

  describe('error handling', () => {
    it('should handle worker initialization failure gracefully', () => {
      // Mock Worker constructor to throw
      const originalWorker = global.Worker;
      global.Worker = vi.fn().mockImplementation(() => {
        throw new Error('Worker initialization failed');
      });

      let serviceWithFailedWorker: ScrimsightDataService;
      expect(() => {
        serviceWithFailedWorker = new ScrimsightDataService();
      }).not.toThrow();

      // Restore Worker
      global.Worker = originalWorker as any;
    });

    it('should throw when worker is not available for processing', async () => {
      // Create service with failed worker initialization
      const originalWorker = global.Worker;
      global.Worker = vi.fn().mockImplementation(() => {
        throw new Error('Worker initialization failed');
      });

      const serviceWithFailedWorker = new ScrimsightDataService();
      
      const mockFiles = [new File(['test'], 'test.txt')];
      await expect(serviceWithFailedWorker.addFiles(mockFiles)).rejects.toThrow('Web worker not available');

      // Restore Worker
      global.Worker = originalWorker as any;
      serviceWithFailedWorker.dispose();
    });
  });

  describe('dispose', () => {
    it('should clean up resources when disposed', async () => {
      const mockFiles = [new File([file1], 'test.txt')];
      
      await service.addFiles(mockFiles);
      expect(service.isDataAvailable()).toBe(true);

      service.dispose();
      expect(service.isDataAvailable()).toBe(false);
      expect(() => service.getDataModel()).toThrow('No data model available');
    });

    it('should handle multiple dispose calls gracefully', () => {
      expect(() => {
        service.dispose();
        service.dispose();
      }).not.toThrow();
    });
  });

  describe('file reading', () => {
    it('should handle file reading errors', async () => {
      // Create a mock file that will fail to read
      const mockFile = {
        name: 'test.txt',
        lastModified: Date.now(),
        stream: () => {
          throw new Error('File read error');
        }
      } as unknown as File;

      // Mock FileReader to simulate read error
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn().mockImplementation(() => ({
        readAsText: vi.fn().mockImplementation(function(this: any) {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('Mock file read error'));
            }
          }, 0);
        })
      })) as any;

      await expect(service.addFiles([mockFile])).rejects.toThrow();

      // Restore FileReader
      global.FileReader = originalFileReader;
    });
  });
});