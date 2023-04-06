import { CircuitMeshInputProps } from "@models";

class ValveMeshInputProps extends CircuitMeshInputProps{
    
    isValveOn;

    constructor(position_x, position_y, position_z, rotation_direction, rotation_degree, isValveOn) {
        super(position_x, position_y, position_z, rotation_direction, rotation_degree);
        this.isValveOn = isValveOn;
    }
}

export { ValveMeshInputProps };