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
    if (mesh.name === 'Top') {
      //TODO:偷懶隱藏
      mesh.visible = false;
    }
    let box;
    if (mesh instanceof Mesh) {
      box = mesh.geometry?.boundingBox || new Box3().setFromObject(mesh);
      box.applyMatrix4(mesh.matrixWorld);
      boxs.push([...box.min.toArray(), ...box.max.toArray()]);
    }
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
    // box3.applyMatrix4(container.matrixWorld);
    const helper = new Box3Helper(box3, new Color(color));
    container.add(helper);
  });
  return container;
};
