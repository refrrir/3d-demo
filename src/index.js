import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUIPanel } from "@components";
import { ValveMesh, PipelineMesh } from '@objects';
import { COLOR, DIRECTION } from '@constants';
import { Utils } from '@utils';
import { mergeBufferGeometries } from 'three/addons/utils/BufferGeometryUtils.js';


// panel example
// import { insertTextList, insertCheckboxList, removeListItems, } from "./component/panel.ts";

// function removeList(checked) {
//     if (!checked) removeListItems();
// } // For test
// function changeValveColor(checked) {
//     if (checked) console.log("Valve => yellow");
//     else console.log("Valve => gray");
// } // Callback function
// const valve_properties = [
//     { name: "ID", value: "99001-765-M" },
//     { name: "Name", value: "main valve" },
//     { name: "Location", value: "kitchen" },
//     { name: "Type", value: "solenoid valve" },
//     { name: "Model", value: "JKB-V2-DN150" },
// ]; // From entity.properties

// let valveStatus = true // From entity.isSwitchOn
// let pressure = 390.5 // From sensor
// let properties = [
//     ...valve_properties,
//     ...[
//         { name: "Valve status", value: valveStatus },
//         { name: "Presure", value: `${pressure} Pascal` },
//         { name: "testRemoveList", value: false },
//     ],
// ];
// for (const property of properties) {
//     if (typeof property.value == "string")
//         insertTextList(property.name, property.value);
//     else if (typeof property.value === "boolean")
//         insertCheckboxList(
//             property.name,
//             property.value,
//             property.name === "testRemoveList" ? removeList : changeValveColor
//         );
// }
// End

let camera, scene, renderer, controls, stats, gui;

let valves_mesh; //开关
let pipelines_mesh; //管道
let circuit_mesh; //线路 = 开关 + 管道
let all_mesh; //开关 + 管道 + 外载模型 

let particles;
let intersects;
let INTERSECTED;
const PARTICLE_SIZE = 1;


const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);

// 输入

// 阀门
const valve_mesh_inputs = [
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
    },
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
    },
    {
      // 热水器阀
      position_x: -55,
      position_y: 12.6,
      position_z: -103,
      isValveOn: true,
      radius: 0.5,
      information: [
        { name: "ID", value: "50-5-H" },
        { name: "Name", value: "water heater valve" },
        { name: "Location", value: "kitchen" },
        { name: "Type", value: "solenoid valve" },
        { name: "Model", value: "JKB-V1-DN50" },
      ],
    },
  ];
  
  //管道
  const pipeline_mesh_inputs = [
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
        { name: "Type", value: "Gas"},
        { name: "Model", value: "DN120" },
        { name: "Presure", value: "3.1 Kpa" },
        { name: "Location", value: "outdoor" },
      ],
    },
    {
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
        { name: "Type", value: "Gas"},
        { name: "Model", value: "DN50" },
        { name: "Presure", value: "3.2 Kpa" },
        { name: "Location", value: "kitchen" },
      ],
    },
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
        { name: "Type", value: "Gas"},
        { name: "Model", value: "DN80" },
        { name: "Presure", value: "3.3 Kpa" },
        { name: "Location", value: "kitchen" },
      ],
    },
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
        { name: "Type", value: "Gas"},
        { name: "Model", value: "DN80" },
        { name: "Presure", value: "3.4 Kpa" },
        { name: "Location", value: "kitchen" },
      ],
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
        { name: "Type", value: "Gas"},
        { name: "Model", value: "DN50" },
        { name: "Presure", value: "3.5 Kpa" },
        { name: "Location", value: "bathroom" },
      ],
    },
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
        { name: "Type", value: "Gas"},
        { name: "Model", value: "DN50" },
        { name: "Presure", value: "3.6 Kpa" },
        { name: "Location", value: "bathroom" },
      ],
    },
  ];

//开关和管道的对应
const valves_pipelines_relations = [
    { valve_index: 0, pipeline_index: 0 },
    { valve_index: 1, pipeline_index: 2 },
];

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


    // 开关初始化
    valves_mesh = new ValveMesh(valve_mesh_inputs, onValveClick);

    circuit_mesh.add(valves_mesh.render());


    // 管道初始化
    pipelines_mesh = new PipelineMesh(pipeline_mesh_inputs, valve_mesh_inputs, valves_pipelines_relations, onPipelineClick);

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

    let boxGeometryArray = [];

    let n = 4;
    let s = 10;
    let index = 0;

    while (s > 0) {

        let l = n * s;

        let boxGeometry = new THREE.BoxGeometry(l, l, l, s, s, s);

        boxGeometry.deleteAttribute('normal');
        boxGeometry.deleteAttribute('uv');

        boxGeometryArray[index++] = boxGeometry;

        s--;

    }

    let boxGeometryAll = mergeBufferGeometries(boxGeometryArray, true);


    const positionAttribute = boxGeometryAll.getAttribute('position');

    const colors = [];
    const sizes = [];

    const color = new THREE.Color();

    for (let i = 0, l = positionAttribute.count; i < l; i++) {

        color.setHSL(0.01 + 0.1 * (i / l), 1.0, 0.5);
        color.toArray(colors, i * 3);

        sizes[i] = PARTICLE_SIZE * 0.5;

    }

    const vertices_geometry = new THREE.BufferGeometry();
    vertices_geometry.setAttribute('position', positionAttribute);
    vertices_geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
    vertices_geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));


    const material = new THREE.ShaderMaterial({

        uniforms: {
            color: { value: new THREE.Color(0xffffff) },
            pointTexture: { value: new THREE.TextureLoader().load('../disc.png') },
            alphaTest: { value: 0.9 }
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent

    });

    particles = new THREE.Points(vertices_geometry, material);

    scene.add(particles);

    gui = new GUIPanel('gui-container');

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('pointermove', onPointerMove);
    document.getElementsByTagName("canvas")[0] && document.getElementsByTagName("canvas")[0].addEventListener('click', onGlobalClick);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onGlobalClick() {

    raycaster.setFromCamera(mouse, camera);

    const intersection = raycaster.intersectObject(all_mesh);

    if (intersection.length > 0) {

        if (intersection[0].object.userData.isVavleMesh) {

            const instanceId = intersection[0].instanceId;

            if (valve_mesh_inputs[instanceId].clickable) {

                valve_mesh_inputs[instanceId].onClickEvent();
            }

        }

        if (intersection[0].object.userData.isPipelineMesh) {

            const instanceId = intersection[0].instanceId;

            if (pipeline_mesh_inputs[instanceId].clickable) {

                pipeline_mesh_inputs[instanceId].onClickEvent();
            }

        }

    }

}

function onPointerMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    raycaster.setFromCamera(mouse, camera);

    render();

    stats.update();

}

function render() {


    const geometry = particles.geometry;
    const attributes = geometry.attributes;

    raycaster.setFromCamera(mouse, camera);

    intersects = raycaster.intersectObject(particles);

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].index) {

            attributes.size.array[INTERSECTED] = PARTICLE_SIZE * 0.5;

            INTERSECTED = intersects[0].index;

            attributes.size.array[INTERSECTED] = PARTICLE_SIZE * 5;
            attributes.size.needsUpdate = true;

            console.log(attributes.position.getX(INTERSECTED) + " " + attributes.position.getY(INTERSECTED) + " " + attributes.position.getZ(INTERSECTED));
        }

    } else if (INTERSECTED !== null) {

        attributes.size.array[INTERSECTED] = PARTICLE_SIZE * 0.5;
        attributes.size.needsUpdate = true;
        INTERSECTED = null;

    }

    renderer.render(scene, camera);

}

function onValveClick(instanceId) {

    gui.populateInfo(valve_mesh_inputs[instanceId].information, valve_mesh_inputs[instanceId].isValveOn)

    const pipelineId = Utils.findRelatedPipelines(valves_pipelines_relations, instanceId);

    if (pipelineId != -1) {

        gui.onValveStatusUpdate(() => {
            valve_mesh_inputs[instanceId].isValveOn = !valve_mesh_inputs[instanceId].isValveOn;
            valves_mesh.rerender();
            pipelines_mesh.rerender();
        })

    }
}

function onPipelineClick(instanceId) {
    gui.populateInfo(pipeline_mesh_inputs[instanceId].information);
}