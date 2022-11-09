import { DataConnection, Peer } from 'peerjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWindowSize } from 'usehooks-ts';
export default () => {
  const { peer: mainPeerId } = useParams(); //router params
  const connRef = useRef<DataConnection>();
  const [img, setImage] = useState('');
  const [aspect, setAspect] = useState(1);
  const { width, height } = useWindowSize();
  const myAspect = useMemo(() => {
    return width / height;
  }, [width, height]);
  useEffect(() => {
    const peer = new Peer();
    // const peer = new Peer('', {
    //   host: 'localhost',
    //   port: 9000,
    //   path: '/peer',
    // });
    peer.on('open', function (id) {
      console.log('My peer ID is: ' + id);
      relink();
    });

    function relink() {
      const conn = peer.connect(mainPeerId || '');
      connRef.current = conn;
      conn.on('data', function (data) {
        const obj = JSON.parse(data as string);
        const { image, aspect } = obj;
        setAspect(aspect);
        setImage(image);
      });
      conn.on('close', function () {
        console.log('close!');
        setTimeout(() => {
          relink();
        }, 1500);
      });
    }
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
