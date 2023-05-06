import { Vector3 } from 'three';
import { CircuitMeshInputProps } from "@models";

interface ValveMeshInputProps extends CircuitMeshInputProps{
    
    isValveOn: number;
    radius: number;
    center_position: typeof Vector3;

}

export { ValveMeshInputProps };