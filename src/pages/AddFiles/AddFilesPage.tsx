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

import { Container, Typography, Box, Button, List, ListItem, Paper, IconButton } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { logFileInputAtom, logFileInputMutationAtom } from '../../atoms/files';
import { ChangeEvent } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export const AddFilesPage = () => {
  const [, setFiles] = useAtom(logFileInputMutationAtom);
  const logFileInput = useAtomValue(logFileInputAtom);

  const handleAddDirectory = async () => {
    try {
      if (!window.showDirectoryPicker) {
        console.error('Directory upload is supported only in Chrome.');
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

      setFiles(files);
    } catch (error) {
      console.error('Error adding directory:', error);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const filteredFiles = filesArray.filter(file =>
        (file.type && file.type.startsWith('text')) || file.name.endsWith('.txt')
      );
      setFiles(filteredFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = logFileInput.files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Files
      </Typography>
      <Box sx={{ mb: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Add Directory (Chrome Only)
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddDirectory}
          disabled={!window.showDirectoryPicker}
          sx={{ mb: 2 }}
        >
          Add Directory
        </Button>
        {!window.showDirectoryPicker && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Directory upload is only supported in Chrome.
          </Typography>
        )}
      </Box>
      <Box sx={{ mb: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Upload Files
        </Typography>
        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2 }}
        >
          Browse Files
          <input
            type="file"
            multiple
            accept="text/*,.txt"
            onChange={handleFileUpload}
            hidden
          />
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Files Added
        </Typography>
        <List>
          {logFileInput.files.map((file, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(index)}>
                <DeleteIcon />
              </IconButton>
            }>
              {file.name}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}; 