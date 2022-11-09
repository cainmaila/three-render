import { useParams } from 'react-router-dom';
import { useDataPeerClient } from '../hooks/useDataPeer';
export default () => {
  const { peer: mainPeerId } = useParams(); //router params
  const { image } = useDataPeerClient(mainPeerId || '');
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
    ></div>
  );
};
