import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { logFileParserAtomFn } from '@atoms/logFileParserAtom';
import type { LogFileLoaderType } from '@atoms';
import { parseFile, stringHash } from '@library';

// Mock @library functions
const mockParseFile = parseFile as MockedFunction<typeof parseFile>;
const mockStringHash = stringHash as MockedFunction<typeof stringHash>;

vi.mock('@library', () => ({
  parseFile: vi.fn(),
  stringHash: vi.fn(),
}));

describe('logFileParserAtomFn', () => {
  const mockLoadedFile: LogFileLoaderType[0] = {
    fileName: 'loaded.txt',
    fileContent: 'loaded content',
    fileModified: 1234567890,
  };

  const mockSampleFile: LogFileLoaderType[0] = {
    fileName: 'sample.txt',
    fileContent: 'sample content',
    fileModified: 9876543210,
  };

  it('should parse loaded files and sample data files correctly', () => {
    // Add a dummy matchId to satisfy the inferred type for mockReturnValueOnce
    mockParseFile.mockReturnValueOnce({ logs: [{ specName: 'testSpec1', data: [{ msg: 'log1' }] }], matchId: 'dummyMatchId1' });
    mockStringHash.mockReturnValueOnce(123);
    mockParseFile.mockReturnValueOnce({ logs: [{ specName: 'testSpec2', data: [{ msg: 'log2' }] }], matchId: 'dummyMatchId2' });
    mockStringHash.mockReturnValueOnce(456);

    const loadedFiles: LogFileLoaderType = [mockLoadedFile];
    const sampleDataFiles: LogFileLoaderType = [mockSampleFile];

    const result = logFileParserAtomFn(loadedFiles, sampleDataFiles);

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      fileName: 'loaded.txt',
      matchId: '123',
      logs: [{ specName: 'testSpec1', data: [{ msg: 'log1' }] }],
      fileModified: 1234567890,
    });

    expect(result[1]).toEqual({
      fileName: 'sample.txt',
      matchId: '456',
      logs: [{ specName: 'testSpec2', data: [{ msg: 'log2' }] }],
      fileModified: 9876543210,
    });

    expect(parseFile).toHaveBeenCalledTimes(2);
    expect(parseFile).toHaveBeenCalledWith('loaded content');
    expect(parseFile).toHaveBeenCalledWith('sample content');
    expect(stringHash).toHaveBeenCalledTimes(2);
    expect(stringHash).toHaveBeenCalledWith('loaded content');
    expect(stringHash).toHaveBeenCalledWith('sample content');
  });

  it('should return an empty array if no files are provided', () => {
    const result = logFileParserAtomFn([], []);
    expect(result).toEqual([]);
    expect(mockParseFile).not.toHaveBeenCalled();
    expect(mockStringHash).not.toHaveBeenCalled();
  });

  it('should handle only loaded files', () => {
    mockParseFile.mockReturnValueOnce({ logs: [{ specName: 'testSpecLoaded', data: [{ msg: 'loadedOnly' }] }], matchId: 'dummyMatchId3' });
    mockStringHash.mockReturnValueOnce(789);

    const loadedFiles: LogFileLoaderType = [mockLoadedFile];
    const result = logFileParserAtomFn(loadedFiles, []);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      fileName: 'loaded.txt',
      matchId: '789',
      logs: [{ specName: 'testSpecLoaded', data: [{ msg: 'loadedOnly' }] }],
      fileModified: 1234567890,
    });
    expect(mockParseFile).toHaveBeenCalledWith('loaded content');
    expect(mockStringHash).toHaveBeenCalledWith('loaded content');
  });

  it('should handle only sample data files', () => {
    mockParseFile.mockReturnValueOnce({ logs: [{ specName: 'testSpecSample', data: [{ msg: 'sampleOnly' }] }], matchId: 'dummyMatchId4' });
    mockStringHash.mockReturnValueOnce(101);

    const sampleDataFiles: LogFileLoaderType = [mockSampleFile];
    const result = logFileParserAtomFn([], sampleDataFiles);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      fileName: 'sample.txt',
      matchId: '101',
      logs: [{ specName: 'testSpecSample', data: [{ msg: 'sampleOnly' }] }],
      fileModified: 9876543210,
    });
    expect(mockParseFile).toHaveBeenCalledWith('sample content');
    expect(mockStringHash).toHaveBeenCalledWith('sample content');
  });

  // Reset mocks after each test
  afterEach(() => {
    vi.clearAllMocks();
  });
});
