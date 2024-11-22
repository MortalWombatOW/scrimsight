/* eslint-disable no-restricted-syntax */
import React, {ChangeEvent, useState} from 'react';
import {Button} from '@mui/material';
import UploadProgressModal from './UploadProgressModal';
import {FileUpload} from 'lib/data/types';
import {useWombatDataManager, DataManager, useWombatDataNode} from 'wombat-data-framework';
import {InputNode} from 'wombat-data-framework';

interface UploaderProps {
  refreshCallback?: () => void;
}

const useFileUpload = (uploadFileHandler, dataManager, refreshCallback) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [filePercents, setFilePercents] = useState<{
    [fileName: string]: number;
  }>({});

  const handleFilePerChange = (fileName: string) => (percent: number) => {
    setFilePercents((prev) => ({...prev, [fileName]: percent}));
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

  return {files, filePercents, startFileUploads};
};

const Uploader: React.FC<UploaderProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshCallback = () => {},
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const dataManager = useWombatDataManager();
  // const { files, filePercents, startFileUploads } = useFileUpload(uploadFileHandler, dataManager, refreshCallback);
  const [logFileInputNode] = useWombatDataNode<InputNode>('log_file_input');

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // const filesToUpload: FileUpload[] = Array.from(e.target.files).map((file) => ({
    //   file,
    //   fileName: file.name,
    // }));
    logFileInputNode.input(Array.from(e.target.files));
    // setModalOpen(true);
  };

  return (
    <>
      <Button variant="contained" component="label" color="primary">
        Add maps
        <input id="fileinput" type="file" onChange={onInputChange} hidden multiple />
      </Button>
      {/* <UploadProgressModal isOpen={modalOpen} setIsOpen={setModalOpen} files={files} filePercents={filePercents} /> */}
    </>
  );
};

export default Uploader;
