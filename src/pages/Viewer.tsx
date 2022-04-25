import { useEffect, useRef, useState } from 'react';
import { fromEvent, animationFrames, merge } from 'rxjs';
import {
  auditTime,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { io, Socket } from 'socket.io-client';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// const loaderFBX = new FBXLoader();
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
} from 'three';

const CANVAS_DOM = 'App';
// const MODEL_PATH = 'model/TciBio_20220311.fbx';

const clock = new Clock();

export interface I_CameraState {
  matrix: number[];
  aspect: number;
  fov: number;
  screen: {
    width: number;
    height: number;
  };
}

function Viewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState('');
  const [cameraState, setCameraState] = useState<I_CameraState>({
    matrix: [],
    aspect: 0,
    fov: 0,
    screen: {
      width: 0,
      height: 0,
    },
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    if (!canvasRef.current) throw new Error('no view');
    const view =
      document.getElementById(CANVAS_DOM) || document.createElement('div');
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      view.clientWidth / view.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 200);
    const renderer = new WebGLRenderer({ canvas: canvasRef.current });
    renderer.setClearColor(0x888888);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    // view.appendChild(renderer.domElement);

    const light = new AmbientLight(0x888888); // soft white light
    scene.add(light);
    const light2 = new PointLight(0xffffff, 1, 4000);
    light2.position.set(100, 0, 200);
    light2.castShadow = true;
    scene.add(light2);

    //controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);

    // loaderFBX.load(MODEL_PATH, (model) => {
    //   model.scale.set(0.01, 0.01, 0.01);
    //   scene.add(model);
    // });

    // const geometry = new BoxGeometry(100, 100, 100);
    // const material = new MeshLambertMaterial({ color: 0x008899 });
    // material.wireframe = true;
    // const cube = new Mesh(geometry, material);
    // scene.add(cube);

    resize();

    animationFrames()
      .pipe(map(() => clock.getDelta()))
      .subscribe(render);

    function render() {
      controls.update();
      // renderer.render(scene, camera);
    }

    fromEvent(window, 'resize').subscribe(resize);

    function resize() {
      camera.aspect = view.clientWidth / view.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(view.clientWidth, view.clientHeight);
      render();
      window.dispatchEvent(new Event('resized'));
    }

    //renderer events
    let endTimeTag: NodeJS.Timeout;
    merge(
      fromEvent(window, 'pointerdown').pipe(
        switchMap(() =>
          fromEvent(window, 'pointermove').pipe(
            auditTime(50),
            takeUntil(fromEvent(window, 'pointerup')),
          ),
        ),
      ),
      fromEvent(window, 'mousewheel').pipe(auditTime(50)),
      fromEvent(window, 'resized').pipe(auditTime(50)),
    )
      .pipe(
        startWith(cameraState(0.5)),
        map(() => cameraState(0.5)),
        tap(() => {
          clearTimeout(endTimeTag);
          endTimeTag = setTimeout(() => {
            setCameraState(cameraState(1)); //高級品質
          }, 200);
        }),
      )
      .subscribe((data) => setCameraState(data));

    function cameraState(size = 1): I_CameraState {
      return {
        matrix: camera.matrix.toArray(),
        aspect: camera.aspect,
        fov: camera.fov,
        screen: {
          width: view.clientWidth * size,
          height: view.clientHeight * size,
        },
      };
    }

    const socket = io();
    socket.on('connect', () => {
      console.log('💖', socket.id);
      setSocket(socket);
    });
    socket.on('img', (img) => {
      setImage(img);
    });
  }, []);

  useEffect(() => {
    socket?.emit('cameraState', cameraState);
  }, [cameraState, socket]);

  return (
    <div id="App" style={style.full}>
      <canvas ref={canvasRef} width="100%" height="100%"></canvas>
      <img
        style={style.pointerEventsNone}
        src={image}
        width="100%"
        height="100%"
      ></img>
    </div>
  );
}

export default Viewer;
