import Peer, { DataConnection } from 'peerjs';
import { useEffect, useRef, useState } from 'react';

export const useDataPeerMain = (viewerId: string) => {
  const connMapRef = useRef<Map<string, DataConnection>>(new Map());
  const dataRef = useRef<string>();
  useEffect(() => {
    const peer = new Peer(viewerId);
    peer.on('open', function (id) {
      console.log('🎁My peer ID is: ' + id);
    });
    peer.on('connection', function (conn) {
      console.log(conn.peer);

      conn.on('close', function () {
        console.log('close!', conn.peer);
        connMapRef.current.delete(conn.peer);
      });
      conn.on('open', function () {
        console.log('opne!', conn.peer);
        conn.send(dataRef.current);
        connMapRef.current.set(conn.peer, conn);
      });
      conn.on('error', function (error) {
        console.log('error!', error);
      });
    });
  }, [viewerId]);

  function sentConns(data: string) {
    dataRef.current = data;
    connMapRef.current.forEach((conn) => {
      conn.send(data);
    });
  }

  return { sentConns };
};

export const useDataPeerClient = (mainPeerId: string) => {
  const connRef = useRef<DataConnection>();
  const [img, setImage] = useState('');
  useEffect(() => {
    const peer = new Peer();
    peer.on('open', function (id) {
      console.log('🎁My peer ID is: ' + id);
      relink();
    });

    function relink() {
      const conn = peer.connect(mainPeerId || '');
      connRef.current = conn;
      conn.on('data', function (data) {
        const { image } = JSON.parse(data as string);
        setImage(image);
      });
      conn.on('close', function () {
        console.log('close!');
        setTimeout(() => {
          relink();
        }, 1500);
      });
    }
  }, [mainPeerId]);

  return { image: img };
};
