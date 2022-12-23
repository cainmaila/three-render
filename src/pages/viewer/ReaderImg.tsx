import { useMemo } from 'react';
import { useViewerPageState } from '../../hooks/pageState';
import * as style from '../style';
interface Props {
  image: string;
  rending: boolean;
}
export default function ReaderImg({ image, rending }: Props) {
  const loading = {
    ...style.pointerEventsNone,
    ...style.flexCenter,
    ...style.full,
    fontweight: 'bold',
  };

  const imageStyle: React.CSSProperties = useMemo(() => {
    return {
      ...style.pointerEventsNone,
      visibility: rending ? 'hidden' : 'visible',
    };
  }, [rending]);

  const { viewerPageStateMessage } = useViewerPageState();

  return !viewerPageStateMessage && image ? (
    <img style={imageStyle} src={image} width="100%" height="100%"></img>
  ) : (
    <div style={loading}>{viewerPageStateMessage || 'loading...'}</div>
  );
}
