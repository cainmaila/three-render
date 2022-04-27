import { useEffect } from 'react';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { I_ImageMeta } from '../pages/Render';
import { I_CameraState } from '../pages/Viewer';

export default ({
  rendererRef,
  cameraRef,
  sceneRef,
  canvasRef,
  cameraState,
  setImageMeta,
}: {
  rendererRef: React.MutableRefObject<WebGLRenderer | undefined>;
  cameraRef: React.MutableRefObject<PerspectiveCamera>;
  sceneRef: React.MutableRefObject<Scene>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraState: I_CameraState;
  setImageMeta: React.Dispatch<React.SetStateAction<I_ImageMeta>>;
}) => {
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
};
