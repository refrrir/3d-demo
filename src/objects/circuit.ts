import { CIRCUIT_TYPE } from "@constants";
import { CircuitMeshInputProps } from "@models";

abstract class CircuitMesh {

    abstract circuit_mesh_input_props: CircuitMeshInputProps[];
    abstract numberOfInstance: number;
    abstract onClick?: (circuitProps: CircuitMeshInputProps) => void;
    abstract type: CIRCUIT_TYPE;
    abstract mesh: any;

    protected getNumberOfInstance(circuitProps: CircuitMeshInputProps) {
        if (circuitProps.type === this.type) {
            this.numberOfInstance++;
        }
        const childs = circuitProps.child;
        if (childs) {
            for (const child of childs) {
                this.getNumberOfInstance(child);
            }
        }
    }

    protected render() {
        this.numberOfInstance = 0;
        const circuit_mesh_input_props = this.circuit_mesh_input_props;
        const mesh = this.mesh;

        for (let i = 0; i < circuit_mesh_input_props.length; i++) {
            this.renderSingleIntance(circuit_mesh_input_props[i]);
        }

        mesh.castShadow = true;
        this.type === CIRCUIT_TYPE.PIPELINE && (mesh.userData.isPipelineMesh = true);
        this.type === CIRCUIT_TYPE.VALVE && (mesh.userData.isValveMesh = true);

        return mesh;
    }

    protected rerender() {
        this.render();
        this.mesh.instanceColor.needsUpdate = true;
    }


    protected abstract renderSingleIntance(circuitProps: CircuitMeshInputProps) : void;
}

export { CircuitMesh };