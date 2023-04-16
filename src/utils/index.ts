import { ValvePipelineRelationProps } from "@models";

export abstract class Utils {

    static findRelatedPipelines(valves_pipelines_relations: ValvePipelineRelationProps[], valveIndex: number): number {
        for (const relation of valves_pipelines_relations) {
            if (relation.valve_index === valveIndex) {
                return relation.pipeline_index;
            }
        }
        
        return -1;
    }
}