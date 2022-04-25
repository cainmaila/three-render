import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
const loaderFBX = new FBXLoader();
import * as style from './style';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AmbientLight,
  PointLight,
  PCFSoftShadowMap,
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  Matrix4,
} from 'three';
import { I_CameraState } from './Viewer';

const CANVAS_DOM = 'App';
const MODEL_PATH = 'model/TciBio_20220311.fbx';

const clock = new Clock();
function Render() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState('');
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
  const viewRef = useRef(
    document.getElementById(CANVAS_DOM) || document.createElement('div'),
  );
  const sceneRef = useRef(new Scene());
  const cameraRef = useRef(new PerspectiveCamera(75, 1, 0.1, 1000));
  const rendererRef = useRef<WebGLRenderer>();
  useEffect(() => {
    if (!canvasRef.current) throw new Error('no view');
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    camera.position.set(0, 0, 200);
    camera.matrixAutoUpdate = false;
    const renderer = new WebGLRenderer({ canvas: canvasRef.current });
    rendererRef.current = renderer;
    renderer.setClearColor(0x888888);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const light = new AmbientLight(0x888888); // soft white light
    scene.add(light);
    const light2 = new PointLight(0xffffff, 1, 4000);
    light2.position.set(100, 0, 200);
    light2.castShadow = true;
    scene.add(light2);

    loaderFBX.load(MODEL_PATH, (model) => {
      model.scale.set(0.01, 0.01, 0.01);
      scene.add(model);
    });

    // const geometry = new BoxGeometry(100, 100, 100);
    // const material = new MeshLambertMaterial({ color: 0x008899 });
    // const cube = new Mesh(geometry, material);
    // scene.add(cube);

    // const socket = io('/ws');
    const socket = io('ws://127.0.0.1:3030');
    socket.on('connect', () => {
      console.log('💖', socket.id);
      setSocket(socket);
    });
    socket.on('cameraState', (cameraState) => {
      setCameraState(cameraState);
    });
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!cameraState.aspect || !renderer) return;
    const camera = cameraRef.current;
    camera.matrixWorld.fromArray(cameraState.matrix);
    camera.aspect = cameraState.aspect;
    camera.fov = cameraState.fov;
    renderer.setSize(cameraState.screen.width, cameraState.screen.height);
    renderer.render(sceneRef.current, camera);
    setImage(canvasRef.current?.toDataURL('image/webp', 0.5) || '');
  }, [cameraState]);

  useEffect(() => {
    socket?.emit('img', image);
  }, [image, socket]);

  return (
    <div id="App" style={style.full}>
      <canvas ref={canvasRef} width="100%" height="100%"></canvas>
    </div>
  );
}

export default Render;
