import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 2;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();
  // scene.background = new THREE.Color('#e97e70');

  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.AmbientLight(color, intensity);
  scene.add(light);

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

  var controls = new function() {
    this.cameraNear = camera.near;
    this.cameraFar = camera.far;
    this.positionX = 0;
    this.positionY = 4;
    this.positionZ = 0;
  }

  const gui = new GUI({autoplace : false});
  gui.domElement.id = 'gui';
  gui_container.appendChild(gui.domElement);

  var guiPosition = gui.addFolder('point position');
  var contX = guiPosition.add(controls, 'positionX', -10, 10,0.01);
  var contY = guiPosition.add(controls, 'positionY', -4, 20,0.01);
  var contZ = guiPosition.add(controls, 'positionZ', -10, 10,0.01)

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new THREE.MeshDepthMaterial();
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  contX.listen();
  contX.onChange(function (value) {
      cube.position.x = controls.positionX;
  });

  contY.listen();
  contY.onChange(function (value) {
      cube.position.y = controls.positionY;
  });

  contZ.listen();
  contZ.onChange(function (value) {
      cube.position.z = controls.positionZ;
  });

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

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cube.rotation.x = time;
    cube.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
