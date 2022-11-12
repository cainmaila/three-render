import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoOb from '../components/VideoOb';
import { useDataPeerClient } from '../hooks/useDataPeer';
import { useLiveRoom } from '../hooks/useMediaPeer';
import { useUserMedia } from '../hooks/userMedia';
export default () => {
  const { peer: mainPeerId } = useParams(); //router params
  const { stream, userMedia } = useUserMedia();
  const { image, peer, conns } = useDataPeerClient(mainPeerId || '');

  const { streamOb } = useLiveRoom(peer, stream, conns);

  useEffect(() => {
    userMedia();
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: `url(${image})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: '#000',
      }}
    >
      <>
        {streamOb?.map((stream, index) => {
          return <VideoOb key={index} stream={stream}></VideoOb>;
        })}
      </>
    </div>
  );
};
