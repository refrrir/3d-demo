import { Vector3 } from 'three';
import { CircuitMeshInputProps } from "@models";

interface PipelineMeshInputProps extends CircuitMeshInputProps{

    radius: number;
    bottom_surface_center_position: typeof Vector3;
    top_surface_center_position: typeof Vector3;

}

export { PipelineMeshInputProps };