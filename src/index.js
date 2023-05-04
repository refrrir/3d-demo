import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUIPanel } from "@components";
import { ValveMesh, PipelineMesh, CircuitMesh } from '@objects';
import { CIRCUIT_TYPE, COLOR, DIRECTION } from '@constants';
import { Utils } from '@utils';

let camera, scene, renderer, controls, stats, gui;

let valves_mesh; //开关
let pipelines_mesh; //管道
let circuit_mesh; //线路 = 开关 + 管道
let all_mesh; //开关 + 管道 + 外载模型 


const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);

// 输入


const test_inputs = [
  {
    // 热水器阀
    position_x: -55,
    position_y: 12.6,
    position_z: -103,
    isValveOn: false,
    radius: 0.5,
    information: [
      { name: "ID", value: "50-5-H" },
      { name: "Name", value: "water heater valve" },
      { name: "Location", value: "kitchen" },
      { name: "Type", value: "solenoid valve" },
      { name: "Model", value: "JKB-V1-DN50" },
    ],
    type: CIRCUIT_TYPE.VALVE,
    child: [
      {
        // 热水器管
        position_x: -55,
        position_y: 14,
        position_z: -103,
        rotation_direction: DIRECTION.Z,
        rotation_degree: 0,
        radius: 0.3,
        height: 3,
        information: [
          { name: "ID", value: "987-111-P" },
          { name: "Type", value: "Gas" },
          { name: "Model", value: "DN50" },
          { name: "Presure", value: "3.6 Kpa" },
          { name: "Location", value: "bathroom" },
        ],
        type: CIRCUIT_TYPE.PIPELINE,
      },
      {
        // 热水器立管
        position_x: -55,
        position_y: 8.9,
        position_z: -103,
        rotation_direction: DIRECTION.Z,
        rotation_degree: 0,
        radius: 0.3,
        height: 7,
        information: [
          { name: "ID", value: "987-69-P" },
          { name: "Type", value: "Gas" },
          { name: "Model", value: "DN50" },
          { name: "Presure", value: "3.5 Kpa" },
          { name: "Location", value: "bathroom" },
        ],
        type: CIRCUIT_TYPE.PIPELINE,
        child: [
          {
            // 灶前水平管
            position_x: 5.37,
            position_y: 60,
            position_z: -103,
            rotation_direction: DIRECTION.Z,
            rotation_degree: Math.PI * 0.5,
            radius: 0.3,
            height: 18,
            information: [
              { name: "ID", value: "987-765-P" },
              { name: "Type", value: "Gas" },
              { name: "Model", value: "DN80" },
              { name: "Presure", value: "3.4 Kpa" },
              { name: "Location", value: "kitchen" },
            ],
            type: CIRCUIT_TYPE.PIPELINE,
          },
          {
            // 总阀
            position_x: -51,
            position_y: 5.37,
            position_z: -103,
            isValveOn: false,
            radius: 0.5,
            information: [
              { name: "ID", value: "99001-765-M" },
              { name: "Name", value: "main valve" },
              { name: "Location", value: "outdoor" },
              { name: "Type", value: "manual valve" },
              { name: "Model", value: "JKB-V2-DN120" },
            ],
            type: CIRCUIT_TYPE.VALVE,
            child: [
              {
                // 立管
                position_x: -51,
                position_y: 1.3,
                position_z: -103,
                rotation_direction: DIRECTION.Z,
                rotation_degree: 0,
                radius: 0.3,
                height: 8.8,
                information: [
                  { name: "ID", value: "987-65-P" },
                  { name: "Type", value: "Gas" },
                  { name: "Model", value: "DN80" },
                  { name: "Presure", value: "3.3 Kpa" },
                  { name: "Location", value: "kitchen" },
                ],
                type: CIRCUIT_TYPE.PIPELINE,
                child: [{
                  // 入户水平管
                  position_x: -51,
                  position_y: -113,
                  position_z: 3,
                  rotation_direction: DIRECTION.X,
                  rotation_degree: Math.PI * 0.5,
                  radius: 0.3,
                  height: 20.2,
                  information: [
                    { name: "ID", value: "91-P" },
                    { name: "Type", value: "Gas" },
                    { name: "Model", value: "DN50" },
                    { name: "Presure", value: "3.2 Kpa" },
                    { name: "Location", value: "kitchen" },
                  ],
                  type: CIRCUIT_TYPE.PIPELINE,
                  child: [
                    {
                      // 入户阀
                      position_x: -51,
                      position_y: -3,
                      position_z: -123,
                      isValveOn: true,
                      radius: 0.7,
                      information: [
                        { name: "ID", value: "60-5-H" },
                        { name: "Name", value: "house valve" },
                        { name: "Location", value: "kitchen" },
                        { name: "Type", value: "solenoid valve" },
                        { name: "Model", value: "JKB-V1-DN80" },
                      ],
                      type: CIRCUIT_TYPE.VALVE,
                      child: [
                        {
                          // 总管
                          position_x: -51,
                          position_y: -5,
                          position_z: -123,
                          rotation_direction: DIRECTION.Z,
                          rotation_degree: 0,
                          radius: 0.35,
                          height: 3,
                          information: [
                            { name: "ID", value: "001-E" },
                            { name: "Type", value: "Gas" },
                            { name: "Model", value: "DN120" },
                            { name: "Presure", value: "3.1 Kpa" },
                            { name: "Location", value: "outdoor" },
                          ],
                          type: CIRCUIT_TYPE.PIPELINE,
                        }
                      ]
                    }
                  ]
                }]
              }
            ]
          }
        ]
      }
    ]
  }
]


init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(30, 6, 30);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0xa0a0a0);

  // LIGHT

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.2;
  spotLight.position.set(30, 20, 30);
  spotLight.castShadow = true;
  // spotLight.shadow.camera.near = 3;
  // spotLight.shadow.camera.far = 10;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  scene.add(spotLight);

  const dirLight = new THREE.DirectionalLight(0x55505a, 1);
  dirLight.position.set(-10, 30, 30);
  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  // GROUND

  const geometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: COLOR.WHITE });

  const ground = new THREE.Mesh(geometry, planeMaterial);

  ground.position.set(0, -1, 0);
  ground.rotation.x = - Math.PI / 2;
  ground.scale.set(100, 100, 100);

  ground.castShadow = false;
  ground.receiveShadow = true;

  scene.add(ground);

  // GRID

  const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);


  all_mesh = new THREE.Group();
  circuit_mesh = new THREE.Group();

  Utils.connectFromHere(test_inputs);

  // 开关初始化
  valves_mesh = new ValveMesh(test_inputs, onValveClick);

  circuit_mesh.add(valves_mesh.render());


  // 管道初始化
  pipelines_mesh = new PipelineMesh(test_inputs, onPipelineClick);

  circuit_mesh.add(pipelines_mesh.render());

  all_mesh.add(circuit_mesh);

  scene.add(all_mesh);

  loader.load(
    // resource URL
    '../models/3d_house.gltf',
    // called when the resource is loaded
    function (gltf) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.userData.clickable = false;
          // node.receiveShadow = true;
        }
      })
      //注释下面两行不显示房间 
      scene.add(gltf.scene);
      all_mesh.add(gltf.scene);

      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene.scale.set(2, 2, 2); // THREE.Group
      gltf.scene.rotation.x -= Math.PI * 0.5;
      gltf.scenes; // Array<THREE.Group>
      gltf.asset; // Object
      gltf.scene.position.setX(-20);
      gltf.scene.position.setZ(15);
      gltf.scene.position.setY(-1);
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
      console.log('An error happened: ' + error);
    }
  );

  circuit_mesh.scale.set(0.2, 0.2, 0.2);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  renderer.shadowMapSoft = true;

  renderer.shadowCameraNear = 3;
  renderer.shadowCameraFar = camera.far;
  renderer.shadowCameraFov = 50;

  renderer.shadowMapBias = 0.0039;
  renderer.shadowMapDarkness = 0.5;
  renderer.shadowMapWidth = 1024;
  renderer.shadowMapHeight = 1024;

  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.screenSpacePanning = false;

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

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

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

  controls.update();

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