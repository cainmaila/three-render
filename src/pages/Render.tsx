import Axios from 'axios-observable';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Group } from 'three';
import { generateBoundingBoxMeta } from '../tools/meshTools';
import { I_CameraState } from './Viewer';
import useModelPath from '../hooks/useModelPath';
import useRenderScene from '../hooks/useRenderScene';
import useCameStateToImage from '../hooks/useCameStateToImage';
import { filter, map, mergeMap, Observable, of, tap } from 'rxjs';
import loadModelObs from '../observables/loadModelObs';
import * as style from './style';

export interface I_ImageMeta {
  image: string;
  id: string;
}

function Render() {
  const { modelMeta } = useModelPath();
  const [config, setConfig] = useState();
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

  //主流程
  useEffect(() => {
    of(modelMeta)
      .pipe(
        filter((modelMeta) => !!modelMeta),
        /* 載入config */
        mergeMap(() => {
          return Axios.get('/config.json');
        }),
        tap((res) => {
          const a = res as { data: any };
          setConfig(a.data);
        }),
        /* socket連線 */
        mergeMap(() => {
          return new Observable((subscriber) => {
            const socket = io();
            sokcetRef.current = socket;
            socket.on('connect', () => {
              console.log('💖', socket.id);
              socket.emit('render');
              subscriber.next(socket);
              subscriber.complete();
            });
            socket.on('cameraState', (cameraState) => {
              setCameraState(cameraState);
            });
            socket.on('getBoxs', ({ id }) => {
              //索取box meta
              socket.emit('boxs', {
                id,
                boxs: boxsRef.current,
              });
            });
          });
        }),
        //模型載入
        mergeMap((_socket) => {
          if (!modelMeta) throw new Error('modelMeta null');
          return loadModelObs(modelMeta);
        }),
        //模型處理與外框盒
        map((_model) => {
          const model = _model as Group;
          model.castShadow = true;
          model.receiveShadow = true;
          sceneRef.current.add(model);
          generateBoundingBoxMeta(model, boxsRef.current); //用模型生成 BoundingBoxMeta
          sokcetRef.current?.emit('modelReady', { path: modelMeta?.path });
        }),
      )
      .subscribe((a) => console.log(123, a));
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
