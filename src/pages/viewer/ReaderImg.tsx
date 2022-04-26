import * as style from '../style';
interface Props {
  image: string;
}
export default function ReaderImg({ image }: Props) {
  const loading = {
    ...style.pointerEventsNone,
    ...style.flexCenter,
    ...style.full,
    fontweight: 'bold',
  };
  return image ? (
    <img
      style={style.pointerEventsNone}
      src={image}
      width="100%"
      height="100%"
    ></img>
  ) : (
    <div style={loading}>loading...</div>
  );
}
