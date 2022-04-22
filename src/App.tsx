import { useEffect } from 'react';
import { fromEvent, animationFrames } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// const loaderFBX = new FBXLoader();
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
import './App.css';

const CANVAS_DOM = 'App';
// const MODEL_PATH = 'model/TciBio_20220311.fbx';

const clock = new Clock();
function App() {
  useEffect(() => {
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
    const renderer = new WebGLRenderer();
    renderer.setClearColor(0x888888);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    view.appendChild(renderer.domElement);

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

    const geometry = new BoxGeometry(100, 100, 100);
    const material = new MeshLambertMaterial({ color: 0x008899 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

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
      render();
    }
  }, []);

  return <div id="App"></div>;
}

export default App;
