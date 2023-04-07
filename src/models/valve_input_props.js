import { CircuitMeshInputProps } from "@models";

class ValveMeshInputProps extends CircuitMeshInputProps{
    
    isValveOn;
    radius;

    constructor(position_x, position_y, position_z, rotation_direction, rotation_degree, isValveOn, radius) {
        super(position_x, position_y, position_z, rotation_direction, rotation_degree);
        this.isValveOn = isValveOn;
        this.radius = radius;
    }
}

export { ValveMeshInputProps };