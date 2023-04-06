import { InstancedMesh, Matrix4, IcosahedronGeometry, MeshPhongMaterial } from 'three';
import { COLOR } from '@constants';

class SwitchMesh {

    constructor(switch_mesh_input_props) {
        const sphere = new IcosahedronGeometry(0.8, 3);
        const swithes_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.switch_mesh_input_props = switch_mesh_input_props;
        this.switches_mesh = new InstancedMesh(sphere, swithes_material, switch_mesh_input_props.length);
    }

    render() {
        const switch_mesh_input_props = this.switch_mesh_input_props;
        const switches_mesh = this.switches_mesh;
        for (let i = 0; i < switch_mesh_input_props.length; i++) {
            const sphere_matrix = new Matrix4();
            sphere_matrix.setPosition(switch_mesh_input_props[i].position_x, switch_mesh_input_props[i].position_y, switch_mesh_input_props[i].position_z);
            switches_mesh.setMatrixAt(i, sphere_matrix);
            switches_mesh.setColorAt(
                i,
                switch_mesh_input_props[i].isSwitchOn
                    ? COLOR.RED
                    : COLOR.WHITE
            );
        }

        switches_mesh.castShadow = true;
        switches_mesh.userData.clickable = true;
        return switches_mesh;
    }

    rerender(){
        this.render();
        this.switches_mesh.instanceColor.needsUpdate = true;
    }
}

export { SwitchMesh }; 