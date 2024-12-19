import React, { useState, useCallback, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';
import IconAndTextButton from '~/components/Common/IconAndText';
import { useWidgetRegistry } from '~/WidgetProvider';
import { useWombatData } from 'wombat-data-framework';
import { MatchData } from '~/WombatDataFrameworkSchema';

interface FileLoaderProps {
  onSubmit: (files: File[]) => void;
}

const FileLoader: React.FC<FileLoaderProps> = ({ onSubmit }) => {
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setIsProcessing(true);
    onSubmit(stagedFiles);
    // setStagedFiles([]); // Clear files after submission
    // setIsProcessing(false);
  };

  const { widgetGridWidth, widgetGridHeight } = useWidgetRegistry();

  const matchData = useWombatData<MatchData>('match_data');

  console.log('matchData', matchData);
  console.log('stagedFile names', stagedFiles.map(file => file.name));

  const stagedFilesCount = stagedFiles.length;
  const stagedFilesFound = stagedFiles.filter(file => matchData.data.find(match => match.fileName === file.name)).length;
  const percentFound = (stagedFilesFound / stagedFilesCount) * 100;

  useEffect(() => {
    if (isProcessing && percentFound === 100) {
      setTimeout(() => {
        setIsProcessing(false);
        setStagedFiles([]);
      }, 100);
    }
  }, [isProcessing, percentFound]);

  return (
    <Box sx={{
      padding: stagedFiles.length === 0 ? 0 : "10px",
      width: widgetGridWidth,
      height: widgetGridHeight,
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: `1fr ${stagedFiles.length === 0 ? '0px' : '30px'}`,
      gridTemplateAreas: `
        "main"
        "submit"
      `
    }}>
      {stagedFiles.length === 0 && (
        <Paper
          {...getRootProps()}
          elevation={3}
          sx={{
            padding: 2,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'primary.main',
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            // backgroundColor: isDragActive ? '#f0f0f0' : 'white',
            marginBottom: 2,
            gridArea: 'main',
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body1">
            {isDragActive
              ? 'Drop match logs here...'
              : 'Drop match logs here, or click to select from system'}
          </Typography>
        </Paper>
      )}

      {stagedFiles.length > 0 && !isProcessing && (
        <Box sx={{ gridArea: 'main' }}>
          <List>
            {stagedFiles.slice(0, 3).map((file, index) => (
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
                <ListItemText secondary={file.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {isProcessing && (
        <Box sx={{ gridArea: 'main' }}>
          <CircularProgress variant="determinate" value={percentFound} />
        </Box>
      )}

      <Grid container justifyContent="space-between" alignItems="baseline" flexDirection="row-reverse" sx={{ gridArea: 'submit' }}>
        {stagedFiles.length > 0 && !isProcessing && (
          <>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={stagedFiles.length === 0}
              size="small"

            >
              Process {stagedFiles.length} match{stagedFiles.length !== 1 ? 'es' : ''}
            </Button>
            {stagedFiles.length > 3 && (
              <Typography variant="subtitle2" sx={{ marginLeft: 1 }}>
                + {stagedFiles.length - 3} more match{stagedFiles.length - 3 !== 1 ? 'es' : ''}
              </Typography>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default FileLoader;