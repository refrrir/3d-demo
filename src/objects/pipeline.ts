import { InstancedMesh, Matrix4, CylinderGeometry, MeshPhongMaterial, Quaternion } from 'three';
import { CircuitMeshInputProps, PipelineMeshInputProps } from '@models';
import { CIRCUIT_TYPE, COLOR } from '@constants';
import { CircuitMesh } from './circuit';

class PipelineMesh extends CircuitMesh{

    pipeline_mesh_input_props;
    pipelines_mesh;
    numberOfInstance: number;
    onClick? : (circuitProps: CircuitMeshInputProps) => void;
    type: CIRCUIT_TYPE;

    constructor(pipeline_mesh_input_props: CircuitMeshInputProps[], onClickEvent?: (pipelineProps: CircuitMeshInputProps) => void) {
        super();
        const cylinder = new CylinderGeometry(0.5, 0.5, 1, 50);
        const cylinder_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.numberOfInstance = 0;
        this.type = CIRCUIT_TYPE.PIPELINE;

        for (let i = 0; i < pipeline_mesh_input_props.length; i++) {
            this.getNumberOfInstance(pipeline_mesh_input_props[i]);
        }

        this.pipeline_mesh_input_props = pipeline_mesh_input_props;
        this.pipelines_mesh = new InstancedMesh(cylinder, cylinder_material, this.numberOfInstance);
        this.onClick = onClickEvent;
        this.numberOfInstance = 0;
    }

    render() {
        this.numberOfInstance = 0;
        const pipeline_mesh_input_props = this.pipeline_mesh_input_props;
        const pipelines_mesh = this.pipelines_mesh;

        for (let i = 0; i < pipeline_mesh_input_props.length; i++) {
            this.renderSinglePipeline(pipeline_mesh_input_props[i]);
        }

        pipelines_mesh.castShadow = true;
        pipelines_mesh.userData.isPipelineMesh = true;

        return pipelines_mesh;
    }

    private renderSinglePipeline(circuitProps: CircuitMeshInputProps) {
        if (circuitProps.type === this.type) {
            const pipelineProps = circuitProps as PipelineMeshInputProps;

            const index = this.numberOfInstance;
            const pipelines_mesh = this.pipelines_mesh;
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
                this.renderSinglePipeline(child);
            }
        }
    }

    rerender() {
        this.render();
        this.pipelines_mesh.instanceColor.needsUpdate = true;
    }
}

export { PipelineMesh }; 