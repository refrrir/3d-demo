import { CIRCUIT_TYPE } from '@constants';

interface Information {
    name: string;
    value: string;
}


interface CircuitMeshInputProps {

    informations?: Information[];
    clickable?: boolean;
    onClickEvent?: () => void;
    child?: CircuitMeshInputProps[];
    type: CIRCUIT_TYPE;
    isConnected: boolean; //气体是否能到达此处
    index?: number;

}

export { CircuitMeshInputProps, Information};