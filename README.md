# 基於 Three 的雲渲染概念 POC

> 1.0.0 載入 config.json 模型資源設定檔
> 0.2.0 模型外掛資料夾，model 外部載入，docker 容器需外掛
> 0.1.0 實作了 p2p 操作螢幕分享

效益如下

- 客戶端不須等到下載模型，對於大容量模型幾乎可以很快的取得 viewport 立即觀看
- 渲染效能不足的設備(比方手機，或是 mr 眼鏡)，不會因為設備資源不足導致無法觀看
- 客戶端無法取得模型，不用擔心模型外流問題

## How to start

```base
pnpm
pnpm i
pnpm buil
pnpm start
```

> 開啟 <http://localhost:3000> 客戶端頁面

## run to docker

```base
docker run -d -p 3000:3000 -v model:[your models config] --name three-render-viewer cainmaila/three-render
```

## 模型設定檔說明

容器本身不包含模型檔案，使用時須要加掛 model 資料夾，並包含 config.json 模型檔案入口

```json
{
  "models": [
    {
      "id": "tci",
      "path": "https://localhost:5500/model/model/TciBio_20220311.fbx",
      "type": "fbx"
    },
    {
      "id": "gltf",
      "path": "/model/warehouse/scene.gltf",
      "initPosition": [0, 0, -20],
      "type": "gltf"
    }
  ]
}
```

| 欄位         | 說明用途                                                             |
| ------------ | -------------------------------------------------------------------- |
| id           | 入口的 key，例如 http://localhost:3000/viewer/[id]，可開啟當下該模型 |
| path         | 為模型的靜態路徑，請注意 cors 問題                                   |
| type         | 可支援 fbx、gltf 檔案格式                                            |
| initPosition | 初始化鏡頭位置，如果沒有給會使用預設最適位置                         |

## 環境變數

| 變數 | 預設值 | 用途         |
| ---- | ------ | ------------ |
| PORT | 3000   | 對外服務端口 |

or build in local.

```base
yarn
yarn build
docker build -t three-render .
docker run -d -p 3000:3000 -v model:[your models config] --name three-render-viewer three-render
```

## 概念說明

基於瀏覽器的 threejs webGL 渲染 viewerport [render 頁面]，期間透過 websocket 與多個客戶端交互場景狀態與渲染結果(bsae64 webp image)，由於操作模型只有一個，不會造成多開的記憶體浪費，渲染方法可自行控制，架構輕巧適合使用於專案項目

## TO DO

- 後續可導入`node-canvas-webgl`，不一定需要瀏覽器協助渲染，或者介接其他第三方渲染引擎
- raycasthit 方法應用(物件選取)
