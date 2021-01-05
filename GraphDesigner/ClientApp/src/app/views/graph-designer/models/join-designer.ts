export interface IJoinTableSelectOption{
    TableId:number,
    TableName:string,
    Schema: string []
}
export class JoinTableSelectOption implements IJoinTableSelectOption{
    TableId: number = 0;
    TableName: string = '';
    Schema: string[] = [];
}

export interface ILayerMainTableOptions{
    TableId:number,
    TableName:string,
    DataType:number,
    Schema:string[]|object
}

export class LayerMainTableOptions implements ILayerMainTableOptions{
    TableId: number = 0;
    TableName: string = '';
    DataType: number = 0;
    Schema: object | string[] = [];
}

export interface ILayer{
    LayerId:number,
    LayerName:string,
    ProjectId:number,
    MainTableId:number,
    ObjectType:string,
    PkColName:string,
    LongitudeColName:string,
    LatitudeColName:string,
    JoinPkName:string,
    JoinPkTableId:number
}



export class Layer implements ILayer{
    LayerId: number = 0;
    LayerName: string = "New Layer";
    ProjectId: number = 0;
    MainTableId: number = null;
    ObjectType: string = null;
    PkColName: string = null;
    LongitudeColName: string = null;
    LatitudeColName: string = null;
    JoinPkName: string = null;
    JoinPkTableId: number = null;
    Design: any = null;
}

export class JoinDesignTable{
    TableId:number = 0;
    Name:string = '';
    Schema:string[] = [];
    LayerId:number = 0;
    Top:number =0;
    Left:number = 0;
}

export class JoinDesignLine{
    FromTableId:number = 0;
    ToTableId:number = 0;
    FromColName:string ='';
    ToColName:string = '';
    LayerId:number = 0;
}

export interface IJoinDesignLayer{
    Layer: Layer,
    Tables: JoinDesignTable[],
    Lines: JoinDesignLine[]
}

export class JoinDesignLayer implements IJoinDesignLayer{
    Layer: Layer = new Layer;
    Tables: JoinDesignTable[] = [];
    Lines: JoinDesignLine[] = [];
}