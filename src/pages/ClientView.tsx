import { Peer } from 'peerjs';
import { useEffect, useMemo, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
export default () => {
  const [img, setImage] = useState('');
  const [aspect, setAspect] = useState(1);
  const { width, height } = useWindowSize();
  const myAspect = useMemo(() => {
    return width / height;
  }, [width, height]);
  useEffect(() => {
    const peer = new Peer('', {
      host: 'localhost',
      port: 9000,
      path: '/peer',
    });
    peer.on('open', function (id) {
      console.log('My peer ID is: ' + id);
      const conn = peer.connect('cain123');
      conn.on('data', function (data) {
        const obj = JSON.parse(data as string);
        const { image, aspect } = obj;
        setAspect(aspect);
        setImage(image);
      });
    });
  }, []);
  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: `url(${img})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: '#000',
      }}
    ></div>
  );
};
