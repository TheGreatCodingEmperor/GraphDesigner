export class ProjectManagerListItem implements IProjectManagerListItem{
    ProjectId:number = 0;
    ProjectName: string = '';
    ProjectType: number = 0;
}
export interface IProjectManagerListItem{
    ProjectId:number;
    ProjectName:string;
    ProjectType:number;
}