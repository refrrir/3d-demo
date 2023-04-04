import { InstancedMesh, Matrix4, CylinderGeometry, MeshPhongMaterial, Quaternion } from 'three';
import { COLOR } from '@colors';

class TubeMesh {

    constructor(cylinder_rotations, cylinder_positions) {
        const cylinder = new CylinderGeometry(0.5, 0.5, 3, 50);
        const cylinder_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.cylinder_rotations = cylinder_rotations;
        this.cylinder_positions = cylinder_positions;
        this.tubes_mesh = new InstancedMesh(cylinder, cylinder_material, cylinder_positions.length);
    }

    init() {
        const cylinder_rotations = this.cylinder_rotations;
        const cylinder_positions = this.cylinder_positions;
        const tubes_mesh = this.tubes_mesh;

        for (let i = 0; i < cylinder_positions.length; i++) {
            const cylinder_matrix = new Matrix4();
            cylinder_matrix.makeRotationFromQuaternion(new Quaternion().setFromAxisAngle(cylinder_rotations[i].axis, cylinder_rotations[i].degree));
            cylinder_matrix.multiply(new Matrix4().makeTranslation(cylinder_positions[i].x, cylinder_positions[i].y, cylinder_positions[i].z));

            tubes_mesh.setMatrixAt(i, cylinder_matrix);
            tubes_mesh.setColorAt(i, COLOR.GREEN);
        }

        tubes_mesh.castShadow = true;
        tubes_mesh.userData.clickable = false;
        return tubes_mesh;
    }
}

export { TubeMesh }; 