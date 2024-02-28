import React, {useEffect, useState} from 'react';
import ReadableUUID from 'uuid-readable';

const useUUID = () => {
  const [uuid, setUuid] = useState<string>('');

  useEffect(() => {
    setUuid(
      ReadableUUID.short(ReadableUUID.inverse(ReadableUUID.generate())).replace(
        / /g,
        '_',
      ),
    );
  }, []);

  return uuid;
};

export default useUUID;
