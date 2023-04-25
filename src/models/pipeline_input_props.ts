import { CircuitMeshInputProps } from "@models";

interface PipelineMeshInputProps extends CircuitMeshInputProps{

    radius: number;
    height: number;
    isPipelineConnected: boolean

}

export { PipelineMeshInputProps };