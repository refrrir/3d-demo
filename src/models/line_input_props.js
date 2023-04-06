//考虑升级成tyescript项目
class LineMeshInputProps {
    position_x;
    position_y;
    position_z;
    rotation_direction;
    rotation_degree;
    constructor(position_x, position_y, position_z, rotation_direction, rotation_degree) {
        this.position_x = position_x;
        this.position_y = position_y;
        this.position_z = position_z;
        this.rotation_direction = rotation_direction;
        this.rotation_degree = rotation_degree;
    }
}

export { LineMeshInputProps };