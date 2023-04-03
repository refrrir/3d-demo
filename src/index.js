import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, controls, stats;

let swithes_mesh;
let tubes_mesh;

const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);

const color = new THREE.Color();
const white = new THREE.Color().setHex(0xffffff);
const red = new THREE.Color().setHex(0xff0000);
const green = new THREE.Color().setHex(0x097969);

const directions = {
    directions_x: new THREE.Vector3(1, 0, 0),
    directions_y: new THREE.Vector3(0, 1, 0),
    directions_z: new THREE.Vector3(0, 0, 1)
};

let isSwithOn = false;
const sphere_positions = [{ x: 0, y: 0, z: 0 }];
const cylinder_positions = [{ x: 0, y: 2, z: 0 }, { x: 0, y: 2, z: 0 }];
const cylinder_rotations = [{ axis: directions.directions_z, degree: Math.PI * 0.5 }, { axis: directions.directions_x, degree: 0 }];

const swithes_tubes_relations = [{ switch_index: 0, tube_index: 0 }];

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


    const sphere = new THREE.IcosahedronGeometry(0.8, 3);
    const cylinder = new THREE.CylinderGeometry(0.5, 0.5, 3, 50);
    const swithes_material = new THREE.MeshPhongMaterial({ color: white });
    const cylinder_material = new THREE.MeshPhongMaterial({ color: white });


    swithes_mesh = new THREE.InstancedMesh(sphere, swithes_material, sphere_positions.length);

    for (let i = 0; i < sphere_positions.length; i++) {
        const sphere_matrix = new THREE.Matrix4();
        sphere_matrix.setPosition(sphere_positions[i].x, sphere_positions[i].y, sphere_positions[i].z);

        swithes_mesh.setMatrixAt(i, sphere_matrix);
        swithes_mesh.setColorAt(i, white);
    }

    swithes_mesh.castShadow = true;

    scene.add(swithes_mesh);

    tubes_mesh = new THREE.InstancedMesh(cylinder, cylinder_material, cylinder_positions.length);

    for (let i = 0; i < cylinder_positions.length; i++) {
        const cylinder_matrix = new THREE.Matrix4();
        cylinder_matrix.makeRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(cylinder_rotations[i].axis, cylinder_rotations[i].degree));
        cylinder_matrix.multiply(new THREE.Matrix4().makeTranslation(cylinder_positions[i].x, cylinder_positions[i].y, cylinder_positions[i].z));

        tubes_mesh.setMatrixAt(i, cylinder_matrix);
        tubes_mesh.setColorAt(i, green);
    }

    tubes_mesh.castShadow = true;

    scene.add(tubes_mesh);

    loader.load(
        // resource URL
        '../models/3D_House_n.gltf',
        // called when the resource is loaded
        function (gltf) {
            gltf.scene.traverse(function (node) {
                if (node.isMesh) { 
                    node.castShadow = true; 
                    node.userData.blocking = true;
                    // node.receiveShadow = true;
                }
            })
            scene.add(gltf.scene);
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

    const intersection = raycaster.intersectObject(swithes_mesh);

    if (intersection.length > 0) {

        const instanceId = intersection[0].instanceId;

        const tubeId = findRelatedTubes(instanceId);

        isSwithOn = !isSwithOn;

        swithes_mesh.getColorAt(instanceId, color);

        if (isSwithOn == true) {

            swithes_mesh.setColorAt(instanceId, red);

            swithes_mesh.instanceColor.needsUpdate = true;


            if (tubeId !== -1) {

                tubes_mesh.setColorAt(tubeId, white);

                tubes_mesh.instanceColor.needsUpdate = true;
            }
        }
        else if (isSwithOn == false) {

            swithes_mesh.setColorAt(instanceId, white);

            swithes_mesh.instanceColor.needsUpdate = true;

            if (tubeId !== -1) {

                tubes_mesh.setColorAt(tubeId, green);

                tubes_mesh.instanceColor.needsUpdate = true;
            }


        }

    }

}

function findRelatedTubes(switchIndex) {

    for (const relation of swithes_tubes_relations) {

        if (relation.switch_index === switchIndex) {
            return relation.tube_index;
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