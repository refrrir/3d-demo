import { Vector3 } from 'three';
import { CIRCUIT_TYPE } from "@constants";

const input: any[] = [
    {
        // 总管
        top_surface_center_position: new Vector3(-51, -6, -123),
        bottom_surface_center_position: new Vector3(-51, -3, -123),
        radius: 0.35,
        information: [
            { name: "ID", value: "001-E" },
            { name: "Type", value: "Gas" },
            { name: "Model", value: "DN120" },
            { name: "Presure", value: "3.1 Kpa" },
            { name: "Location", value: "outdoor" },
        ],
        type: CIRCUIT_TYPE.PIPELINE,
        child: [
            {
                // 入户阀
                center_position: new Vector3(-51, -3, -123),
                isValveOn: true,
                radius: 0.7,
                information: [
                    { name: "ID", value: "60-5-H" },
                    { name: "Name", value: "house valve" },
                    { name: "Location", value: "kitchen" },
                    { name: "Type", value: "solenoid valve" },
                    { name: "Model", value: "JKB-V1-DN80" },
                ],
                type: CIRCUIT_TYPE.VALVE,
                child: [
                    {
                        // 入户水平管
                        top_surface_center_position: new Vector3(-51, -3, -123),
                        bottom_surface_center_position: new Vector3(-51, -3, -103),
                        radius: 0.3,
                        information: [
                            { name: "ID", value: "91-P" },
                            { name: "Type", value: "Gas" },
                            { name: "Model", value: "DN50" },
                            { name: "Presure", value: "3.2 Kpa" },
                            { name: "Location", value: "kitchen" },
                        ],
                        type: CIRCUIT_TYPE.PIPELINE,
                        child: [
                            {
                                // 立管
                                top_surface_center_position: new Vector3(-51, 5.6, -103),
                                bottom_surface_center_position: new Vector3(-51, -3.1, -103),
                                radius: 0.3,
                                information: [
                                    { name: "ID", value: "987-65-P" },
                                    { name: "Type", value: "Gas" },
                                    { name: "Model", value: "DN80" },
                                    { name: "Presure", value: "3.3 Kpa" },
                                    { name: "Location", value: "kitchen" },
                                ],
                                type: CIRCUIT_TYPE.PIPELINE,
                                child: [
                                    {
                                        // 总阀
                                        center_position: new Vector3(-51, 5.6, -103),
                                        isValveOn: false,
                                        radius: 0.5,
                                        information: [
                                            { name: "ID", value: "99001-765-M" },
                                            { name: "Name", value: "main valve" },
                                            { name: "Location", value: "outdoor" },
                                            { name: "Type", value: "manual valve" },
                                            { name: "Model", value: "JKB-V2-DN120" },
                                        ],
                                        type: CIRCUIT_TYPE.VALVE,
                                        child: [
                                            {
                                                // 灶前水平管
                                                radius: 0.3,
                                                top_surface_center_position: new Vector3(-51, 5.6, -103),
                                                bottom_surface_center_position: new Vector3(-64.9, 5.6, -103),
                                                information: [
                                                    { name: "ID", value: "987-765-P" },
                                                    { name: "Type", value: "Gas" },
                                                    { name: "Model", value: "DN80" },
                                                    { name: "Presure", value: "3.4 Kpa" },
                                                    { name: "Location", value: "kitchen" },
                                                ],
                                                type: CIRCUIT_TYPE.PIPELINE,
                                            },
                                            {
                                                // 热水器立管
                                                top_surface_center_position: new Vector3(-55, 5.6, -103),
                                                bottom_surface_center_position: new Vector3(-55, 12.6, -103),
                                                radius: 0.3,
                                                height: 7,
                                                information: [
                                                    { name: "ID", value: "987-69-P" },
                                                    { name: "Type", value: "Gas" },
                                                    { name: "Model", value: "DN50" },
                                                    { name: "Presure", value: "3.5 Kpa" },
                                                    { name: "Location", value: "bathroom" },
                                                ],
                                                type: CIRCUIT_TYPE.PIPELINE,
                                                child: [
                                                    {
                                                        // 热水器阀
                                                        center_position: new Vector3(-55, 12.6, -103),
                                                        isValveOn: false,
                                                        radius: 0.5,
                                                        information: [
                                                            { name: "ID", value: "50-5-H" },
                                                            { name: "Name", value: "water heater valve" },
                                                            { name: "Location", value: "kitchen" },
                                                            { name: "Type", value: "solenoid valve" },
                                                            { name: "Model", value: "JKB-V1-DN50" },
                                                        ],
                                                        type: CIRCUIT_TYPE.VALVE,
                                                        child: [
                                                            {
                                                                // 热水器管
                                                                top_surface_center_position: new Vector3(-55, 12.6, -103),
                                                                bottom_surface_center_position: new Vector3(-55, 15.6, -103),
                                                                radius: 0.3,
                                                                information: [
                                                                    { name: "ID", value: "987-111-P" },
                                                                    { name: "Type", value: "Gas" },
                                                                    { name: "Model", value: "DN50" },
                                                                    { name: "Presure", value: "3.6 Kpa" },
                                                                    { name: "Location", value: "bathroom" },
                                                                ],
                                                                type: CIRCUIT_TYPE.PIPELINE,

                                                            }
                                                        ]
                                                    }
                                                ]
                                            }

                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
    },
]

export { input };