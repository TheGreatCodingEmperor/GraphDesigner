export interface IDataSetEditUI{
    DataSetId:number,
    DataType:number,
    DataSetName:string,
    Schema:string[]|object,
    Data:any[]|any
}
export class DataSetEditUI implements IDataSetEditUI{
    DataSetId: number = 0;
    DataType: number = 0;
    DataSetName: string = 'New DataSet';
    Schema: string[]|object = [];
    Data: any[] = []; 
}

export interface IDataSetEditDB{
    DataSetId:number,
    DataType:number,
    DataSetName:string,
    Schema:string,
    Data:string
}
export class DataSetEditDB implements IDataSetEditDB{
    DataSetId: number = 0;
    DataType: number = 0;
    DataSetName: string = 'New DataSet';
    Schema: string = '';
    Data: string = ''; 
}