require("browser-env")();
const THREE = require("three");
const { createCanvas } = require("node-canvas-webgl");

const width = 512,
  height = 512;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const canvas = createCanvas(width, height);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function update() {
  renderer.render(scene, camera);
}
update();
