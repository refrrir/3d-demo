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
    
}