import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three';

export default (canvas: HTMLCanvasElement | null) => {
  const sceneRef = useRef(new Scene());
  const cameraRef = useRef(new PerspectiveCamera(75, 1, 0.1, 999999));

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    camera.position.set(0, 0, 3000);
    camera.matrixAutoUpdate = false;
    const light = new AmbientLight(0x888888); // soft white light
    scene.add(light);
    const light2 = new PointLight(0xffffff, 1, 4000);
    light2.position.set(100, 0, 200);
    light2.castShadow = true;
    scene.add(light2);
  }, []);

  const rendererRef = useRef<WebGLRenderer>();
  useEffect(() => {
    if (!canvas) return;
    const renderer = new WebGLRenderer({ canvas });
    rendererRef.current = renderer;
    renderer.setClearColor(0x888888);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
  }, [canvas]);

  return {
    sceneRef,
    cameraRef,
    rendererRef,
  };
};
