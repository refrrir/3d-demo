import { LineMeshInputProps } from "@models";

class SwitchMeshInputProps extends LineMeshInputProps{
    
    isSwitchOn;

    constructor(position_x, position_y, position_z, rotation_direction, rotation_degree, isSwitchOn) {
        super(position_x, position_y, position_z, rotation_direction, rotation_degree);
        this.isSwitchOn = isSwitchOn;
    }
}

export { SwitchMeshInputProps };