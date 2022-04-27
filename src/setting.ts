export enum MODEL_TYPE {
  FBX = 'fbx',
  GLTF = 'gltf',
}

export interface I_ModelMeta {
  path: string;
  initPosition: [number, number, number];
  type: MODEL_TYPE;
}

export default {
  tci: {
    path: '/model/TciBio_20220311.fbx',
    initPosition: [-3000, 5000, 8000],
    type: 'fbx',
  },
  gltf: {
    path: '/model/warehouse/scene.gltf',
    initPosition: [0, 0, 100],
    type: 'gltf',
  },
};
