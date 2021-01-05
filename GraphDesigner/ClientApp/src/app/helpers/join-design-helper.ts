import { Injectable } from "@angular/core";
import { JoinDesignLine, JoinDesignTable } from "../views/graph-designer/models/join-designer";

@Injectable({
    providedIn: 'root'
})
export class JoinDesignHelper {
    ConvertFlowChart2APIClass(datas) {
        let lines: any[] = [];
        let tables: { tableId: number, top: number, left: number }[] = [];
        let linksIds = Object.keys(datas.links);
        for (let line of linksIds) {
            let tmp: any = {};
            // tmp.MapId = this.mapId;
            tmp.fromTableId = Number(datas.links[line as string].fromOperator);
            tmp.fromColName = datas.links[line as string].fromConnector.split('_')[0];
            tmp.toTableId = Number(datas.links[line as string].toOperator);
            tmp.toColName = datas.links[line as string].toConnector.split('_')[0];
            lines.push(tmp);
        }
        let operatorIds = Object(datas.operators);
        for (let table in operatorIds) {
            tables.push({
                tableId: Number(table),
                left: datas.operators[table as string].left,
                top: datas.operators[table as string].top
            })
        }
        console.log({ lines: lines, tables: tables })
        return { lines: lines, tables: tables };
    }
    ConvertAPIClass2FlowChart(lines:JoinDesignLine[], joinTables:JoinDesignTable[]){
    let links = [];
    for (let line of lines) {
        links.push({
            fromConnector: `${line.FromColName}_out`,
            fromOperator: line.FromTableId,
            fromSubConnector: 0,
            toConnector: `${line.ToColName}_in`,
            toOperator: line.ToTableId
        })
    }
    let tables = {};
    for (let table of joinTables) {
        var inputs = {};
        var outputs = {};
        console.log(table.Schema);
        for (let col of table.Schema) {
            inputs[`${col}_in`] = {};
            inputs[`${col}_in`]["label"] = col;
            outputs[`${col}_out`] = {};
            outputs[`${col}_out`]["label"] = col;
        }
        tables[table.TableId] = {
            left: table.Left,
            top: table.Top,
            properties: {
                title: table.Name,
                class: "flowchart-operators",
                inputs: inputs,
                outputs: outputs
            }
        };
    }
    console.log({ links: links, operatorTypes: {}, operators: tables });
    return { links: links, operatorTypes: {}, operators: tables };
}
}