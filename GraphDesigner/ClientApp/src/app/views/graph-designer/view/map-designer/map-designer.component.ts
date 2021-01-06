import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as d3 from "d3";
import * as t from "topojson";
import { MapDesignerService } from '../../services/map-designer.service';

@Component({
  selector: 'app-map-designer',
  templateUrl: './map-designer.component.html',
  styleUrls: ['./map-designer.component.css']
})
export class MapDesignerComponent implements OnInit {

  projectId = 0;
  public width = 500;
  public height = 500;
  private g: any;
  private k = 1;
  private center = { x: 500 / 2, y: 500 / 2 };
  /** @summary 游標彈跳文字框 */
  public tooltip: any;
  public layers = [
    { name: "", mainTable: [], join: [] },
    { name: "", mainTable: [], join: [] },
    { name: "", mainTable: [], join: [] },
    { name: "", mainTable: [], join: [] },
  ];

  mainTopo: any;

  public schema = [
    {
      type: 'projection',
      name: 'Projection',
      attr: {
        longitude: 121.51,
        latitude: 25.07,
        scale: 12000,
        offsetX: 200,
        offsetY: 200,
      }
    },
    {
      type: 'rect',
      name: 'Background',
      attr: {
        backgroundColor: 'grey'
      }
    },
    {
      type: 'area',
      name: 'Area'
    },
    {
      type: 'bubble',
      name: 'Hospital'
    },
    {

    }
  ]

  constructor(
    private mapDesignerService: MapDesignerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.queryParamMap.get("ProjectId"));
    this.mapDesignerService.GetMap(this.projectId).subscribe(res => {
      this.mainTopo = res;
      // this.getSpicific("高雄市")
      this.tooltip = this.buildTooltip();
      let zoom = this.buildZoom();
      let svg = this.buildSvg(zoom);
      let projection = this.setProjection();
      let path = this.buildPath(projection);
      let rect = this.buildRect(svg);
      let area = this.buildArea(svg, path);
      let zoomBtn = this.buildZoomBtn();
    }, error => { });
  }

  getSpicific(name: string) {
    let newMap = JSON.parse(JSON.stringify(this.mainTopo));
    newMap.objects.towns.geometries = newMap.objects.towns.geometries.filter(x => x.properties.COUNTYNAME == name);
    newMap.objects.villages.geometries = newMap.objects.villages.geometries.filter(x => x.properties.COUNTYNAME == name);
    newMap.objects.counties.geometries = newMap.objects.counties.geometries.filter(x => x.properties.COUNTYNAME == name);
    console.log(JSON.stringify(newMap));
  }

  topoCoorX(d: any, path: any) {
    return path.centroid(d)[0];
  }
  topoCoorY(d: any, path: any) {
    return path.centroid(d)[1];
  }
  longLatCoorX(d: any, long: string, lat: string, projection: any) {
    return projection([d[long], d[lat]])[0];
  }
  longLatCoorY(d: any, long: string, lat: string, projection: any) {
    return projection([d[long], d[lat]])[1];
  }

  //#region  封裝
  /** @summary tooltip box */
  buildTooltip() {
    return d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");
  }

  /** @summary Svg */
  buildSvg(zoom: any) {
    return (
      d3
        .select("#geoMap")
        .append("svg")
        // .attrs({
        //   id: "svgmap",
        //   width: this.width,
        //   height: this.height
        // })
        .attr("id", "svgmap")
        .attr("viewBox", `0 0 500 350`)
        // .attr("width", this.width)
        // .attr("height", this.height)
        .style("position", "relative")
        .call(zoom)
    );
  }

  /** @summary 投影點(中心點) */
  setProjection() {
    let projectionConfig = this.schema.find(x => x.type == 'projection');
    return d3
      // .geoEqualEarth()
      .geoMercator()
      .center([projectionConfig.attr.longitude, projectionConfig.attr.latitude])
      .scale(projectionConfig.attr.scale)
      .translate([projectionConfig.attr.offsetX, projectionConfig.attr.offsetY]);
  }

  /** @summary 根據投影點轉換區域路徑 */
  buildPath(projection: any) {
    return d3.geoPath().projection(projection);
  }

  /** @summary svg底圖 */
  buildRect(svg) {
    let rectConfig = this.schema.find(x => x.type == 'rect');
    return svg
      .append("rect")
      // .attr("viewBox", `0 0 500 350`)
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("fill", rectConfig.attr.backgroundColor);
  }

  /** @summary Topojson 區域 */
  buildArea(svg, path) {
    this.g = svg.append("g");
    // d3.json("https://cdn.jsdelivr.net/npm/taiwan-atlas/villages-10t.json").then(
    //   (data: any) => {
    let data = this.mainTopo;
    this.g
      .selectAll("path")
      .data(t.feature(data, data.objects.towns).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", (d) => { return `${d.properties.TOWNID}` })
      .attr("stroke", "white")
      .attr("stroke-width", "0.25px")
      .on("mouseenter", (e, d) => {
        this.tooltip.style("opacity", 1);
      })
      .on("mousemove", (e, d) => {
        this.tooltip
          .html(d.properties.COUNTYNAME)
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY + 10 + "px");
        d3.select(`#${d.properties.TOWNID}`).attr("fill", "red");
      })
      .on("mouseleave", (e, d) => {
        this.tooltip.style("opacity", 0);
        d3.select(`#${d.properties.TOWNID}`).attr("fill", null);
      });

    this.g
      .selectAll("circle")
      .data(t.feature(data, data.objects.towns).features)
      .enter()
      .append("circle")
      .attr("cx", d => this.topoCoorX(d, path))
      .attr("cy", d => this.topoCoorY(d, path))
      .attr("r", '3')
      .attr("fill", "yellow")
      .attr("stroke", "grey")
      .attr("stroke-width", 0.5)
      .on("mouseenter", (e, d) => {
        this.tooltip.style("opacity", 1);
      })
      .on("mousemove", (e, d) => {
        this.tooltip
          .html(d.properties.COUNTYNAME + d.properties.TOWNNAME)
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY + 10 + "px");
      })
      .on("mouseleave", (e, d) => {
        this.tooltip.style("opacity", 0);
      })
      .on("click", (e, d) => {
        let x = this.topoCoorX(d, path);
        let y = this.topoCoorY(d, path);
        let k = 5;
        this.k = 5;
        this.center = { x: x, y: y };
        this.g
          .selectAll("path")
          .attr(
            "transform",
            `translate(${this.width / 2},${this.height /
            2}) scale(${k}) translate(${-x},${-y})`
          );
        this.g
          .selectAll("circle")
          .attr(
            "transform",
            `translate(${this.width / 2},${this.height /
            2}) scale(${k}) translate(${-x},${-y})`
          )
          .attr("r", (5 * 1.5) / k).attr("stroke-width", (0.5 * 1.5) / k);
      });
    // }
    // );
  }

  /** @summary svg 地圖拖曳、放大縮小 */
  buildZoom() {
    return d3
      .zoom()
      .scaleExtent([-10, 80])
      .on("zoom", event => {
        // console.log(event.transform);
        this.k = event.transform.k;
        this.center = { x: -event.transform.x, y: -event.transform.y };
        this.g.selectAll("path").attr("transform", event.transform);
        this.g
          .selectAll("circle")
          .attr("transform", event.transform)
          .attr("r", (3 + event.transform.k) / event.transform.k).attr("stroke-width", (0.5 * 1.5) / event.transform.k);
      });
  }

  /** @summary 縮放按鈕 */
  buildZoomBtn() {
    d3.select("#zoom_in").on("click", (e) => {
      if (this.k < 8) {
        this.k++;
        this.zoomCenter();
      }
    });
    d3.select("#zoom_out").on("click", (e) => {
      if (this.k >= 2) {
        this.k--;
        this.zoomCenter();
      }
      else {
        this.k = 1;
        this.zoomCenter();
      }
    });
    d3.select("#zoom_none").on("click", (e) => {
      this.k = 1;
      this.center = { x: this.width / 2, y: this.height / 2 };
      this.zoomCenter();
    });
  }
  zoomCenter() {
    this.g
      .selectAll("path")
      .attr(
        "transform",
        `translate(${this.width / 2},${this.height /
        2}) scale(${this.k}) translate(${-this.center.x},${-this.center.y})`
      );
    this.g
      .selectAll("circle")
      .attr(
        "transform",
        `translate(${this.width / 2},${this.height /
        2}) scale(${this.k}) translate(${-this.center.x},${-this.center.y})`
      )
      .attr("r", (5 * 1.5) / this.k).attr("stroke-width", (0.5 * 1.5) / this.k);
  }
  //#endregion 封裝
}
