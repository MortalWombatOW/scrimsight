/* eslint-disable no-restricted-syntax */
import React, {ChangeEvent, useState} from 'react';
import {Button} from '@mui/material';
import UploadProgressModal from './UploadProgressModal';
import {FileUpload} from 'lib/data/types';
import {uploadFile} from 'lib/data/uploadfile';
import {DataManager} from '../../lib/data/DataManager';
import {useDataManager} from '../../lib/data/DataContext';

interface UploaderProps {
  refreshCallback?: () => void;
  uploadFileHandler?: (
    fileUpload: FileUpload,
    dataManager: DataManager,
    cb: (percent: number) => void,
  ) => Promise<void>;
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
      await uploadFileHandler(
        fileUpload,
        dataManager,
        handleFilePerChange(fileUpload.fileName),
      );
    }
  };

  return {files, filePercents, startFileUploads};
};

const Uploader: React.FC<UploaderProps> = ({
  refreshCallback,
  uploadFileHandler = uploadFile,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const dataManager = useDataManager();
  const {files, filePercents, startFileUploads} = useFileUpload(
    uploadFileHandler,
    dataManager,
    refreshCallback,
  );

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesToUpload: FileUpload[] = Array.from(e.target.files).map(
      (file) => ({
        file,
        fileName: file.name,
      }),
    );
    startFileUploads(filesToUpload);
    setModalOpen(true);
  };

  return (
    <>
      <Button variant="outlined" component="label" color="secondary">
        Add maps
        <input
          id="fileinput"
          type="file"
          onChange={onInputChange}
          hidden
          multiple
        />
      </Button>
      <UploadProgressModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        files={files}
        filePercents={filePercents}
      />
    </>
  );
};

export default Uploader;
