import { InstancedMesh, Matrix4, IcosahedronGeometry, MeshPhongMaterial } from 'three';
import { ValveMeshInputProps } from '@models';
import { COLOR } from '@constants';

class ValveMesh {

    valve_mesh_input_props;
    valves_mesh

    constructor(valve_mesh_input_props: ValveMeshInputProps[]) {
        const sphere = new IcosahedronGeometry(0.8, 3);
        const valves_material = new MeshPhongMaterial({ color: COLOR.WHITE });

        this.valve_mesh_input_props = valve_mesh_input_props;
        this.valves_mesh = new InstancedMesh(sphere, valves_material, valve_mesh_input_props.length);
    }

    render() {
        const valve_mesh_input_props = this.valve_mesh_input_props;
        const valves_mesh = this.valves_mesh;
        for (let i = 0; i < valve_mesh_input_props.length; i++) {
            const sphere_matrix = new Matrix4();
            sphere_matrix.setPosition(valve_mesh_input_props[i].position_x, valve_mesh_input_props[i].position_y, valve_mesh_input_props[i].position_z);
            sphere_matrix.multiply(new Matrix4().makeScale(valve_mesh_input_props[i].radius, valve_mesh_input_props[i].radius, valve_mesh_input_props[i].radius));
            valves_mesh.setMatrixAt(i, sphere_matrix);
            valves_mesh.setColorAt(
                i,
                valve_mesh_input_props[i].isValveOn
                    ? COLOR.RED
                    : COLOR.WHITE
            );
        }

        valves_mesh.castShadow = true;
        valves_mesh.userData.clickable = true;
        return valves_mesh;
    }

    rerender(){
        this.render();
        this.valves_mesh.instanceColor.needsUpdate = true;
    }
}

export { ValveMesh }; 