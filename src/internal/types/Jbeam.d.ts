interface JbeamCommonData {
    optArgs: any;
}

interface Jbeam {
    information: JbeamInfoData;
    slotType: string;
    slots?: Array<JbeamChildSlotItem>;
    scaleDragCoef?: number;
    refNodes?: Array<Array<string>>;
    flexbodies?: Array<JbeamFlexbodyItem>;
    nodes?: Array<JbeamNodeItem>;
    glowMap?: JbeamGlowMapData;
}

interface JbeamInfoData {
    name: string;
    value: string;
    authors: string;
}

// Item interfaces (children of array fields)
interface JbeamChildSlotItem extends JbeamCommonData {
    typeName: string;
    default: string;
    description: string;
}

interface JbeamNodeItem extends JbeamCommonData {
    id: string;
    x: number;
    y: number;
    z: number;
}

interface JbeamBeamItem extends JbeamCommonData {
    id1: string;
    id2: string;
}

interface JbeamFlexbodyItem{
    mesh: string;
    group: Array<string>;
    nonFlexMaterials?: Array<string> | string;
}

interface JbeamVaribles {
    // TODO: Add varibles data structure
}

interface JbeamGlowMapData {
    // TODO: Add glow map data structure
}
