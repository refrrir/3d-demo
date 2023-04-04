import { InstancedMesh, Matrix4, CylinderGeometry, MeshPhongMaterial, Quaternion } from 'three';
import { COLOR } from '@colors';

class TubeMesh {

    constructor(tube_mesh_input_props) {
        const cylinder = new CylinderGeometry(0.5, 0.5, 3, 50);
        const cylinder_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.tube_mesh_input_props = tube_mesh_input_props;
        this.tubes_mesh = new InstancedMesh(cylinder, cylinder_material, tube_mesh_input_props.length);
    }

    init() {
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
        return tubes_mesh;
    }
}

export { TubeMesh }; 