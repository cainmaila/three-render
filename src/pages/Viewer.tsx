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
import { generateBoundingBox } from '../tools/meshTools';
import ReaderImg from './viewer/ReaderImg';
import * as style from './style';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  sRGBEncoding,
} from 'three';
import RenderUi from './viewer/RenderUi';
import useModelPath from '../hooks/useModelPath';
import useViewerId from '../hooks/useViewerId';
import { useBoolean, useCopyToClipboard } from 'usehooks-ts';
import { useDataPeerMain } from '../hooks/useDataPeer';
import { CONFUG_PATH } from '../setting';

const CANVAS_DOM = 'App';
const RENDER_FPS = 50;

const clock = new Clock();

export interface I_CameraState {
  matrix: number[];
  aspect: number;
  fov: number;
  screen: {
    width: number;
    height: number;
  };
  id?: string;
}
function Viewer() {
  const viewerId = useViewerId();

  const { sentConns } = useDataPeerMain(viewerId);

  const {
    value: alertOffVal,
    setTrue: setAlertOffTrue,
    setFalse: setAlertOffOff,
  } = useBoolean(false);
  const { modelMeta } = useModelPath(CONFUG_PATH);
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
  const [rending, setRedning] = useState(false); //是否渲染中
  const [value, setValue] = useState('middle'); //渲染品質
  const renderQualityRef = useRef('middle');

  useEffect(() => {
    const view =
      document.getElementById(CANVAS_DOM) || document.createElement('div');
    sentConns(
      JSON.stringify({
        image,
        aspect: view.clientWidth / view.clientHeight,
      }),
    );
  }, [image]);

  useEffect(() => {
    renderQualityRef.current = value;
  }, [value]);
  useEffect(() => {
    if (!modelMeta) return;
    if (!canvasRef.current) throw new Error('no view');
    const view =
      document.getElementById(CANVAS_DOM) || document.createElement('div');
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      40,
      view.clientWidth / view.clientHeight,
      0.1,
      999999,
    );
    const { initPosition } = modelMeta;
    camera.position.set(initPosition[0], initPosition[1], initPosition[2]);
    const renderer = new WebGLRenderer({ canvas: canvasRef.current });
    renderer.outputEncoding = sRGBEncoding;
    renderer.setClearColor(0x888888);
    renderer.setPixelRatio(window.devicePixelRatio);

    //controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);

    resize();

    animationFrames()
      .pipe(map(() => clock.getDelta()))
      .subscribe(render);

    function render() {
      controls.update();
      renderer.render(scene, camera);
    }

    fromEvent(window, 'resize').subscribe(resize);

    function resize() {
      camera.aspect = view.clientWidth / view.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(view.clientWidth, view.clientHeight);
      // render();
      window.dispatchEvent(new Event('resized'));
    }

    //renderer events
    let endTimeTag = 0;
    merge(
      fromEvent(window, 'pointerdown').pipe(
        switchMap(() =>
          fromEvent(window, 'pointermove').pipe(
            auditTime(RENDER_FPS),
            takeUntil(fromEvent(window, 'pointerup')),
          ),
        ),
      ),
      fromEvent(window, 'mousewheel').pipe(auditTime(RENDER_FPS)),
      fromEvent(window, 'resized').pipe(auditTime(RENDER_FPS)),
    )
      .pipe(
        startWith(cameraState(1)),
        map(() => {
          switch (renderQualityRef.current) {
            case 'low':
              return null;
            case 'hight':
              return cameraState(1);
            default:
              return cameraState(0.5);
          }
        }),
        tap(() => {
          setRedning(true);
          clearTimeout(endTimeTag);
          endTimeTag = setTimeout(() => {
            setCameraState(cameraState(1)); //高級品質
            setRedning(false);
          }, 200);
        }),
      )
      .subscribe((data) => {
        data ? setCameraState(data) : setImage('');
      });

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
    socket.on('boxs', ({ boxs }) => {
      generateBoundingBox(boxs, scene);
    });
  }, [modelMeta]);

  useEffect(() => {
    if (!modelMeta) return;
    document.title = `Three Render Viewer 👻 ${modelMeta.tag}`;
  }, [socket, modelMeta]);

  useEffect(() => {
    if (!modelMeta) return;
    socket?.emit('client', { tag: modelMeta.tag });
    socket?.emit('getBoxs');
  }, [socket, modelMeta]);

  useEffect(() => {
    socket?.emit('cameraState', cameraState);
  }, [cameraState, socket]);

  const [_, copy] = useCopyToClipboard();

  function copyViewId() {
    copy(`${window.location.origin}/client/${viewerId}`);
    setAlertOffTrue();
  }

  function onAlertClose() {
    setAlertOffOff();
  }

  return (
    <div id="App" style={style.full}>
      <ReaderImg image={image} rending={rending && value === 'low'}></ReaderImg>
      <canvas ref={canvasRef} width="100%" height="100%"></canvas>
      <RenderUi setValue={setValue} />
      {/* <Box
        sx={{
          position: 'absolute',
          right: 4,
          top: 4,
        }}
        onClick={copyViewId}
      >
        <Button variant="contained">複製分享</Button>
      </Box> */}
    </div>
  );
}

export default Viewer;
