import Peer, { MediaConnection } from 'peerjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { difference } from '../tools/arrayCompare';

export const useLiveRoom = (
  peer: Peer | undefined,
  stream: MediaStream | undefined,
  peerIds: string[],
) => {
  const peerIdsRef = useRef<string[]>([]);
  const [ready, setReady] = useState(false);
  const streamMapRef = useRef(new Map<string, MediaStream>());
  const [streamOb, setStreamOb] = useState<Array<MediaStream>>();
  const callNewPeer = useCallback(
    (newPeer: string) => {
      const call = stream && peer?.call(newPeer, stream);
      call?.on('stream', (stream) => {
        streamMapRef.current.set(call.peer, stream);
        restStreamOb();
      });
      call?.on('close', () => {
        streamMapRef.current.delete(call.peer);
        peerIdsRef.current = difference<string>(peerIdsRef.current, [
          call.peer,
        ]);
        restStreamOb();
      });
      call?.on('error', (error) => {
        console.log('error', error);
      });
    },
    [peer, stream],
  );
  useEffect(() => {
    if (!peer?.open || !stream) setReady(false);
    else {
      peer.on('call', (call) => {
        call.answer(stream);
      });
      setReady(true);
    }
  }, [peer, stream]);
  useEffect(() => {
    if (!peer) return;
    const removs = difference<string>(peerIdsRef.current, peerIds);
    removs.flatMap((key) => {
      streamMapRef.current.delete(key);
    });
    const addKeys = difference<string>(peerIds, peerIdsRef.current);
    addKeys.forEach((key) => {
      peer.id !== key && callNewPeer(key); //不用call自己
    });
    peerIdsRef.current = [...peerIds];
    restStreamOb();
  }, [peerIds, callNewPeer, peer]);

  function restStreamOb() {
    return setStreamOb(
      Array.from(streamMapRef.current.values()) as Array<MediaStream>,
    );
  }

  return { ready, streamOb };
};
