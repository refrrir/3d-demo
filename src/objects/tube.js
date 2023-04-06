import { InstancedMesh, Matrix4, CylinderGeometry, MeshPhongMaterial, Quaternion } from 'three';
import { COLOR } from '@constants';

class TubeMesh {

    constructor(tube_mesh_input_props, switch_mesh_inputs, swithes_tubes_relations) {
        const cylinder = new CylinderGeometry(0.5, 0.5, 3, 50);
        const cylinder_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.tube_mesh_input_props = tube_mesh_input_props;
        this.switch_mesh_inputs = switch_mesh_inputs;
        this.swithes_tubes_relations = swithes_tubes_relations;
        this.tubes_mesh = new InstancedMesh(cylinder, cylinder_material, tube_mesh_input_props.length);
    }

    render() {
        const tube_mesh_input_props = this.tube_mesh_input_props;
        const tubes_mesh = this.tubes_mesh;

        for (let i = 0; i < tube_mesh_input_props.length; i++) {
            const cylinder_matrix = new Matrix4();
            cylinder_matrix.makeRotationFromQuaternion(new Quaternion().setFromAxisAngle(tube_mesh_input_props[i].rotation_direction, tube_mesh_input_props[i].rotation_degree));
            cylinder_matrix.multiply(new Matrix4().makeTranslation(tube_mesh_input_props[i].position_x, tube_mesh_input_props[i].position_y, tube_mesh_input_props[i].position_z));

            tubes_mesh.setMatrixAt(i, cylinder_matrix);
            tubes_mesh.setColorAt(i, COLOR.GREEN);
        }

        tubes_mesh.castShadow = true;
        tubes_mesh.userData.clickable = false;

        if (this.switch_mesh_inputs != null && this.swithes_tubes_relations != null) {
            this.update_tube_based_on_switch();
        }
        return tubes_mesh;
    }

    update_tube_based_on_switch() {

        for (const relation of this.swithes_tubes_relations) {

            const switch_index = relation.switch_index;
            const tube_index = relation.tube_index;

            if (switch_index >= 0 && switch_index < this.switch_mesh_inputs.length && tube_index >= 0 && tube_index < this.tube_mesh_input_props.length) {
                if (this.switch_mesh_inputs[switch_index].isSwitchOn) {
                    this.tubes_mesh.setColorAt(tube_index, COLOR.WHITE);
                } else {
                    this.tubes_mesh.setColorAt(tube_index, COLOR.GREEN);
                }
            }
        }
    }

    rerender(){
        this.render();
        this.tubes_mesh.instanceColor.needsUpdate = true;
    }
}

export { TubeMesh }; 