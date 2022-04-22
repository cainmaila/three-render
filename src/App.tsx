import { useEffect } from 'react';
import { fromEvent, animationFrames } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AmbientLight,
  PointLight,
  PCFSoftShadowMap,
} from 'three';
import './App.css';

const clock = new Clock();
function App() {
  useEffect(() => {
    const view =
      document.getElementById('App') || document.createElement('div');
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      view.clientWidth / view.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 200);
    const renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    view.appendChild(renderer.domElement);

    const light = new AmbientLight(0x888888); // soft white light
    scene.add(light);
    const light2 = new PointLight(0xffffff, 1, 400);
    light2.position.set(100, 0, 200);
    light2.castShadow = true;
    scene.add(light2);

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
      render();
    }
  }, []);

  return <div id="App"></div>;
}

export default App;
