import { Scene } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


abstract class HouseGLTFLoader {

    static load(scenes: typeof Scene[]) {
        const loader = new GLTFLoader();

        loader.load(
            '../../models/3d_house.gltf',
            // called when the resource is loaded
            function (gltf: any) {
              gltf.scene.traverse(function (node: any) {
                if (node.isMesh) {
                  node.castShadow = true;
                  node.userData.clickable = false;
                  node.material.opacity = 0.6;
                  node.material.transparent = true;
                }
              })        
              gltf.animations;
              gltf.scene.scale.set(2, 2, 2);
              gltf.scene.rotation.x -= Math.PI * 0.5;
              gltf.scene.position.setX(-20);
              gltf.scene.position.setZ(15);
              gltf.scene.position.setY(-1);
              scenes.forEach((scene) => {
                scene.add(gltf.scene);
              })
            },
            // called while loading is progressing
            function (xhr: any) {
              console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error: any) {
              console.log('An error happened: ' + error);
            }
          );
    }
}

export { HouseGLTFLoader };