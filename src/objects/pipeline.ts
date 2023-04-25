import { InstancedMesh, Matrix4, CylinderGeometry, MeshPhongMaterial, Quaternion } from 'three';
import { CircuitMeshInputProps, PipelineMeshInputProps } from '@models';
import { CIRCUIT_TYPE, COLOR } from '@constants';
import { CircuitMesh } from './circuit';

class PipelineMesh extends CircuitMesh{

    circuit_mesh_input_props;
    numberOfInstance: number;
    onClick? : (circuitProps: CircuitMeshInputProps) => void;
    type: CIRCUIT_TYPE;

    mesh;

    constructor(circuit_mesh_input_props: CircuitMeshInputProps[], onClickEvent?: (pipelineProps: CircuitMeshInputProps) => void) {
        super();

        this.type = CIRCUIT_TYPE.PIPELINE;
        this.numberOfInstance = 0;
        this.circuit_mesh_input_props = circuit_mesh_input_props;
        this.onClick = onClickEvent;

        for (let i = 0; i < circuit_mesh_input_props.length; i++) {
            this.getNumberOfInstance(circuit_mesh_input_props[i]);
        }

        const cylinder = new CylinderGeometry(0.5, 0.5, 1, 50);
        const cylinder_material = new MeshPhongMaterial({ color: COLOR.WHITE });
        this.mesh = new InstancedMesh(cylinder, cylinder_material, this.numberOfInstance);

        this.numberOfInstance = 0;
    }

    protected renderSingleIntance(circuitProps: CircuitMeshInputProps) {
        if (circuitProps.type === this.type) {
            const pipelineProps = circuitProps as PipelineMeshInputProps;

            const index = this.numberOfInstance;
            const pipelines_mesh = this.mesh;
            const cylinder_matrix = new Matrix4();
            cylinder_matrix.makeRotationFromQuaternion(new Quaternion().setFromAxisAngle(pipelineProps.rotation_direction, pipelineProps.rotation_degree));
            cylinder_matrix.multiply(new Matrix4().makeTranslation(pipelineProps.position_x, pipelineProps.position_y, pipelineProps.position_z));
            cylinder_matrix.multiply(new Matrix4().makeScale(pipelineProps.radius, pipelineProps.height, pipelineProps.radius));

            pipelines_mesh.setMatrixAt(index, cylinder_matrix);
            pipelines_mesh.setColorAt(index, pipelineProps.isConnected ? COLOR.YELLOW : COLOR.GREY);

            pipelineProps.index = index;
            this.onClick && (pipelineProps.clickable = true);
            pipelineProps.onClickEvent = () => { this.onClick && this.onClick(pipelineProps) };
            this.numberOfInstance++;
        }

        const childs = circuitProps.child;
        if (childs) {
            for (const child of childs) {
                this.renderSingleIntance(child);
            }
        }
    }

}

export { PipelineMesh }; 