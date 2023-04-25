import { CIRCUIT_TYPE } from "@constants";
import { CircuitMeshInputProps } from "@models";

abstract class CircuitMesh {

    abstract numberOfInstance: number;
    abstract onClick?: (circuitProps: CircuitMeshInputProps) => void;
    abstract type: CIRCUIT_TYPE;

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
}

export { CircuitMesh };