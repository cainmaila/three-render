import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Group } from 'three';
import { generateBoundingBoxMeta } from '../tools/meshTools';
import { I_CameraState } from './Viewer';
import useModelPath from '../hooks/useModelPath';
import useRenderScene from '../hooks/useRenderScene';
import useCameStateToImage from '../hooks/useCameStateToImage';
import { map, mergeMap, Observable, of } from 'rxjs';
import loadModelObs from '../observables/loadModelObs';
import * as style from './style';
import { CONFUG_PATH, DEF_FOV } from '../setting';
import { BestfitViewPort } from '../tools/cameraTools';

export interface I_ImageMeta {
  image: string;
  id: string;
}

function Render() {
  const { modelMeta } = useModelPath(CONFUG_PATH); /* 包含載入config */
  const sokcetRef = useRef<Socket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { sceneRef, cameraRef, rendererRef } = useRenderScene(
    canvasRef.current,
  );
  const [cameraState, setCameraState] = useState<I_CameraState>({
    matrix: [],
    aspect: 0,
    fov: 0,
    screen: {
      width: 0,
      height: 0,
    },
  });
  const [imageMeta, setImageMeta] = useState<I_ImageMeta>({
    image: '',
    id: '',
  });
  const boxsRef = useRef<number[][]>([]);
  const bestfitViewPortRef = useRef<BestfitViewPort>();

  //主流程
  useEffect(() => {
    if (!modelMeta) return;
    of(modelMeta)
      .pipe(
        /* socket連線 */
        mergeMap(() => {
          return new Observable((subscriber) => {
            const socket = io();
            sokcetRef.current = socket;
            socket.on('connect', () => {
              console.log('💖 socket link! id =>', socket.id);
              socket.emit('render', { tag: modelMeta.id });
              subscriber.next(socket);
              subscriber.complete();
            });
            socket.on('cameraState', (cameraState) => {
              setCameraState(cameraState);
            });
            socket.on('getBoxs', ({ id, aspect }) => {
              //索取box meta
              socket.emit('boxs', {
                id,
                boxs: boxsRef.current,
                aspectInitPosition:
                  bestfitViewPortRef.current?.computePosition(aspect),
              });
            });
          });
        }),
        //模型載入
        mergeMap((_socket) => {
          return loadModelObs(modelMeta);
        }),
        //模型處理與外框盒
        map((_model) => {
          const model = _model as Group;
          model.castShadow = true;
          model.receiveShadow = true;
          sceneRef.current.add(model);
          generateBoundingBoxMeta(model, boxsRef.current); //用模型生成 BoundingBoxMeta
          //計算最適大小tools
          bestfitViewPortRef.current = new BestfitViewPort(model, DEF_FOV);
          sokcetRef.current?.emit('modelReady', { path: modelMeta?.path });
        }),
      )
      .subscribe({
        error: (errorMessage) => {
          console.error(`⁉️ ${errorMessage}`);
          sokcetRef.current?.emit('error', { errorMessage });
        },
        next: () => console.info('🤖 render start'),
      });
  }, [modelMeta]);

  //cameraState 渲染圖
  useCameStateToImage({
    rendererRef,
    cameraRef,
    sceneRef,
    canvasRef,
    cameraState,
    setImageMeta,
  });

  useEffect(() => {
    sokcetRef.current?.emit('img', imageMeta);
  }, [imageMeta]);

  return (
    <div id="App" style={style.full}>
      <canvas ref={canvasRef} width="100%" height="100%"></canvas>
    </div>
  );
}

export default Render;
