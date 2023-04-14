import { Vector3 } from 'three';

interface Information {
    name: string;
    value: string;
}


interface CircuitMeshInputProps {

    position_x: number;
    position_y: number;
    position_z: number;
    rotation_direction?: typeof Vector3;
    rotation_degree?: number;
    informations?: Information[];

}

export { CircuitMeshInputProps, Information};