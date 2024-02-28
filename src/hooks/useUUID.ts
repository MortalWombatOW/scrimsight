import React, {useEffect, useState} from 'react';
import ReadableUUID from 'uuid-readable';
import {v4 as uuidv4} from 'uuid';

const useUUID = () => {
  const [uuid] = useState<string>(
    ReadableUUID.short(uuidv4()).replace(/ /g, '_'),
  );

  return uuid;
};

export default useUUID;
