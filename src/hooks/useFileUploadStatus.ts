import {
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
} from '../lib/data/types';
import {GlobalState, useGlobalState} from './globalState';
import {useEffect} from 'react';
import { stringHash } from '../lib/string';

type FileStatus = 'ready' | 'pending' | 'success' | 'error';
type FileUpload = {
  mapId?: number;
  fileName: string;
  lastModified: number;
  status: FileStatus;
  error?: string;
  mapData?: OWMap[];
  playerStatusData?: PlayerStatus[];
  playerAbilityData?: PlayerAbility[];
  playerInteractionData?: PlayerInteraction[];
  file?: File;
};

const globalFileUploadStatus = new GlobalState({});

export function useFileUploadStatus() {
  const [fileUploadStatus, setFileUploadStatus] = useGlobalState(
    globalFileUploadStatus,
  ) as [FileUpload[], (newStatus: FileUpload[]) => void];
  
  const maybeAddFile = (fileUpload: FileUpload) => {
    const mapId = stringHash(file);
    const existingFile = fileUploadStatus.find(
      (fileUpload) => fileUpload.mapId === mapId,
    );
    if (existingFile) {
      return false;
    }
    const newFile: FileUpload = {
      mapId,
      fileName: file.name,
      lastModified: file.lastModified,
      status: 'ready',
      file,
    };
    setFileUploadStatus([...fileUploadStatus, newFile]);

    return true;
  };

  const updateFile = (fileUpload: FileUpload) => {
    setFileUploadStatus(
      fileUploadStatus.map((f) => (f.mapId === fileUpload.mapId ? fileUpload : f)),
    );
  };

  useEffect(() => {
    const readyFileUploads = fileUploadStatus.filter(
      (fileUpload) => fileUpload.status === 'ready',
    );

    if (readyFileUploads.length > 0) {
      con
  }, [fileUploadStatus]);

  

  return [fileUploadStatus, maybeAddFile, updateFile];
}
