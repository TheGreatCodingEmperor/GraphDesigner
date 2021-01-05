export interface IProjectEditUI {
    ProjectId: number,
    ProjectName: string,
    ProjectType: number,
    MainTableId: number,
    Design: string,
    ProjectDataIds: number[]
}
export class ProjectEditUI implements IProjectEditUI {
    ProjectId: number = 0;
    ProjectName: string = 'New Project';
    ProjectType: number = 0;
    MainTableId: number = 0;
    Design: string = null;
    ProjectDataIds: number[] = [];
}

export interface IProjectEditAPI {
    ProjectId: number,
    ProjectName: string,
    ProjectType: number,
    MainTableId: number,
    Design: string
}
export class ProjectEditAPI implements IProjectEditAPI {
    ProjectId: number = 0;
    ProjectName: string = '';
    ProjectType: number = 0;
    MainTableId: number = 0;
    Design: string = '';
}