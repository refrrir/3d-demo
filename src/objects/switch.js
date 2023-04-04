import { InstancedMesh, Matrix4, IcosahedronGeometry, MeshPhongMaterial} from 'three';
import { COLOR } from '@colors';

class SwitchMesh {

    constructor(switch_mesh_input_props) {
        const sphere = new IcosahedronGeometry(0.8, 3);
        const swithes_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.switch_mesh_input_props = switch_mesh_input_props;
        this.swithes_mesh = new InstancedMesh(sphere, swithes_material, switch_mesh_input_props.length);
    }

    init() {
        const switch_mesh_input_props = this.switch_mesh_input_props;
        const swithes_mesh = this.swithes_mesh;
        for (let i = 0; i < switch_mesh_input_props.length; i++) {
            const sphere_matrix = new Matrix4();
            sphere_matrix.setPosition(switch_mesh_input_props[i].position_x, switch_mesh_input_props[i].position_y, switch_mesh_input_props[i].position_z);

            swithes_mesh.setMatrixAt(i, sphere_matrix);
            swithes_mesh.setColorAt(i, COLOR.WHITE);
        }

        swithes_mesh.castShadow = true;
        swithes_mesh.userData.clickable = true;
        return swithes_mesh;
    }
}

export { SwitchMesh }; 