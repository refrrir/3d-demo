import { Scene, PlaneGeometry, MeshPhongMaterial, Mesh } from 'three';
import { COLOR } from '@constants';

abstract class GroundLoader {

    static load(scenes: typeof Scene[]) {

        const geometry = new PlaneGeometry(100, 100);
        const planeMaterial = new MeshPhongMaterial({ color: COLOR.WHITE });

        const ground = new Mesh(geometry, planeMaterial);

        ground.position.set(0, -1, 0);
        ground.rotation.x = - Math.PI / 2;
        ground.scale.set(100, 100, 100);

        ground.castShadow = false;
        ground.receiveShadow = false;

        scenes.forEach((scene) => {
            scene.add(ground);
        });
    }
}

export { GroundLoader };