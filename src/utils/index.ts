import { CIRCUIT_TYPE } from "@constants";
import { CircuitMeshInputProps, PipelineMeshInputProps, ValveMeshInputProps, ValvePipelineRelationProps } from "@models";

export abstract class Utils {

    static connectFromHere(circuitPropsArray: CircuitMeshInputProps[]) {
        for (const circuitProps of circuitPropsArray) {
            if (circuitProps.type === CIRCUIT_TYPE.VALVE) {
                const valveProps = circuitProps as ValveMeshInputProps;
                valveProps.isConnected = true;
                if (valveProps.child) {
                    if (valveProps.isValveOn) {
                        Utils.connectFromHere(valveProps.child);
                    }else{
                        Utils.disconnectFromHere(valveProps.child);
                    }
                }
            } else if (circuitProps.type === CIRCUIT_TYPE.PIPELINE) {
                const pipelineProps = circuitProps as PipelineMeshInputProps;
                pipelineProps.isConnected = true;
                pipelineProps.child && Utils.connectFromHere(pipelineProps.child);
            }
        }
    }

    static disconnectFromHere(circuitPropsArray: CircuitMeshInputProps[]) {
        for (const circuitProps of circuitPropsArray) {
            if (circuitProps.type === CIRCUIT_TYPE.VALVE) {
                const valveProps = circuitProps as ValveMeshInputProps;
                valveProps.isConnected = false;
                if (valveProps.isValveOn && valveProps.child) {
                    Utils.disconnectFromHere(valveProps.child);
                }
            } else if (circuitProps.type === CIRCUIT_TYPE.PIPELINE) {
                const pipelineProps = circuitProps as PipelineMeshInputProps;
                pipelineProps.isConnected = false;
                pipelineProps.child && Utils.disconnectFromHere(pipelineProps.child);
            }
        }
    }

    static findByIndex(index: number, circuit_mesh_input_props: CircuitMeshInputProps[], type: CIRCUIT_TYPE): CircuitMeshInputProps | null {
        for (let i = 0; i < circuit_mesh_input_props.length; i++) {
            if (circuit_mesh_input_props[i].type === type && circuit_mesh_input_props[i].index === index) {
                return circuit_mesh_input_props[i];
            } else {
                const childs = circuit_mesh_input_props[i].child;
                if (childs && !!this.findByIndex(index, childs, type)) {
                    return this.findByIndex(index, childs, type);
                }
            }
        }
        return null;
    }
}