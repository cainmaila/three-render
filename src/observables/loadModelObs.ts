/* 載入模型 */

import { Observable } from 'rxjs';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { I_ModelMeta, MODEL_TYPE } from '../setting';
const loaderFBX = new FBXLoader();
const loaderGLTF = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/examples/js/libs/draco/');
loaderGLTF.setDRACOLoader(dracoLoader);

export default ({ path, type }: I_ModelMeta) => {
  return new Observable((subscriber) => {
    switch (type) {
      case MODEL_TYPE.FBX:
        loaderFBX.load(path, (model) => {
          subscriber.next(model);
          subscriber.complete();
        });
        break;
      case MODEL_TYPE.GLTF:
        loaderGLTF.load(path, ({ scene: model }) => {
          subscriber.next(model);
          subscriber.complete();
        });
        break;
    }
  });
};
