import { InstancedMesh, Matrix4, IcosahedronGeometry, MeshPhongMaterial } from 'three';
import { CircuitMeshInputProps, ValveMeshInputProps } from '@models';
import { CIRCUIT_TYPE, COLOR } from '@constants';
import { CircuitMesh } from './circuit';

class ValveMesh extends CircuitMesh{

    valve_mesh_input_props;
    valves_mesh;
    numberOfInstance: number;
    onClick? : (valveProps: CircuitMeshInputProps) => void;
    type: CIRCUIT_TYPE;

    constructor(valve_mesh_input_props: CircuitMeshInputProps[], onClickEvent?: (valveProps: CircuitMeshInputProps) => void) {
        super();
        const sphere = new IcosahedronGeometry(0.8, 3);
        const valves_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.numberOfInstance = 0;
        this.type = CIRCUIT_TYPE.VALVE;

        for (let i = 0; i < valve_mesh_input_props.length; i++) {
            this.getNumberOfInstance(valve_mesh_input_props[i]);
        }

        this.valve_mesh_input_props = valve_mesh_input_props;
        this.valves_mesh = new InstancedMesh(sphere, valves_material, this.numberOfInstance);
        this.onClick = onClickEvent;

        
        this.numberOfInstance = 0;
    }

    render() {
        this.numberOfInstance = 0;
        const valve_mesh_input_props = this.valve_mesh_input_props;
        const valves_mesh = this.valves_mesh;

        for (let i = 0; i < valve_mesh_input_props.length; i++) {
            this.renderSingleValve(valve_mesh_input_props[i]);
        }

        valves_mesh.castShadow = true;
        valves_mesh.userData.isVavleMesh = true;
        return valves_mesh;
    }

    private renderSingleValve(circuitProps: CircuitMeshInputProps) {
        if (circuitProps.type === CIRCUIT_TYPE.VALVE) {
            const valveProps = circuitProps as ValveMeshInputProps;

            const index = this.numberOfInstance;
            const valves_mesh = this.valves_mesh;
            const sphere_matrix = new Matrix4();
            // sphere_matrix.setPosition(valveProps.position_x, valveProps.position_y, valveProps.position_z);
            sphere_matrix.multiply(new Matrix4().makeTranslation(valveProps.position_x, valveProps.position_y, valveProps.position_z));
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
            valveProps.onClickEvent = () => this.onClick && this.onClick(valveProps);
            this.numberOfInstance++;
        }
        const childs = circuitProps.child;
        if (childs) {
            for (const child of childs) {
                this.renderSingleValve(child);
            }
        }
    }

    rerender() {
        this.render();
        this.valves_mesh.instanceColor.needsUpdate = true;
    }
}

export { ValveMesh }; 