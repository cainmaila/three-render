import { Box3, Box3Helper, Color, Group, Mesh, Object3D, Vector3 } from 'three';

/**
 * 用模型生成 BoundingBoxMeta
 * @param model
 * @param boxs
 * @returns boxs
 */
export const generateBoundingBoxMeta = (
  model: Object3D,
  boxs: number[][] = [],
) => {
  model.traverse((mesh) => {
    let box;
    box = new Box3().setFromObject(mesh);
    boxs.push([...box.min.toArray(), ...box.max.toArray()]);
  });
  return boxs;
};

/**
 * 創建Box顯示
 * @param boxs - generateBoundingBoxMeta生成的資料
 * @param container - 容器
 * @param color
 * @returns
 */
export const generateBoundingBox = (
  boxs: number[][],
  container: Object3D = new Group(),
  color: number = 0xffffff,
) => {
  boxs.forEach((box) => {
    const box3 = new Box3(
      new Vector3(box[0], box[1], box[2]),
      new Vector3(box[3], box[4], box[5]),
    );
    const helper = new Box3Helper(box3, new Color(color));
    container.add(helper);
  });
  return container;
};
