import { Injectable } from "@angular/core";

export interface IJqueryFlowchartHelper {
    /** @summary 新增 table */
    AddOperator(element: any, id: string | number, name: string, cx: number, cy: number, cols: string[]): any;
    /** @summary 刪除 table/line */
    Delete(element: any): any;
    /** @summary 取得 tableId */
    GetSelectedOperatorId(element: any): any;
    /** @summary 取得 當前 jquery flowchart 設計結果 */
    GetDatas(element: any): any;
    SetDatas(element:any,data:any): any;
}
@Injectable({
    providedIn: 'root'
})
export class JqueryFlochartHelper implements IJqueryFlowchartHelper {
    /** @summary 新增 table */
    AddOperator(element: any, id: string | number, name: string, cx: number, cy: number, cols: string[]) {
        console.log(cols);
        var operatorId = id;
        let inputs = {}
        let outputs = {};
        if (cols != null) {
            for (let col of cols) {
                inputs[`${col}_in`] = {};
                inputs[`${col}_in`]["label"] = col;
                outputs[`${col}_out`] = {};
                outputs[`${col}_out`]["label"] = col;
            }
        }
        var operatorData = {
            top: cy,
            left: cx,
            properties: {
                title: name,
                class: 'flowchart-operators',
                inputs: inputs,
                outputs: outputs
            }
        }
        // this.operatorI++;
        element.flowchart('createOperator', operatorId, operatorData);
    }
    /** @summary 取得 tableId */
    GetSelectedOperatorId(element: any) {
        return element.flowchart('getSelectedOperatorId');
    }
    /** @summary 刪除 table/line */
    Delete(element: any) {
        element.flowchart('deleteSelected');
    }
    /** @summary 取得 當前 jquery flowchart 設計結果 */
    GetDatas(element: any) {
        return element.flowchart('getData');
    }
    SetDatas(element,data:any) {
        console.log(data);
        if(data)
        element.flowchart('setData',data);
    }
}