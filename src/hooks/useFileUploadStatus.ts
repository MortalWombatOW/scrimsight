import {
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
} from '../lib/data/types';
import {GlobalState, useGlobalState} from './globalState';
import {useEffect} from 'react';
import {
  uploadFile,
  ErrorMessage,
  FileUploadMessage,
  LoadedFileMessage,
  ParsedFileMessage,
  SuccessMessage,
  FileProgress,
} from '../lib/data/uploadfile';

const globalFileUploadMessages = new GlobalState<FileUploadMessage[]>([]);
const globalLoadedFileMessages = new GlobalState<LoadedFileMessage[]>([]);
const globalParsedFileMessages = new GlobalState<ParsedFileMessage[]>([]);
const globalSuccessMessages = new GlobalState<SuccessMessage[]>([]);
const globalErrorMessages = new GlobalState<ErrorMessage[]>([]);

export function useFileUploadStatus() {
  const [fileUploadMessages, setFileUploadMessages] = useGlobalState(
    globalFileUploadMessages,
  );
  const [loadedFileMessages, setLoadedFileMessages] = useGlobalState(
    globalLoadedFileMessages,
  );
  const [parsedFileMessages, setParsedFileMessages] = useGlobalState(
    globalParsedFileMessages,
  );
  const [successMessages, setSuccessMessages] = useGlobalState(
    globalSuccessMessages,
  );
  const [errorMessages, setErrorMessages] = useGlobalState(globalErrorMessages);

  useEffect(() => {
    // load files from file upload messages into loaded file messages
    const loadFile = (fileUploadMessage: FileUploadMessage) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const loadedFileMessage: LoadedFileMessage = {
          fileName: fileUploadMessage.file.name,
          lastModified: fileUploadMessage.file.lastModified,
          data: event.target.result,
        };
        setLoadedFileMessages((loadedFileMessages) => [
          ...loadedFileMessages,
          loadedFileMessage,
        ]);
      };
      reader.readAsText(fileUploadMessage.file);
    };
    fileUploadMessages.forEach(loadFile);
    // clear file upload messages
    setFileUploadMessages([]);
  }, [fileUploadMessages]);

  useEffect(() => {
    // call uploadFile for each loaded file message and add the result to parsed file messages or error messages
    const output = loadedFileMessages.map(uploadFile);
    setParsedFileMessages(output.filter((msg) => msg.error === undefined));
    setErrorMessages(output.filter((msg) => msg.error !== undefined));
    // clear loaded file messages
    setLoadedFileMessages([]);
  }, [loadedFileMessages]);

  useEffect(() => {
    // print parsed file messages and error messages to console
    parsedFileMessages.forEach((msg) => console.log(msg));
    errorMessages.forEach((msg) => console.error(msg));
    // clear parsed file messages and error messages
    setParsedFileMessages([]);
    setErrorMessages([]);
  }, [parsedFileMessages, errorMessages]);

  const startFileUpload = (file: File) => {
    setFileUploadMessages((fileUploadMessages) => [
      ...fileUploadMessages,
      {file},
    ]);
  };

  const getStateOfFile = (fileName: string): FileProgress | undefined => {
    const progress: FileProgress = {
      fileName,
      isLoaded: loadedFileMessages.some((msg) => msg.fileName === fileName),
      isParsed: parsedFileMessages.some((msg) => msg.fileName === fileName),
      isSuccess: successMessages.some((msg) => msg.fileName === fileName),
      isError: errorMessages.some((msg) => msg.fileName === fileName),
      error: errorMessages.find((msg) => msg.fileName === fileName)?.error,
    };
    return progress;
  };

  return [
    fileUploadMessages,
    loadedFileMessages,
    parsedFileMessages,
    successMessages,
    errorMessages,
    startFileUpload,
    getStateOfFile,
  ];
}
