import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IProjectManagerListItem, ProjectManagerListItem } from '../../models/project-manager';
import { ProjectManagerService } from '../../services/project-manager.service';

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.css']
})
export class ProjectManagerComponent implements AfterViewInit {

  dataColumns: string[]=['ProjectName', 'ProjectType'];
  displayedColumns: string[] = ['ProjectName', 'ProjectType', 'React'];
  
  dataSource = new MatTableDataSource<IProjectManagerListItem>([]);

  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;

  constructor(
    private projectManagerService: ProjectManagerService
  ) { }

  ngAfterViewInit() {
    this.GetProjectList();
    this.dataSource.paginator = this.paginator;
  }

  GetProjectList(){
    this.projectManagerService.GetProjectList().subscribe((res:ProjectManagerListItem[])=>{
      this.dataSource = new MatTableDataSource<IProjectManagerListItem>(res);
    })
  }
}
