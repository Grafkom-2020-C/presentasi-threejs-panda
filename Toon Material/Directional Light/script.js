import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e97e70');

  function makePlane(size) {
    const planeSize = size;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  function makeBox(size,color) {
    const cubeSize = size;
    const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshToonMaterial({color: color});
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);
  }

  function makeSphere(radius,color)
  {
    const sphereRadius = radius;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshToonMaterial({color: color});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(mesh);
  }

  makePlane(40);
  makeBox(4,'#48b9e7');
  makeSphere(3,'#64c14c');

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);

    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    function updateLight() {
      light.target.updateMatrixWorld();
      helper.update();
    }
    updateLight();

    const gui = new GUI({autoplace : false});
    gui.domElement.id = 'gui';
    gui_container.appendChild(gui.domElement);
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    makeXYZGUI(gui, light.position, 'position', updateLight);
    makeXYZGUI(gui, light.target.position, 'target', updateLight);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
