export interface IDataSetEditUI{
    DataSetId:number,
    DataType:number,
    DataSetName:string,
    CenterLatitude: number,
    CenterLongitude: number,
    Scale: number,
    Schema:string[]|object,
    Data:any[]|any
}
export class DataSetEditUI implements IDataSetEditUI{
    CenterLatitude: number = 0;
    CenterLongitude: number = 0;
    Scale: number = 0;
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
    CenterLatitude: number,
    CenterLongitude: number,
    Scale: number,
    Schema:string,
    Data:string
}
export class DataSetEditDB implements IDataSetEditDB{
    DataSetId: number = 0;
    DataType: number = 0;
    DataSetName: string = 'New DataSet';
    CenterLatitude: number = 0;
    CenterLongitude: number = 0;
    Scale: number = 0;
    Schema: string = '';
    Data: string = ''; 
}