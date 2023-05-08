import { Scene, DirectionalLight } from 'three';

abstract class LightLoader {

    static load(scene: typeof Scene) {

        const dirLight1 = new DirectionalLight(0xffffff, 0.3);
        dirLight1.position.set(0, 20, 0);
        dirLight1.castShadow = false;
        scene.add(dirLight1);

        const dirLight2 = new DirectionalLight(0xffffff, 0.4);
        dirLight2.position.set(20, 0, 0);
        dirLight2.castShadow = false;
        scene.add(dirLight2);

        const dirLight3 = new DirectionalLight(0xffffff, 0.5);
        dirLight3.position.set(0, 0, 20);
        dirLight3.castShadow = false;
        scene.add(dirLight3);

        const dirLight4 = new DirectionalLight(0xffffff, 0.3);
        dirLight4.position.set(0, -20, 0);
        dirLight4.castShadow = false;
        scene.add(dirLight4);

        const dirLight5 = new DirectionalLight(0xffffff, 0.5);
        dirLight5.position.set(-20, 0, 0);
        dirLight5.castShadow = false;
        scene.add(dirLight5);

        const dirLight6 = new DirectionalLight(0xffffff, 0.4);
        dirLight6.position.set(0, 0, -20);
        dirLight6.castShadow = false;
        scene.add(dirLight6);
    }
}

export { LightLoader };