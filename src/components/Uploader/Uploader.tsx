import React, { useState } from 'react';
import { Button, Dialog, Typography } from '@mui/material';
import { useWombatDataManager } from 'wombat-data-framework';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FileLoader from '~/components/FileLoader/FileLoader';

const Uploader: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const dataManager = useWombatDataManager();

  return (
    <>
      <Button variant="outlined" component="label" color="primary" sx={{
        minWidth: '200px', minHeight: '200px', border: '2px dashed',
        borderColor: 'primary.main',
        cursor: 'pointer',
      }} startIcon={<NoteAddIcon />} className="dashboard-item primary" onClick={() => setModalOpen(true)}>
        <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
          Add matches
        </Typography>
      </Button>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <FileLoader onSubmit={(files) => {
          setModalOpen(false);
          dataManager.setInputForInputNode('log_file_input', files);
        }} />
      </Dialog>
    </>
  );
};

export default Uploader;
