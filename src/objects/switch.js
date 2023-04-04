import { InstancedMesh, Matrix4, IcosahedronGeometry, MeshPhongMaterial} from 'three';
import { COLOR } from '@colors';

class SwitchMesh {

    constructor(sphere_positions) {
        const sphere = new IcosahedronGeometry(0.8, 3);
        const swithes_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.sphere_positions = sphere_positions;
        this.swithes_mesh = new InstancedMesh(sphere, swithes_material, sphere_positions.length);
    }

    init() {
        const sphere_positions = this.sphere_positions;
        const swithes_mesh = this.swithes_mesh;
        for (let i = 0; i < sphere_positions.length; i++) {
            const sphere_matrix = new Matrix4();
            sphere_matrix.setPosition(sphere_positions[i].x, sphere_positions[i].y, sphere_positions[i].z);

            swithes_mesh.setMatrixAt(i, sphere_matrix);
            swithes_mesh.setColorAt(i, COLOR.WHITE);
        }

        swithes_mesh.castShadow = true;
        swithes_mesh.userData.clickable = true;
        return swithes_mesh;
    }
}

export { SwitchMesh }; 