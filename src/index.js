import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as dat from "dat.gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new dat.GUI({
  closed: true,
  width: 400,
});

const params = {
  color: 0xff0000,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Enable linear fog
// scene.fog = new THREE.Fog(0xff9000, 1, 10);

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("./assets/the_noble_craftsman/scene.gltf", (gltf) => {
  gltf.scene.scale.set(0, 0, 0);
  gltf.scene.position.set(1, -0.65, 0);
  gsap.to(gltf.scene.scale, { x: 0.04, y: 0.04, z: 0.04, duration: 2 });
  gltf.scene.rotation.set(0, 0, 0);
  gsap.to(gltf.scene.rotation, { y: -0.7, duration: 2 });

  //Can find all parts names in the gltf
  //   gltf.scene.traverse((node) => {
  //     if (node.isMesh) {
  //       console.log("Mesh Name:", node.name);
  //     }
  //   });

  const floor = gltf.scene.getObjectByName("Plane001_03_-_Default_0");
  floor.visible = false;

  //   gui
  //     .add(gltf.scene.rotation, "y")
  //     .min(-3)
  //     .max(3)
  //     .step(0.01)
  //     .name("Rotation Y ");
  //   gui
  //     .add(gltf.scene.rotation, "z")
  //     .min(-3)
  //     .max(3)
  //     .step(0.01)
  //     .name("Rotation Z ");
  //   gui
  //     .add(gltf.scene.rotation, "x")
  //     .min(-3)
  //     .max(3)
  //     .step(0.01)
  //     .name("Rotation X ");
  gui
    .add(gltf.scene.position, "y")
    .min(-3)
    .max(3)
    .step(0.01)
    .name("Position Y ");
  gui
    .add(gltf.scene.position, "x")
    .min(-3)
    .max(3)
    .step(0.01)
    .name("Position X ");
  gui
    .add(gltf.scene.position, "z")
    .min(-3)
    .max(3)
    .step(0.01)
    .name("Position Z ");
  scene.add(gltf.scene);
});

/**
 * Lights
 */
// Ambient light
// const ambientLight = new THREE.AmbientLight();
// ambientLight.color = new THREE.Color(0xffffff);
// ambientLight.intensity = 0.5;
// scene.add(ambientLight);

// Directional light
// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
// directionalLight.position.set(1, 0.25, 0);
// scene.add(directionalLight);

// Hemisphere light
// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

// Point light
const pointLight = new THREE.PointLight(0xff9000, 5, 10, 2);
pointLight.position.set(0.4, 1, 0.8);
scene.add(pointLight);

// Rect area light
// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
// rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight);

// Spot light
const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

spotLight.target.position.x = -0.75;
scene.add(spotLight.target);

// Helpers
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   0.2
// );
// scene.add(hemisphereLightHelper);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   0.2
// );
// scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);
// window.requestAnimationFrame(() => {
//   spotLightHelper.update();
// });

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(plane);

var textureLoader = new THREE.TextureLoader();
textureLoader.load("./assets/texture/floor.png", function (texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20); // Adjust the repeat values as needed

  material.map = texture;
  material.needsUpdate = true;
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 0, 0);
scene.add(camera);

gsap.to(camera.position, { x: 0, y: 2, z: 3, duration: 3 });

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Gui Add
// gui.add(camera.position, "y").min(-3).max(3).step(0.01).name("Camera Y");
// gui.add(camera.position, "x").min(-3).max(3).step(0.01).name("Camera X");
// gui.add(camera.position, "z").min(-3).max(3).step(0.01).name("Camera Z");
// gui
//   .add(directionalLight.position, "z")
//   .min(-100)
//   .max(100)
//   .step(0.01)
//   .name("Directional Light Z");
// gui
//   .add(directionalLight.position, "x")
//   .min(-100)
//   .max(100)
//   .step(0.01)
//   .name("Directional Light X");
// gui
//   .add(directionalLight.position, "y")
//   .min(-100)
//   .max(100)
//   .step(0.01)
//   .name("Directional Light Y");
gui
  .add(pointLight.position, "z")
  .min(-3)
  .max(3)
  .step(0.00001)
  .name("pointLight Z");
gui
  .add(pointLight.position, "x")
  .min(-3)
  .max(3)
  .step(0.00001)
  .name("pointLight X");
gui
  .add(pointLight.position, "y")
  .min(-3)
  .max(3)
  .step(0.00001)
  .name("pointLight  Y");
gui
  .add(pointLight, "intensity")
  .min(-100)
  .max(100)
  .step(0.0001)
  .name("pointLight  Intensiy");
gui.addColor(params, "color").onChange(() => {
  pointLight.color.set(params.color);
});
gui.addColor(params, "color").onChange(() => {
  scene.fog.color.set(params.color);
});
// gui.add(scene.fog, "near").min(-100).max(100).step(0.0001).name("Fog near");
// gui.add(scene.fog, "far").min(-100).max(100).step(0.0001).name("Fog Far");

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
