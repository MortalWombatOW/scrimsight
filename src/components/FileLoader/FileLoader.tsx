import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';
import IconAndText from '~/components/Common/IconAndText';

interface FileLoaderProps {
  onSubmit: (files: File[]) => void;
}

const FileLoader: React.FC<FileLoaderProps> = ({ onSubmit }) => {
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setStagedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setStagedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit(stagedFiles);
    setStagedFiles([]); // Clear files after submission
  };

  return (
    <Box sx={{ padding: 0 }}>
      <Paper
        {...getRootProps()}
        elevation={3}
        sx={{
          padding: 2,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'primary.main',
          cursor: 'pointer',
          width: '200px',
          height: '220px',
          // backgroundColor: isDragActive ? '#f0f0f0' : 'white',
          marginBottom: 2,
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body1">
          {isDragActive
            ? 'Drop files here...'
            : 'Drop log files here, or click to select from system'}
        </Typography>
      </Paper>

      {stagedFiles.length > 0 && (
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">Staged Files:</Typography>
          <List>
            {stagedFiles.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeFile(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }

              >
                <ListItemText primary={<IconAndText icon={<ArticleIcon />} text={file.name} />} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Grid container justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={stagedFiles.length === 0}
        >
          Load {stagedFiles.length} File{stagedFiles.length !== 1 ? 's' : ''}
        </Button>
      </Grid>
    </Box>
  );
};

export default FileLoader;