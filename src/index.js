import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUIPanel } from "@components";
import { ValveMesh, PipelineMesh, CircuitMesh } from '@objects';
import { CIRCUIT_TYPE, INPUTS } from '@constants';
import { GroundLoader, LightLoader, HouseGLTFLoader } from '@loaders';
import { Utils } from '@utils';

let camera, scene, renderer, controls, stats, gui;

let valves_mesh; //开关
let pipelines_mesh; //管道
let circuit_mesh; //线路 = 开关 + 管道
let all_mesh; //开关 + 管道 + 外载模型 


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);
const test_inputs = INPUTS.input; //坐标信息
const tree_properties = INPUTS.treeProperties; //树的统一属性

init();
animate();

function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(-6, 1.2, -15);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(-6.5, 1, -16);
  controls.panSpeed = 4;
  controls.update();

  all_mesh = new THREE.Group();
  circuit_mesh = new THREE.Group();

  Utils.connectFromHere(test_inputs);

  // 开关初始化
  valves_mesh = new ValveMesh(test_inputs, tree_properties, onValveClick);
  circuit_mesh.add(valves_mesh.render());


  // 管道初始化
  pipelines_mesh = new PipelineMesh(test_inputs, tree_properties, onPipelineClick);
  circuit_mesh.add(pipelines_mesh.render());

  circuit_mesh.scale.set(0.2, 0.2, 0.2);

  all_mesh.add(circuit_mesh);
  scene.add(all_mesh);

  // LIGHT
  LightLoader.load(scene);

  // GROUND
  GroundLoader.load([scene]);

  // HOUSE
  HouseGLTFLoader.load([scene, all_mesh]);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  gui = new GUIPanel('gui-container');

  window.addEventListener('resize', onWindowResize);
  document.getElementsByTagName("canvas")[0] && document.getElementsByTagName("canvas")[0].addEventListener('click', onGlobalClick);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onGlobalClick(event) {

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersection = raycaster.intersectObject(all_mesh);

  if (intersection.length > 0) {

    if (intersection[0].object.userData.isValveMesh) {

      const instanceId = intersection[0].instanceId;

      const clickInstance = CircuitMesh.findByIndex(instanceId, test_inputs, CIRCUIT_TYPE.VALVE);

      if (!!clickInstance && clickInstance.clickable) {

        clickInstance.onClickEvent();

      }

    }

    if (intersection[0].object.userData.isPipelineMesh) {

      const instanceId = intersection[0].instanceId;

      const clickInstance = CircuitMesh.findByIndex(instanceId, test_inputs, CIRCUIT_TYPE.PIPELINE);

      if (!!clickInstance && clickInstance.clickable) {

        clickInstance.onClickEvent();

      }

    }

  }

}



function animate() {

  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);

  render();

  stats.update();

}

function render() {

  renderer.render(scene, camera);

}

function onValveClick(valveProps) {

  gui.populateInfo(valveProps.information, valveProps.isValveOn)

  gui.onValveStatusUpdate(() => {
    valveProps.isValveOn = !valveProps.isValveOn;
    updatePipelineConnectStatus(valveProps);
    valves_mesh.rerender();
    pipelines_mesh.rerender();
  });

}

function onPipelineClick(pipelineProps) {
  gui.populateInfo(pipelineProps.information);
}

function updatePipelineConnectStatus(valveProps) {

  const isConnected = !!valveProps.isConnected;
  const childs = valveProps.child;

  if (childs) {
    if (isConnected) {
      Utils.connectFromHere([valveProps]);
    } else {
      Utils.disconnectFromHere(valveProps.child);
    }
  }

}