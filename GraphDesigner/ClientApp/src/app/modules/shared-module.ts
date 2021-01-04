import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProgressSpinnerComponent } from "../components/progress-spinner/progress-spinner.component";
import { MaterialModule } from "./material-module";

@NgModule({
    declarations: [
        ProgressSpinnerComponent
    ],
    imports: [
        FormsModule,
        MaterialModule
    ],
    exports:[
        FormsModule,
        MaterialModule
    ],
    providers: [],
    entryComponents:[
        ProgressSpinnerComponent
    ]
  })
  export class SharedModule { }