import React, { useCallback } from 'react';
import { useAtom } from 'jotai';
import { matchDataAtom } from '~/atoms';
import { Box, Button, Typography } from '@mui/material';
import { FileUpload } from '@mui/icons-material';

interface FileLoaderProps {
  onSubmit: (files: File[]) => void;
}

export const FileLoader: React.FC<FileLoaderProps> = ({ onSubmit }) => {
  const [, setMatchData] = useAtom(matchDataAtom);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    onSubmit(fileArray);
    
    // Process files...
  }, [setMatchData, onSubmit]);

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <Button
          variant="contained"
          component="span"
          startIcon={<FileUpload />}
          sx={{ mb: 2 }}
        >
          Upload Log Files
        </Button>
      </label>
      <Typography variant="body2" color="text.secondary">
        Select one or more log files to analyze
      </Typography>
    </Box>
  );
};