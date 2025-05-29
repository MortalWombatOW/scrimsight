import { logFileInputAtomFn } from './logFileInputAtom';

describe('logFileInputAtomFn', () => {
  it('should return an object with the provided files', () => {
    const mockFiles = [new File([], 'test1.txt'), new File([], 'test2.txt')];
    const result = logFileInputAtomFn(mockFiles);
    expect(result).toEqual({ files: mockFiles });
  });

  it('should return an empty array when no files are provided', () => {
    const result = logFileInputAtomFn([]);
    expect(result).toEqual({ files: [] });
  });
});
