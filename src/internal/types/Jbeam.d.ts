

interface Jbeam {
    information: JbeamInfoData;
    slotType: string;
    slots?: Array<JbeamChildSlotItem>;
    scaleDragCoef?: number;
    refNodes?: Array<Array<any>>;
    flexbodies?: Array<any>;
    nodes?: Array<any>;
    glowMap?: any;
    sounds?: any;
    camerasInternal?: Array<any>;
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