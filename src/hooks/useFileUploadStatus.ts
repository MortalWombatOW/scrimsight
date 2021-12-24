/* eslint-disable react-hooks/exhaustive-deps */
import {
  ErrorMessage,
  FileStatus,
  FileUploadMessage,
  LoadedFileMessage,
  ParsedFileMessage,
} from '../lib/data/types';
import {useEffect} from 'react';
import {uploadFile} from '../lib/data/uploadfile';
import {useGlobalState} from '../lib/globalstate';
import {getDB} from '../lib/data/database';
import batch from 'idb-batch';

export function useFileUploadStatus() {
  const [globalState, dispatch] = useGlobalState();

  // console.log('useFileUploadStatus', JSON.parse(JSON.stringify(globalState)));
  useEffect(() => {
    if (globalState.filesToUpload.length === 0) {
      return;
    }
    // load files from file upload messages into loaded file messages
    const loadFile = (fileUploadMessage: FileUploadMessage) => {
      const reader = new FileReader();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      reader.onload = (event: any) => {
        const loadedFileMessage: LoadedFileMessage = {
          fileName: fileUploadMessage.file.name,
          lastModified: fileUploadMessage.file.lastModified,
          data: event.target.result,
        };
        console.log('add loaded file message', loadedFileMessage);
        dispatch({
          loadedFiles: [...globalState.loadedFiles, loadedFileMessage],
        });
      };
      reader.readAsText(fileUploadMessage.file);
    };
    const filesToUpload = globalState.filesToUpload;
    dispatch({
      filesToUpload: [],
    });
    Array.from(filesToUpload).forEach(loadFile);
  }, [JSON.stringify(globalState.filesToUpload)]);

  useEffect(() => {
    if (globalState.loadedFiles.length === 0) {
      return;
    }

    // call uploadFile for each loaded file message and add the result to parsed file messages or error messages
    const asyncWrapper = async (loadedFiles) => {
      const output = await Promise.all(loadedFiles.map(uploadFile));
      // console.log('loaded files', output);
      dispatch({
        parsedFiles: [
          ...globalState.parsedFiles,
          ...(output.filter(
            (msg) => !Object.keys(msg).includes('error'),
          ) as ParsedFileMessage[]),
        ],
        uploadErrors: [
          ...globalState.uploadErrors,
          ...(output.filter((msg) =>
            Object.keys(msg).includes('error'),
          ) as ErrorMessage[]),
        ],
      });
    };
    const loadedFiles = globalState.loadedFiles;
    dispatch({
      loadedFiles: [] as LoadedFileMessage[],
    });
    asyncWrapper(loadedFiles);
  }, [JSON.stringify(globalState.loadedFiles)]);

  useEffect(() => {
    if (globalState.parsedFiles.length === 0) {
      return;
    }

    const db = getDB();
    globalState.parsedFiles.forEach((msg) => {
      if (db === undefined) {
        const errorMsg = {
          error: 'db is undefined, cannot persist',
          fileName: msg.fileName,
        };
        dispatch({
          uploadErrors: [...globalState.uploadErrors, errorMsg],
        });
        return;
      }

      const asyncWriteAndVerify = async (mapData) => {
        await batch(db, 'map', [
          {
            type: 'add',
            value: mapData.map,
          },
        ]);
        console.log('wrote map', mapData.fileName);
        await batch(
          db,
          'player_ability',
          mapData.playerAbilities.map((p) => ({
            type: 'add',
            value: p,
          })),
        );
        console.log('wrote player abilities', mapData.fileName);
        await batch(
          db,
          'player_interaction',
          mapData.playerInteractions.map((p) => ({
            type: 'add',
            value: p,
          })),
        );
        console.log('wrote player interactions', mapData.fileName);
        await batch(
          db,
          'player_status',
          mapData.playerStatus.map((p) => ({
            type: 'add',
            value: p,
          })),
        );
        console.log('wrote player status', mapData.fileName);
        dispatch({
          parsedFiles: globalState.parsedFiles.filter(
            (p) => p.fileName !== msg.fileName,
          ),
          uploadSuccesses: [
            ...globalState.uploadSuccesses,
            {
              fileName: mapData.fileName,
            },
          ],
        });
      };
      asyncWriteAndVerify(JSON.parse(JSON.stringify(msg)));
    });
  }, [JSON.stringify(globalState.parsedFiles)]);

  const startFileUpload = (files: File[]) => {
    console.log('startFileUpload', files);
    dispatch({
      filesToUpload: [
        ...globalState.filesToUpload,
        ...files.map((f) => ({file: f})),
      ],
    });
  };

  const uploadState = {
    filesToUpload: globalState.filesToUpload,
    loadedFiles: globalState.loadedFiles,
    parsedFiles: globalState.parsedFiles,
    uploadErrors: globalState.uploadErrors,
    uploadSuccesses: globalState.uploadSuccesses,
  };

  const computeStateForFiles = () => {
    const allFileNames = [
      ...globalState.filesToUpload.map((f) => f.file.name),
      ...globalState.loadedFiles.map((f) => f.fileName),
      ...globalState.parsedFiles.map((f) => f.fileName),
      ...globalState.uploadErrors.map((f) => f.fileName),
      ...globalState.uploadSuccesses.map((f) => f.fileName),
    ];

    const allFileStates: FileStatus[] = allFileNames.map((f) => {
      if (globalState.filesToUpload.some((f2) => f2.file.name === f)) {
        return {
          fileName: f,
          stage: 'loading',
        };
      }

      if (globalState.loadedFiles.some((f2) => f2.fileName === f)) {
        return {
          fileName: f,
          stage: 'parsing',
        };
      }

      if (globalState.parsedFiles.some((f2) => f2.fileName === f)) {
        return {
          fileName: f,
          stage: 'saving',
        };
      }

      if (globalState.uploadErrors.some((f2) => f2.fileName === f)) {
        return {
          fileName: f,
          stage: 'error',
        };
      }

      if (globalState.uploadSuccesses.some((f2) => f2.fileName === f)) {
        return {
          fileName: f,
          stage: 'success',
        };
      }

      throw Error('shouldnt reach this');
    });

    return allFileStates;
  };

  return {uploadState, startFileUpload, computeStateForFiles};
}
