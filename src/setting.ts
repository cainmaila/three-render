export const CONFUG_PATH = '/config.json';

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
