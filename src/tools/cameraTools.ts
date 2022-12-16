/* 攝影機計算工具 */

import { Box3, Group, Vector3 } from 'three';

const ANGLE = Math.PI / 180;

/**
 * 計算最適鏡頭位置
 */
class BestfitViewPort {
  model: Group;
  fov: number;
  boundingBox: Box3; //包圍盒
  size: Vector3;
  distance: number | undefined;
  constructor(model: Group, fov: number = 45) {
    this.model = model;
    this.fov = fov;
    this.boundingBox = new Box3().setFromObject(model);
    this.size = this.boundingBox.getSize(new Vector3());
  }
  computePosition(aspect: number = 1) {
    this.distance =
      this.size.length() / 2 / Math.tan(((ANGLE * this.fov) / 2) * aspect);
    const position = this.model.position
      .clone()
      .add(new Vector3(0, this.boundingBox.max.y, this.distance));
    return position;
  }
}

export { BestfitViewPort };
