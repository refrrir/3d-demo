import { InstancedMesh, Matrix4, IcosahedronGeometry, MeshPhongMaterial, Vector3 } from 'three';
import { CircuitMeshInputProps, TreeProps, ValveMeshInputProps } from '@models';
import { CIRCUIT_TYPE, COLOR } from '@constants';
import { CircuitMesh } from './circuit';

class ValveMesh extends CircuitMesh {

    circuit_mesh_input_props;
    numberOfInstance: number;
    onClick?: (valveProps: CircuitMeshInputProps) => void;
    type: CIRCUIT_TYPE;
    tree_props: TreeProps[];

    mesh;

    constructor(circuit_mesh_input_props: CircuitMeshInputProps[], tree_props: TreeProps[], onClickEvent?: (valveProps: CircuitMeshInputProps) => void) {
        super();

        this.type = CIRCUIT_TYPE.VALVE;
        this.numberOfInstance = 0;
        this.circuit_mesh_input_props = circuit_mesh_input_props;
        this.tree_props = tree_props;
        this.onClick = onClickEvent;

        for (let i = 0; i < circuit_mesh_input_props.length; i++) {
            this.getNumberOfInstance(circuit_mesh_input_props[i]);
        }

        const sphere = new IcosahedronGeometry(0.8, 3);
        const valves_material = new MeshPhongMaterial({ color: COLOR.WHITE });
        this.mesh = new InstancedMesh(sphere, valves_material, this.numberOfInstance);

        this.numberOfInstance = 0;
    }

    protected renderSingleIntance(circuitProps: CircuitMeshInputProps, treeIndex : number) {
        circuitProps.treeIndex = treeIndex;
        if (circuitProps.type === CIRCUIT_TYPE.VALVE) {
            const valveProps = circuitProps as ValveMeshInputProps;
            const center: typeof Vector3 = valveProps.center_position;

            const index = this.numberOfInstance;
            const valves_mesh = this.mesh;
            const sphere_matrix = new Matrix4();
            sphere_matrix.multiply(new Matrix4().makeTranslation(center.x, center.y, center.z));
            sphere_matrix.multiply(new Matrix4().makeScale(valveProps.radius, valveProps.radius, valveProps.radius));

            valves_mesh.setMatrixAt(index, sphere_matrix);
            valves_mesh.setColorAt(
                index,
                valveProps.isValveOn
                    ? COLOR.WHITE
                    : COLOR.RED
            );

            valveProps.index = index;
            this.onClick && (valveProps.clickable = true);
            valveProps.onClickEvent = () => { this.onClick && this.onClick(valveProps) };
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

export { ValveMesh }; 