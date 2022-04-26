import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
const loaderFBX = new FBXLoader();
import * as style from './style';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  PointLight,
  PCFSoftShadowMap,
} from 'three';
import { generateBoundingBoxMeta } from '../tools/meshTools';
import { I_CameraState } from './Viewer';

const MODEL_PATH = 'model/TciBio_20220311.fbx';

export interface I_ImageMeta {
  image: string;
  id: string;
}

function Render() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageMeta, setImageMeta] = useState<I_ImageMeta>({
    image: '',
    id: '',
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [cameraState, setCameraState] = useState<I_CameraState>({
    matrix: [],
    aspect: 0,
    fov: 0,
    screen: {
      width: 0,
      height: 0,
    },
  });
  const sceneRef = useRef(new Scene());
  const cameraRef = useRef(new PerspectiveCamera(75, 1, 0.1, 999999));
  const rendererRef = useRef<WebGLRenderer>();
  const boxsRef = useRef<number[][]>([]);
  useEffect(() => {
    if (!canvasRef.current) throw new Error('no view');
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    camera.position.set(0, 0, 3000);
    camera.matrixAutoUpdate = false;
    const renderer = new WebGLRenderer({ canvas: canvasRef.current });
    rendererRef.current = renderer;
    renderer.setClearColor(0x888888);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const light = new AmbientLight(0x888888); // soft white light
    scene.add(light);
    const light2 = new PointLight(0xffffff, 1, 4000);
    light2.position.set(100, 0, 200);
    light2.castShadow = true;
    scene.add(light2);

    const socket = io();
    socket.on('connect', () => {
      console.log('💖', socket.id);
      setSocket(socket);
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

    //模型載入
    loaderFBX.load(MODEL_PATH, (model) => {
      model.castShadow = true;
      model.receiveShadow = true;
      scene.add(model);
      generateBoundingBoxMeta(model, boxsRef.current); //用模型生成 BoundingBoxMeta
      socket.emit('modelReady', { path: MODEL_PATH });
    });
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!cameraState.aspect || !renderer) return;
    const camera = cameraRef.current;
    camera.matrixWorld.fromArray(cameraState.matrix);
    camera.aspect = cameraState.aspect;
    camera.fov = cameraState.fov;
    camera.updateProjectionMatrix();
    renderer.setSize(cameraState.screen.width, cameraState.screen.height);
    renderer.render(sceneRef.current, camera);
    setImageMeta({
      image: canvasRef.current?.toDataURL('image/webp', 0.8) || '',
      id: cameraState.id || '',
    });
  }, [cameraState]);

  useEffect(() => {
    socket?.emit('render');
  }, [socket]);

  useEffect(() => {
    socket?.emit('img', imageMeta);
  }, [imageMeta, socket]);

  return (
    <div id="App" style={style.full}>
      <canvas ref={canvasRef} width="100%" height="100%"></canvas>
    </div>
  );
}

export default Render;
