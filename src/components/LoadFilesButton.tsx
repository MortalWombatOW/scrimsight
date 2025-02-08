"use client";

// Declare minimal types for the File System Access API
interface FileSystemHandle {
  kind: 'file' | 'directory';
  getFile?: () => Promise<File>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  values(): AsyncIterable<FileSystemHandle>;
}

// Extend the global Window interface to include showDirectoryPicker
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
}

import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { logFileInputMutationAtom } from '../atoms/files';

export const LoadFilesButton = () => {
  const [, setFiles] = useAtom(logFileInputMutationAtom);

  const handleLoadFiles = async () => {
    try {
      if (!window.showDirectoryPicker) {
        console.error('File System Access API is not supported in this browser.');
        return;
      }
      const directoryHandle = await window.showDirectoryPicker();
      const files: File[] = [];

      // Iterate over the directory entries
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === 'file' && entry.getFile) {
          const file = await entry.getFile();
          // Check if the file is a text file by type or .txt extension
          if ((file.type && file.type.startsWith('text')) || file.name.endsWith('.txt')) {
            files.push(file);
          }
        }
      }

      // Update the logFileInput atom with the found text files
      setFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  return (
    <Button onClick={handleLoadFiles} variant="contained" color="primary">
      Load Files
    </Button>
  );
}; 
