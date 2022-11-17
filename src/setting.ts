export enum MODEL_TYPE {
  FBX = 'fbx',
  GLTF = 'gltf',
}

export interface I_ModelMeta {
  path: string;
  initPosition: [number, number, number];
  type: MODEL_TYPE;
  tag?: string;
}

export default {
  tci: {
    path: '/model/TciBio_20220311.fbx',
    initPosition: [-3000, 5000, 8000],
    type: 'fbx',
  },
  gltf: {
    path: '/model/warehouse/scene.gltf',
    initPosition: [0, 0, -20],
    type: 'gltf',
  },
  man: {
    path: '/model/man/scene.gltf',
    initPosition: [0, 0, 5],
    type: 'gltf',
  },
  csc: {
    path: '/model/CSC.fbx',
    initPosition: [3000, 2000, 5],
    type: 'fbx',
  },
};
