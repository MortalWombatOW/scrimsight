/* eslint-disable no-restricted-syntax */
import React, {ChangeEvent, forwardRef, useState} from 'react';
import {Button, Modal, LinearProgress} from '@mui/material';
import {useEffect} from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import {useFileUploadStatus} from './../../hooks/useFileUploadStatus';
import {useCallback} from 'react';

// const LoadProgress = forwardRef((props: {fileProgress: StrToNum}, ref: any) => {
//   const {fileProgress} = props;
//   return (
//     <div className="Uploader-progresscontainer" ref={ref}>
//       {Object.keys(fileProgress).map((fileName) => (
//         <div key={fileName}>
//           {fileName}
//           {fileProgress[fileName] >= 0 ? (
//             <LinearProgress
//               variant="determinate"
//               value={fileProgress[fileName]}
//             />
//           ) : (
//             <ErrorIcon />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// });
// LoadProgress.displayName = 'LoadProgress';

const Uploader = () => {
  const [
    fileUploadMessages,
    loadedFileMessages,
    parsedFileMessages,
    successMessages,
    errorMessages,
    startFileUpload,
    getStateOfFile,
  ] = useFileUploadStatus();
  const [isActive, setIsActive] = useState(false);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    Array.from(e.target.files).forEach(startFileUpload);

  return (
    <div>
      <Button color="inherit" variant="outlined" component="label">
        Load Files
        <input
          id="fileinput"
          type="file"
          onChange={onInputChange}
          hidden
          multiple
        />
      </Button>
      <Modal open={isActive} onClose={() => setIsActive(false)}>
        {/* <LoadProgress fileProgress={fileUploadStatus} /> */}
        <div>test</div>
      </Modal>
    </div>
  );
};

export default Uploader;
