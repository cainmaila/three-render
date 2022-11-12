import { useEffect, useRef } from 'react';

export interface Prop {
  stream: MediaStream | undefined;
}

export default ({ stream }: Prop) => {
  const vdoRef = useRef<HTMLVideoElement>(document.createElement('video'));
  useEffect(() => {
    if (vdoRef.current && stream) {
      vdoRef.current.srcObject = stream;
      vdoRef.current.autoplay = true;
    }
  }, [stream]);

  return <video ref={vdoRef} style={{ margin: 4 }}></video>;
};
