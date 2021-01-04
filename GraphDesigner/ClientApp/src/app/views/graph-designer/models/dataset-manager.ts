export interface IDatasetListItem{
    DataSetId:number,
    DataType:number,
    DataSetName:string,
}
export class DatasetListItem implements IDatasetListItem{
    DataSetId: number = 0;
    DataType: number = 0;
    DataSetName: string = '';
}