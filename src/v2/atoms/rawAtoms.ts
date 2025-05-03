import { atom } from 'jotai';
import { sampleDataAtom } from '../../atoms/files/sampleDataAtoms';

// Define Raw Layer interfaces
export interface RawLogInput {
  files: File[];
}

export interface RawLogContent {
  fileName: string;
  fileContent: string;
  fileModified: number;
}

// Function to read file content asynchronously
const readFileAsync = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Raw layer input atom
export const rawLogInputAtom = atom<RawLogInput>({ files: [] });

// Raw layer mutation atom for updating input
export const rawLogInputMutationAtom = atom(
  (get) => get(rawLogInputAtom),
  (_, set, update: RawLogInput) => {
    set(rawLogInputAtom, update);
  }
);

// Raw layer content loading atom
export const rawLogContentAtom = atom(async (get): Promise<RawLogContent[]> => {
  const { files } = get(rawLogInputAtom);
  const sampleData = get(sampleDataAtom);
  
  // Process uploaded files
  const processedFiles = await Promise.all(
    files.map(async (file) => {
      const fileContent = await readFileAsync(file);
      return {
        fileName: file.name,
        fileContent,
        fileModified: file.lastModified
      };
    })
  );
  
  // Combine with sample data
  return [...processedFiles, ...sampleData];
});