/* 攝影機計算工具 */

import { Box3, Group, Vector3 } from 'three';

const ANGLE = Math.PI / 180;

/**
 * 計算最適鏡頭位置
 * @param model
 * @param aspect
 * @param fov
 * @returns
 */
const computeBestfitPosition = (
  model: Group,
  aspect: number = 1,
  fov: number = 45,
) => {
  // 創建包圍盒
  const boundingBox = new Box3().setFromObject(model);
  // 獲取包圍盒大小
  const size = boundingBox.getSize(new Vector3());
  const distance = size.length() / 2 / Math.tan(((ANGLE * fov) / 2) * aspect);
  const position = model.position
    .clone()
    .add(new Vector3(0, boundingBox.max.y, distance));
  return position;
};

export { computeBestfitPosition };
