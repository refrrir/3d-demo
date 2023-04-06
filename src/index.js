import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ValveMesh, PipelineMesh } from '@objects';
import { CircuitMeshInputProps, ValveMeshInputProps, ValvePipelineRelationProps } from '@models';
import { COLOR, DIRECTION } from '@constants';


let camera, scene, renderer, controls, stats;

let valves_mesh; //开关
let pipelines_mesh; //管道
let circuit_mesh; //线路 = 开关 + 管道
let all_mesh; //开关 + 管道 + 外载模型 


const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);

const white = COLOR.WHITE;

// 输入

//开关
const valve_mesh_inputs = [
    new ValveMeshInputProps(0, 0, 0, null, null, true),
    new ValveMeshInputProps(0, 3, 0, null, null, false)
];

//管道
const pipeline_mesh_inputs = [
    new CircuitMeshInputProps(0, 2, 0, DIRECTION.Z, Math.PI * 0.5),
    new CircuitMeshInputProps(0, 2, 0, DIRECTION.X, 0),
    new CircuitMeshInputProps(0, 5, 0, DIRECTION.X, 0),
];

//开关和管道的对应
const valves_pipelines_relations = [
    new ValvePipelineRelationProps(0, 0),
    new ValvePipelineRelationProps(1, 2)
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
    const planeMaterial = new THREE.MeshPhongMaterial({ color: white });

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
    valves_mesh = new ValveMesh(valve_mesh_inputs);

    circuit_mesh.add(valves_mesh.render());


    // 管道初始化
    pipelines_mesh = new PipelineMesh(pipeline_mesh_inputs, valve_mesh_inputs, valves_pipelines_relations);

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

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousedown', onMouseDown);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onMouseDown(event) {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersection = raycaster.intersectObject(all_mesh);

    if (intersection.length > 0) {

        const userData = intersection[0].object.userData;

        if (userData.clickable) {

            const instanceId = intersection[0].instanceId;

            const pipelineId = findRelatedPipelines(instanceId);

            if (pipelineId != -1) {

                valve_mesh_inputs[instanceId].isValveOn = !valve_mesh_inputs[instanceId].isValveOn;

                valves_mesh.rerender();

                pipelines_mesh.rerender();
            }
        }

    }

}

function findRelatedPipelines(valveIndex) {

    for (const relation of valves_pipelines_relations) {

        if (relation.valve_index === valveIndex) {
            return relation.pipeline_index;
        }
    }

    return -1;
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