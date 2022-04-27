import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <h1>雲渲染POC</h1>
      <nav>
        <ol>
          <Link to="/viewer/tci">
            <li>大江生醫廠房(FBX)</li>
          </Link>
          <Link to="/viewer/gltf">
            <li>廢棄工廠(GLTF)</li>
          </Link>
        </ol>
      </nav>
    </>
  );
}
