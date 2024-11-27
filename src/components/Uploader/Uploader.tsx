import React, { ChangeEvent, useState } from 'react';
import { Button } from '@mui/material';
import UploadProgressModal from './UploadProgressModal';
import { FileUpload } from 'lib/data/types';
import { useWombatDataManager, DataManager, useWombatDataNode } from 'wombat-data-framework';
import { InputNode } from 'wombat-data-framework';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Typography } from '../../WombatUI/WombatUI';
interface UploaderProps {
  refreshCallback?: () => void;
}

const useFileUpload = (uploadFileHandler, dataManager, refreshCallback) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [filePercents, setFilePercents] = useState<{
    [fileName: string]: number;
  }>({});

  const handleFilePerChange = (fileName: string) => (percent: number) => {
    setFilePercents((prev) => ({ ...prev, [fileName]: percent }));
    if (percent === 100) {
      refreshCallback && refreshCallback();
    }
  };

  const startFileUploads = async (fileUploads: FileUpload[]) => {
    setFiles((files) => [...files, ...fileUploads]);
    for (const fileUpload of fileUploads) {
      await uploadFileHandler(fileUpload, dataManager, handleFilePerChange(fileUpload.fileName));
    }
  };

  return { files, filePercents, startFileUploads };
};

const Uploader: React.FC<UploaderProps> = ({ refreshCallback = () => { } }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const dataManager = useWombatDataManager();
  // const { files, filePercents, startFileUploads } = useFileUpload(uploadFileHandler, dataManager, refreshCallback);


  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // const filesToUpload: FileUpload[] = Array.from(e.target.files).map((file) => ({
    //   file,
    //   fileName: file.name,
    // }));
    dataManager.setInputForInputNode('log_file_input', Array.from(e.target.files));
    // setModalOpen(true);
  };

  return (
    // <>
    <Button variant="outlined" component="label" color="primary" sx={{ minWidth: '200px', minHeight: '200px', backgroundColor: "rgb(14, 71, 77)" }} startIcon={<NoteAddIcon />} className="dashboard-item primary">
      <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>Add logs</Typography>
      <input id="fileinput" type="file" onChange={onInputChange} hidden multiple />
    </Button>
    // </>
  );
};

export default Uploader;
