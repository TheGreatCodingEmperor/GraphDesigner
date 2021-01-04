export interface ISelectItem{
    label:string,
    value:any
}

export class SelectItem implements ISelectItem{
    label: string = '';
    value: any = null;
}