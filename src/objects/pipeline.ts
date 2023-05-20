import { InstancedMesh, Matrix4, CylinderGeometry, MeshPhongMaterial, Quaternion, Vector3 } from 'three';
import { CircuitMeshInputProps, PipelineMeshInputProps, TreeProps } from '@models';
import { CIRCUIT_TYPE, COLOR } from '@constants';
import { CircuitMesh } from './circuit';

class PipelineMesh extends CircuitMesh {

    circuit_mesh_input_props;
    numberOfInstance: number;
    onClick?: (circuitProps: CircuitMeshInputProps) => void;
    type: CIRCUIT_TYPE;
    tree_props: TreeProps[];

    mesh;

    constructor(circuit_mesh_input_props: CircuitMeshInputProps[], tree_props: TreeProps[], onClickEvent?: (pipelineProps: CircuitMeshInputProps) => void) {
        super();

        this.type = CIRCUIT_TYPE.PIPELINE;
        this.numberOfInstance = 0;
        this.circuit_mesh_input_props = circuit_mesh_input_props;
        this.tree_props = tree_props;
        this.onClick = onClickEvent;

        for (let i = 0; i < circuit_mesh_input_props.length; i++) {
            this.getNumberOfInstance(circuit_mesh_input_props[i]);
        }

        const cylinder = new CylinderGeometry(0.5, 0.5, 1, 50, 1, true);
        const cylinder_material = new MeshPhongMaterial({ color: COLOR.WHITE });
        this.mesh = new InstancedMesh(cylinder, cylinder_material, this.numberOfInstance);

        this.numberOfInstance = 0;
    }

    protected renderSingleIntance(circuitProps: CircuitMeshInputProps, treeIndex : number) {
        circuitProps.treeIndex = treeIndex;
        if (circuitProps.type === this.type) {
            const pipelineProps = circuitProps as PipelineMeshInputProps;
            const index = this.numberOfInstance;
            const pipelines_mesh = this.mesh;
            const top_center: typeof Vector3 = pipelineProps.top_surface_center_position;
            const bottom_center: typeof Vector3 = pipelineProps.bottom_surface_center_position;

            const midpoint = new Vector3((top_center.x + bottom_center.x) / 2, (top_center.y + bottom_center.y) / 2, (top_center.z + bottom_center.z) / 2);
            const align = new Vector3(top_center.x - bottom_center.x, top_center.y - bottom_center.y, top_center.z - bottom_center.z);
            const distance = top_center.distanceTo(bottom_center);

            const mat = new Matrix4();

            const cylinder_matrix = new Matrix4().identity();
            cylinder_matrix.multiply(mat.makeTranslation(midpoint.x, midpoint.y, midpoint.z));
            cylinder_matrix.multiply(mat.makeRotationFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), align.normalize())));
            cylinder_matrix.multiply(mat.makeScale(pipelineProps.radius, distance, pipelineProps.radius));

            pipelines_mesh.setMatrixAt(index, cylinder_matrix);
            pipelines_mesh.setColorAt(index, pipelineProps.isConnected ? this.tree_props[circuitProps.treeIndex].pipelineOnColor : COLOR.GREY);

            pipelineProps.index = index;
            this.onClick && (pipelineProps.clickable = true);
            pipelineProps.onClickEvent = () => { this.onClick && this.onClick(pipelineProps) };
            this.numberOfInstance++;
        }

        const childs = circuitProps.child;
        if (childs) {
            for (const child of childs) {
                this.renderSingleIntance(child, treeIndex);
            }
        }
    }

}

export { PipelineMesh }; 