import { Component, OnInit, NgZone } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-amcharts-map-miller',
  // animations: [
  //   trigger('openClose', [
  //     state('open', style({
  //       height: '200px',
  //       opacity: 1,
  //       backgroundColor: 'yellow'
  //     })),
  //     state('closed', style({
  //       height: '100px',
  //       opacity: 0.5,
  //       backgroundColor: 'green'
  //     })),
  //     transition('open => closed', [
  //       animate('1s')
  //     ]),
  //     transition('closed => open', [
  //       animate('0.5s')
  //     ]),
  //   ]),
  // ],
  templateUrl: './amcharts-map-miller.component.html',
  styleUrls: ['./amcharts-map-miller.component.scss']
})
export class AmchartsMapMillerComponent implements OnInit {
  isReady = true;

  constructor(private zone: NgZone) { }

  ngOnInit() {
  }

  toggleMapReady() {
    this.isReady = !this.isReady;
  }

  // ngAfterViewInit() {
  //   this.zone.runOutsideAngular(() => {
  //     // Create map instance
  //     var chart = am4core.create("chartdiv", am4maps.MapChart);

  //     // Set map definition
  //     chart.geodata = am4geodata_worldLow;

  //     // Set projection
  //     chart.projection = new am4maps.projections.Miller();

  //     // Create map polygon series
  //     var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  //     // Make map load polygon (like country names) data from GeoJSON
  //     polygonSeries.useGeodata = true;

  //     // Configure series
  //     var polygonTemplate = polygonSeries.mapPolygons.template;
  //     polygonTemplate.tooltipText = "{name}";
  //     polygonTemplate.fill = am4core.color("#74B266");

  //     // Remove Antarctica
  //     polygonSeries.exclude = ["AQ"];

  //     // Add some data
  //     polygonSeries.data = [{
  //       "id": "US",
  //       "name": "United States",
  //       "value": 100
  //     }, {
  //       "id": "FR",
  //       "name": "France",
  //       "value": 50
  //     }];

  //     chart.events.on("ready", (ev) => {
  //       console.log(ev);

  //       // Add line series
  //       var lineSeries = chart.series.push(new am4maps.MapLineSeries());
  //       lineSeries.mapLines.template.strokeWidth = 4;
  //       lineSeries.mapLines.template.stroke = am4core.color("#e03e96");
  //       lineSeries.mapLines.template.nonScalingStroke = true;

  //       var line = lineSeries.mapLines.create();
  //       line.multiGeoLine = [[
  //         { "latitude": 48.856614, "longitude": 2.352222 },
  //         { "latitude": 40.712775, "longitude": -74.005973 },
  //         { "latitude": 49.282729, "longitude": -123.120738 }
  //       ]];
  //       line.id = "myline";

  //       line.setClassName();

  //       this.zone.run(() => this.toggleMapReady());

  //     })
  //   })
  // }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // Create map instance
      let chart = am4core.create("chartdiv", am4maps.MapChart);
      chart.geodata = am4geodata_worldLow;
      chart.projection = new am4maps.projections.Miller();
      chart.homeZoomLevel = 2.5;
      chart.homeGeoPoint = {
          latitude: 38,
          longitude: -60
      };

      // Create map polygon series
      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;
      polygonSeries.mapPolygons.template.fill = chart.colors.getIndex(0).lighten(0.5);
      polygonSeries.mapPolygons.template.nonScalingStroke = true;
      polygonSeries.exclude = ["AQ"];

      // Add line bullets
      let cities = chart.series.push(new am4maps.MapImageSeries());
      cities.mapImages.template.nonScaling = true;

      let city = cities.mapImages.template.createChild(am4core.Circle);
      city.radius = 6;
      city.fill = chart.colors.getIndex(0).brighten(-0.2);
      city.strokeWidth = 2;
      city.stroke = am4core.color("#fff");

      function addCity(coords, title) {
          let city = cities.mapImages.create();
          city.latitude = coords.latitude;
          city.longitude = coords.longitude;
          city.tooltipText = title;
          return city;
      }

      let paris = addCity({ "latitude": 48.8567, "longitude": 2.3510 }, "Paris");
      let toronto = addCity({ "latitude": 43.8163, "longitude": -79.4287 }, "Toronto");
      let la = addCity({ "latitude": 34.3, "longitude": -118.15 }, "Los Angeles");
      let havana = addCity({ "latitude": 23, "longitude": -82 }, "Havana");

      // Add lines
      let lineSeries = chart.series.push(new am4maps.MapArcSeries());
      lineSeries.mapLines.template.line.strokeWidth = 2;
      lineSeries.mapLines.template.line.strokeOpacity = 0.5;
      lineSeries.mapLines.template.line.stroke = city.fill;
      lineSeries.mapLines.template.line.nonScalingStroke = true;
      lineSeries.mapLines.template.line.strokeDasharray = "1,1";
      lineSeries.zIndex = 10;

      let shadowLineSeries = chart.series.push(new am4maps.MapLineSeries());
      shadowLineSeries.mapLines.template.line.strokeOpacity = 0;
      shadowLineSeries.mapLines.template.line.nonScalingStroke = true;
      shadowLineSeries.mapLines.template.shortestDistance = false;
      shadowLineSeries.zIndex = 5;

      function addLine(from, to) {
          let line = lineSeries.mapLines.create();
          line.imagesToConnect = [from, to];
          line.line.controlPointDistance = -0.3;

          let shadowLine = shadowLineSeries.mapLines.create();
          shadowLine.imagesToConnect = [from, to];

          return line;
      }

      addLine(paris, toronto);
      addLine(toronto, la);
      addLine(la, havana);

      // Add plane
      let plane = lineSeries.mapLines.getIndex(0).lineObjects.create();
      plane.position = 0;
      plane.width = 48;
      plane.height = 48;

      plane.adapter.add("scale", function(scale, target) {
          return 0.5 * (1 - (Math.abs(0.5 - target.position)));
      })

      let planeImage = plane.createChild(am4core.Sprite);
      planeImage.scale = 0.08;
      planeImage.horizontalCenter = "middle";
      planeImage.verticalCenter = "middle";
      planeImage.path = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";
      planeImage.fill = chart.colors.getIndex(2).brighten(-0.2);
      planeImage.strokeOpacity = 0;

      let shadowPlane = shadowLineSeries.mapLines.getIndex(0).lineObjects.create();
      shadowPlane.position = 0;
      shadowPlane.width = 48;
      shadowPlane.height = 48;

      let shadowPlaneImage = shadowPlane.createChild(am4core.Sprite);
      shadowPlaneImage.scale = 0.05;
      shadowPlaneImage.horizontalCenter = "middle";
      shadowPlaneImage.verticalCenter = "middle";
      shadowPlaneImage.path = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";
      shadowPlaneImage.fill = am4core.color("#000");
      shadowPlaneImage.strokeOpacity = 0;

      shadowPlane.adapter.add("scale", function(scale, target) {
          target.opacity = (0.6 - (Math.abs(0.5 - target.position)));
          return 0.5 - 0.3 * (1 - (Math.abs(0.5 - target.position)));
      })

      // Plane animation
      let currentLine = 0;
      let direction = 1;
      function flyPlane() {

          // Get current line to attach plane to
          plane.mapLine = lineSeries.mapLines.getIndex(currentLine);
          plane.parent = lineSeries;
          shadowPlane.mapLine = shadowLineSeries.mapLines.getIndex(currentLine);
          shadowPlane.parent = shadowLineSeries;
          shadowPlaneImage.rotation = planeImage.rotation;

          // Set up animation
          let from, to;
          let numLines = lineSeries.mapLines.length;
          if (direction == 1) {
              from = 0
              to = 1;
              if (planeImage.rotation != 0) {
                  planeImage.animate({ to: 0, property: "rotation" }, 1000).events.on("animationended", flyPlane);
                  return;
              }
          }
          else {
              from = 1;
              to = 0;
              if (planeImage.rotation != 180) {
                  planeImage.animate({ to: 180, property: "rotation" }, 1000).events.on("animationended", flyPlane);
                  return;
              }
          }

          // Start the animation
          let animation = plane.animate({
              from: from,
              to: to,
              property: "position"
          }, 5000, am4core.ease.sinInOut);
          animation.events.on("animationended", flyPlane)
          /*animation.events.on("animationprogress", function(ev) {
            let progress = Math.abs(ev.progress - 0.5);
            //console.log(progress);
            //planeImage.scale += 0.2;
          });*/

          shadowPlane.animate({
              from: from,
              to: to,
              property: "position"
          }, 5000, am4core.ease.sinInOut);

          // Increment line, or reverse the direction
          currentLine += direction;
          if (currentLine < 0) {
              currentLine = 0;
              direction = 1;
          }
          else if ((currentLine + 1) > numLines) {
              currentLine = numLines - 1;
              direction = -1;
          }

      }

      // Go!
      flyPlane();

    })
  }

}
