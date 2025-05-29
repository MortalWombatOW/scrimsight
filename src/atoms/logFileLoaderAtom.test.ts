import { vi, describe, it, expect, beforeEach } from 'vitest';
import { logFileLoaderAtomFn } from './logFileLoaderAtom';
import { readFileAsync } from '@library/scrimtime';
import type { LogFileInputType } from '@atoms';

// Mock the readFileAsync utility
vi.mock('@library/scrimtime', () => ({
  readFileAsync: vi.fn(),
}));

describe('logFileLoaderAtomFn', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.mocked(readFileAsync).mockReset();
  });

  it('should return an empty array if no files are provided', async () => {
    const input: LogFileInputType = { files: [] };
    const result = await logFileLoaderAtomFn(input);
    expect(result).toEqual([]);
  });

  it('should return an empty array if files array is null or undefined (if applicable by type)', async () => {
    // Assuming LogFileInputType allows files to be null/undefined, adjust if not
    const input1: LogFileInputType = { files: null as any }; // Or handle as per actual type
    expect(await logFileLoaderAtomFn(input1)).toEqual([]);
    
    const input2: LogFileInputType = { files: undefined as any }; // Or handle as per actual type
    expect(await logFileLoaderAtomFn(input2)).toEqual([]);
  });

  it('should process a single file correctly', async () => {
    const mockFile = new File(['content1'], 'file1.txt', { lastModified: 1234567890000, type: 'text/plain' });
    const input: LogFileInputType = { files: [mockFile] };

    vi.mocked(readFileAsync).mockResolvedValueOnce('file content 1');

    const result = await logFileLoaderAtomFn(input);

    expect(readFileAsync).toHaveBeenCalledWith(mockFile);
    expect(result).toEqual([
      {
        fileName: 'file1.txt',
        fileModified: 1234567890000,
        fileContent: 'file content 1',
      },
    ]);
  });

  it('should process multiple files concurrently', async () => {
    const mockFile1 = new File(['content1'], 'file1.txt', { lastModified: 1000, type: 'text/plain' });
    const mockFile2 = new File(['content2'], 'file2.log', { lastModified: 2000, type: 'text/plain' });
    const input: LogFileInputType = { files: [mockFile1, mockFile2] };

    vi.mocked(readFileAsync)
      .mockResolvedValueOnce('file content 1')
      .mockResolvedValueOnce('file content 2');

    const result = await logFileLoaderAtomFn(input);

    expect(readFileAsync).toHaveBeenCalledTimes(2);
    expect(readFileAsync).toHaveBeenCalledWith(mockFile1);
    expect(readFileAsync).toHaveBeenCalledWith(mockFile2);
    expect(result).toEqual([
      {
        fileName: 'file1.txt',
        fileModified: 1000,
        fileContent: 'file content 1',
      },
      {
        fileName: 'file2.log',
        fileModified: 2000,
        fileContent: 'file content 2',
      },
    ]);
  });

  it('should handle errors from readFileAsync for a file (e.g., by rejecting or returning specific error structure)', async () => {
    const mockFile1 = new File(['content1'], 'file1.txt', { lastModified: 1000 });
    const mockFile2 = new File(['content2'], 'file2.log', { lastModified: 2000 }); // This one will fail
    const input: LogFileInputType = { files: [mockFile1, mockFile2] };

    vi.mocked(readFileAsync)
      .mockResolvedValueOnce('file content 1')
      .mockRejectedValueOnce(new Error('Failed to read file2.log'));

    // The Promise.all will reject if any of the promises reject.
    // Test that the function re-throws or handles this appropriately.
    await expect(logFileLoaderAtomFn(input)).rejects.toThrow('Failed to read file2.log');
  });
});
