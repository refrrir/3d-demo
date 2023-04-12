import { CircuitMeshInputProps } from "@models";

interface ValveMeshInputProps extends CircuitMeshInputProps{
    
    isValveOn: number;
    radius: number;

}

export { ValveMeshInputProps };