import { CIRCUIT_TYPE } from '@constants';
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
    clickable?: boolean;
    onClickEvent?: () => void;
    child?: CircuitMeshInputProps[];
    type: CIRCUIT_TYPE;
    isConnected: boolean; //气体是否能到达此处
    index?: number;

}

export { CircuitMeshInputProps, Information};