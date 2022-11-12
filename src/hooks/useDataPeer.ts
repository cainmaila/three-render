import Peer, { DataConnection } from 'peerjs';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useDataPeerMain = (viewerId: string) => {
  const connMapRef = useRef<
    Map<string, { conn: DataConnection; live: number }>
  >(new Map());
  const dataRef = useRef<string>();
  const [peer, setPeer] = useState<Peer>();
  const [conns, setConns] = useState<string[]>([]);

  /* 送出目前連線的 peerId 包含自己*/
  const sentLinksConns = useCallback(() => {
    sentConns(JSON.stringify({ peers: [viewerId, ...getConns()] })); //送出最新的陣列
    setConns([viewerId, ...getConns()]);
  }, [viewerId]);

  useEffect(() => {
    const peer = new Peer(viewerId);
    peer.on('open', function (id) {
      console.log('🎁My peer ID is: ' + id);
      setPeer(peer);
    });
    peer.on('connection', function (conn) {
      console.log(conn.peer);
      conn.on('close', function () {
        console.log('close!', conn.peer);
        connMapRef.current.delete(conn.peer);
        sentLinksConns();
      });
      conn.on('data', (data) => {
        const connOb = connMapRef.current.get(conn.peer);
        connOb && (connOb.live = 3);
      });
      conn.on('open', function () {
        console.log('opne!', conn.peer);
        conn.send(dataRef.current);
        connMapRef.current.set(conn.peer, { conn, live: 3 });
        sentLinksConns();
      });
      conn.on('error', function (error) {
        console.log('error!', error);
      });
    });
  }, [viewerId]);

  useEffect(() => {
    const time = setInterval(() => {
      connMapRef.current.forEach((connOb) => {
        connOb.live -= 1;
        if (connOb.live <= 0) {
          connMapRef.current.delete(connOb.conn.peer);
        }
      });
      sentLinksConns();
    }, 1000);
    return () => {
      clearInterval(time);
    };
  }, [sentLinksConns]);

  function sentDataToConns(data: string) {
    dataRef.current = data;
    sentConns(data);
  }

  function sentConns(data: string) {
    connMapRef.current.forEach(({ conn }) => {
      conn.send(data);
    });
  }

  function getConns() {
    return Array.from(connMapRef.current.keys());
  }

  return { sentDataToConns, peer, conns };
};

export const useDataPeerClient = (mainPeerId: string) => {
  const connRef = useRef<DataConnection>();
  const [img, setImage] = useState('');
  const [peer, setPeer] = useState<Peer>();
  const [conns, setConns] = useState<string[]>([]);
  useEffect(() => {
    const peer = new Peer();
    peer.on('open', function (id) {
      console.log('🎁My peer ID is: ' + id);
      relink();
      setPeer(peer);
    });

    function relink() {
      const conn = peer.connect(mainPeerId || '');
      connRef.current = conn;
      conn.on('data', function (data) {
        const { image, peers } = JSON.parse(data as string);
        if (image) {
          setImage(image);
        } else if (peers) {
          setConns(peers);
        }
      });
      conn.on('close', function () {
        console.log('close!');
        setTimeout(() => {
          relink();
        }, 1500);
      });
      const timeId = setInterval(() => {
        conn.send('heartbeat');
      }, 1000);

      return () => clearInterval(timeId);
    }
  }, [mainPeerId]);

  return { image: img, peer, conns };
};
