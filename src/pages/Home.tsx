import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <h1>雲渲染POC</h1>
      <nav>
        <ol>
          <li>
            <a href="/viewer/tci" target="viewer_tci">
              大江生醫廠房(FBX)
            </a>
          </li>
          <li>
            <a href="/viewer/gltf" target="viewer_gltf">
              廢棄工廠(GLTF)
            </a>
          </li>
          <li>
            <a href="/viewer/man" target="viewer_gltf">
              藝術品(GLTF) 203M
            </a>
          </li>
        </ol>
      </nav>
    </>
  );
}
