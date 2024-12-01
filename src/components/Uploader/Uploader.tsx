import React, { ChangeEvent, useState } from 'react';
import { Button } from '@mui/material';
import UploadProgressModal from './UploadProgressModal';
import { useWombatDataManager } from 'wombat-data-framework';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Typography } from '../../WombatUI/WombatUI';

interface UploaderProps {
  refreshCallback?: () => void;
}

const Uploader: React.FC<UploaderProps> = ({ refreshCallback = () => { } }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const dataManager = useWombatDataManager();

  // Get all object store nodes
  const objectStoreNames = dataManager.getAllNodes()
    .map(node => node.getName())
    .filter(nodeName => nodeName.endsWith('_object_store'));

  const fileNames = dataManager.getAllNodes()
    .map(node => node.getName())
    .filter(nodeName => nodeName.endsWith('maps_object_store'));

  // Get initial and current row counts
  const initialRowCounts = objectStoreNames.reduce((acc, storeName) => {
    acc[storeName] = 0;
    return acc;
  }, {} as Record<string, number>);

  const rowCounts = fileNames.reduce((acc, fileName) => {
    const out = objectStoreNames.reduce((acc2, storeName) => {
      acc2[storeName] = dataManager.getNode(storeName)?.getOutput<unknown[]>()?.length || 0;
      return acc2;
    }, {} as Record<string, number>);
    acc[fileName] = out;
    return acc;
  }, {} as { [fileName: string]: { [objectStoreName: string]: number } });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    dataManager.setInputForInputNode('log_file_input', Array.from(e.target.files));
    setModalOpen(true);
  };

  return (
    <>
      <Button
        variant="outlined"
        component="label"
        color="primary"
        sx={{ minWidth: '200px', minHeight: '200px', backgroundColor: "rgb(14, 71, 77)" }}
        startIcon={<NoteAddIcon />}
        className="dashboard-item primary"
      >
        <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>Add logs</Typography>
        <input id="fileinput" type="file" onChange={onInputChange} hidden multiple />
      </Button>
      <UploadProgressModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        initialRowCounts={initialRowCounts}
        rowCounts={rowCounts}
        objectStoreNames={objectStoreNames}
      />
    </>
  );
};

export default Uploader;
