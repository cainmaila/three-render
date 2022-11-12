import { useCallback, useEffect, useState } from 'react';

// @ts-ignore
const getUserMedia =
  // @ts-ignore
  navigator.getUserMedia ||
  // @ts-ignore
  navigator.webkitGetUserMedia ||
  // @ts-ignore
  navigator.mozGetUserMedia;

export const useUserMedia = () => {
  const [stream, setStream] = useState<MediaStream>();
  const userMedia = useCallback(() => {
    getUserMedia(
      { video: { width: 200, height: 120 }, audio: false },
      function (stream: MediaStream) {
        setStream(stream);
      },
      function (err: any) {
        console.log('⁉️Failed to get local stream', err);
      },
    );
  }, []);
  return { stream, userMedia };
};
