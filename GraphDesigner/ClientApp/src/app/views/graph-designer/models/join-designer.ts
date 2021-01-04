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