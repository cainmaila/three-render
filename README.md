# 基於 Three 的雲渲染概念 POC

效益如下

- 客戶端不須等到下載模型，對於大容量模型幾乎可以很快的取得 viewport 立即觀看
- 渲染效能不足的設備(比方手機，或是 mr 眼鏡)，不會因為設備資源不足導致無法觀看
- 客戶端無法取得模型，不用擔心模型外流問題

## How to start

```base
yarn
yarn build
yarn start
```

> 開啟 <http://127.0.0.1:3030> 客戶端頁面

## 概念說明

基於瀏覽器的 threejs webGL 渲染 viewerport [render 頁面]，期間透過 websocket 與多個客戶端交互場景狀態與渲染結果(bsae64 webp image)，由於操作模型只有一個，不會造成多開的記憶體浪費，渲染方法可自行控制，架構輕巧適合使用於專案項目

## TO DO

- 後續可導入`node-canvas-webgl`，不一定需要瀏覽器協助渲染，或者介接其他第三方渲染引擎
- raycasthit 方法應用(場競選取)
