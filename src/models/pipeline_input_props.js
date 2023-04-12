import { CircuitMeshInputProps } from "@models";

class PipelineMeshInputProps extends CircuitMeshInputProps{
    radius;
    height;
    constructor(position_x, position_y, position_z, rotation_direction, rotation_degree, radius, height) {
        super(position_x, position_y, position_z, rotation_direction, rotation_degree);
        this.radius = radius;
        this.height = height;
    }
}

export { PipelineMeshInputProps };