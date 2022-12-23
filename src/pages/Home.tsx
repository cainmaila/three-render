import { Container, CssBaseline } from '@mui/material';
import { Link } from 'react-router-dom';

const DATA = JSON.stringify({
  models: [
    {
      id: 'tci',
      path: '/model/TciBio_20220311.fbx',
      type: 'fbx',
    },
    {
      id: 'gltf',
      path: '/model/warehouse/scene.gltf',
      initPosition: [0, 0, -20],
      type: 'gltf',
    },
    {
      id: '模型id',
      path: '檔案路徑，也可以放其他主機，相對於 render 服務的位置',
      initPosition: '初始鏡頭位置，可以不填，會使用預設位置',
      type: '目前支援 fbx 或 gltf 兩種規格',
    },
  ],
});

export default function Home() {
  return (
    <>
      <CssBaseline />
      <Container fixed>
        <h1>雲渲染POC v{__APP_VERSION__}</h1>
        <code>
          <p>1. 請再啟動docker容器時掛資源設定model目錄</p>
          <p>
            例如 docker run -d -p 3000:3000 -v [你的資源設定資料夾]:model --name
            three-render-viewer cainmaila/three-render
          </p>
          <p>2. 在 model 中放置 confog.json 格式如下列</p>
          <p>{DATA}</p>
          <p>3. 如果修改confog.json必須重啟服務 </p>
          <p>4. 開啟這個網址 {window.origin}/viewer/[模型id]</p>
        </code>
      </Container>
    </>
  );
}
