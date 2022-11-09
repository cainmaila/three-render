import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default () => {
  const viewerKey = useMemo(() => {
    let id = sessionStorage.getItem('viewer-id');
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem('viewer-id', id);
    }
    return id;
  }, []);

  return viewerKey;
};
