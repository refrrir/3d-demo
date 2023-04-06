import { InstancedMesh, Matrix4, CylinderGeometry, MeshPhongMaterial, Quaternion } from 'three';
import { COLOR } from '@constants';

class PipelineMesh {

    constructor(pipeline_mesh_input_props, valve_mesh_inputs, valves_pipelines_relations) {
        const cylinder = new CylinderGeometry(0.5, 0.5, 3, 50);
        const cylinder_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.pipeline_mesh_input_props = pipeline_mesh_input_props;
        this.valve_mesh_inputs = valve_mesh_inputs;
        this.valves_pipelines_relations = valves_pipelines_relations;
        this.pipelines_mesh = new InstancedMesh(cylinder, cylinder_material, pipeline_mesh_input_props.length);
    }

    render() {
        const pipeline_mesh_input_props = this.pipeline_mesh_input_props;
        const pipelines_mesh = this.pipelines_mesh;

        for (let i = 0; i < pipeline_mesh_input_props.length; i++) {
            const cylinder_matrix = new Matrix4();
            cylinder_matrix.makeRotationFromQuaternion(new Quaternion().setFromAxisAngle(pipeline_mesh_input_props[i].rotation_direction, pipeline_mesh_input_props[i].rotation_degree));
            cylinder_matrix.multiply(new Matrix4().makeTranslation(pipeline_mesh_input_props[i].position_x, pipeline_mesh_input_props[i].position_y, pipeline_mesh_input_props[i].position_z));

            pipelines_mesh.setMatrixAt(i, cylinder_matrix);
            pipelines_mesh.setColorAt(i, COLOR.GREEN);
        }

        pipelines_mesh.castShadow = true;
        pipelines_mesh.userData.clickable = false;

        if (this.valve_mesh_inputs != null && this.valves_pipelines_relations != null) {
            this.update_pipeline_based_on_valve();
        }
        return pipelines_mesh;
    }

    update_pipeline_based_on_valve() {

        for (const relation of this.valves_pipelines_relations) {

            const valve_index = relation.valve_index;
            const pipeline_index = relation.pipeline_index;

            if (valve_index >= 0 && valve_index < this.valve_mesh_inputs.length && pipeline_index >= 0 && pipeline_index < this.pipeline_mesh_input_props.length) {
                if (this.valve_mesh_inputs[valve_index].isValveOn) {
                    this.pipelines_mesh.setColorAt(pipeline_index, COLOR.WHITE);
                } else {
                    this.pipelines_mesh.setColorAt(pipeline_index, COLOR.GREEN);
                }
            }
        }
    }

    rerender(){
        this.render();
        this.pipelines_mesh.instanceColor.needsUpdate = true;
    }
}

export { PipelineMesh }; 