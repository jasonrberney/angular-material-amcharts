import { Component, OnInit, NgZone, Input, Output, EventEmitter } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { CitiesService, City } from '../../services/cities.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-amcharts-globe',
  templateUrl: './amcharts-globe.component.html',
  styleUrls: ['./amcharts-globe.component.scss']
})
export class AmchartsGlobeComponent implements OnInit {
  private chart: am4maps.MapChart;

  locations: City[];

  @Output() countryClick = new EventEmitter();
  @Input() eventStream$;

  ngOnChanges(changes: AmchartsGlobeComponent) {
    console.log(changes.eventStream$.selectedCountry) ;
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }

  updateCountryText(input: string) {
    this.countryClick.emit(input);
  }

  constructor(private zone: NgZone, private citiesService: CitiesService) { }

  ngOnInit() {
    //this.getLocations()
  }

  // getLocations() {
  //   this.citiesService.get()
  //     .subscribe(data => {
  //       this.locations = data
  //     });
  // }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4maps.MapChart);

      // Set map definition
      chart.geodata = am4geodata_worldLow;
            
      // Set projection
      chart.projection = new am4maps.projections.Orthographic();
      chart.panBehavior = "rotateLongLat";
      chart.deltaLatitude = -20;
      chart.padding(20,20,20,20);
      
      // limits vertical rotation
      chart.adapter.add("deltaLatitude", function(delatLatitude){
          return am4core.math.fitToRange(delatLatitude, -90, 90);
      })
      
      // Create map polygon series
      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      
      // Make map load polygon (like country names) data from GeoJSON
      polygonSeries.useGeodata = true;
      
      // Configure series
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}";
      polygonTemplate.fill = chart.colors.getIndex(0).lighten(0.5);
      //polygonTemplate.stroke = am4core.color("#454a58");
      polygonTemplate.nonScalingStroke = true;
      polygonTemplate.strokeWidth = 0.5;
      
      let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
      graticuleSeries.mapLines.template.line.stroke = am4core.color("#ffffff");
      graticuleSeries.mapLines.template.line.strokeOpacity = 0.08;
      graticuleSeries.fitExtent = false;
      
      chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.1;
      chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#ffffff");
      
      // Create click (hit) functionality
      polygonTemplate.events.on("hit", (ev) => {
        // zoom to an object
        ev.target.series.chart.zoomToMapObject(ev.target);
       
        const ctx = ev.target.dataItem.dataContext as any;
        // get object info
        console.log(ctx.name);
        this.zone.run(() => this.updateCountryText(ctx.name));
      });

      // Create hover state and set alternative fill color
      let hs = polygonTemplate.states.create("hover");
      hs.properties.fill = chart.colors.getIndex(0).brighten(-0.5);

      //**********MAP POINTS*************/
      // Add line bullets
      let cities = chart.series.push(new am4maps.MapImageSeries());
      cities.mapImages.template.nonScaling = true;

      let city = cities.mapImages.template.createChild(am4core.Circle);
      city.radius = 6;
      city.fill = chart.colors.getIndex(0).brighten(-0.2);
      city.strokeWidth = 2;
      city.stroke = am4core.color("#fff");

      // Set property fields
      cities.mapImages.template.propertyFields.latitude = "latitude";
      cities.mapImages.template.propertyFields.longitude = "longitude";

      function addCity(coords, title) {
          let city = cities.mapImages.create();
          city.latitude = coords.latitude;
          city.longitude = coords.longitude;
          city.tooltipText = title;
          return city;
      }

      //**********MAP LINES*************/
      let animation;
      setTimeout(function(){
        animation = chart.animate({property:"deltaLongitude", to:100000}, 20000000);
      }, 3000)
      
      chart.seriesContainer.events.on("down", function(){
        if(animation){
          animation.stop();
        }
      })

      let citiesForLines = [];
      this.zone.run(() => this.citiesService.get()
        .subscribe(data => {
          this.locations = data
          //loadLines(data);
          data.forEach((location) => {
            let city = addCity({ "latitude": location.latitude, "longitude": location.longitude }, location.name);
            citiesForLines.push(city);
          });

          addLine(citiesForLines[0], citiesForLines[1]);
          addLine(citiesForLines[1], citiesForLines[2]);
        }));
      
      let lineSeries = chart.series.push(new am4maps.MapLineSeries());
      lineSeries.mapLines.template.line.strokeWidth = 3;
      lineSeries.mapLines.template.line.strokeOpacity = 0.7;
      lineSeries.mapLines.template.line.stroke = city.fill;
      lineSeries.mapLines.template.shortestDistance = true;
      //lineSeries.mapLines.template.line.nonScalingStroke = true;
      lineSeries.mapLines.template.line.strokeDasharray = "1,1";
      //lineSeries.zIndex = 10;

      // let shadowLineSeries = chart.series.push(new am4maps.MapLineSeries());
      // shadowLineSeries.mapLines.template.line.strokeOpacity = 0.5;
      // shadowLineSeries.mapLines.template.stroke = am4core.color("#e03e96");
      // // shadowLineSeries.mapLines.template.line.nonScalingStroke = true;
      // shadowLineSeries.mapLines.template.shortestDistance = true;
      // // shadowLineSeries.zIndex = 5;

      function addLine(from, to) {
        let line = lineSeries.mapLines.create();
        line.imagesToConnect = [from, to];
        //line.line.controlPointDistance = -0.3;

        // let shadowLine = shadowLineSeries.mapLines.create();
        // shadowLine.imagesToConnect = [from, to];

        return line;
      }

      let line = lineSeries.mapLines.create();
      line.id = "myline";
      line.setClassName();

      // const loadLines = (geoLines) => {
      //   if (line.multiGeoLine) {
      //     line.multiGeoLine = [[...geoLines, ...line.multiGeoLine[0]]];
      //   }
      //   else {
      //     line.multiGeoLine = [geoLines];
      //   }
      // }

      // Add plane
      var plane = lineSeries.mapLines.getIndex(0).lineObjects.create();
      plane.position = 0;
      plane.width = 48;
      plane.height = 48;

      plane.adapter.add("scale", function(scale, target) {
          return 0.5 * (1 - (Math.abs(0.5 - target.position)));
      })

      var planeImage = plane.createChild(am4core.Sprite);
      planeImage.scale = 0.16;
      planeImage.horizontalCenter = "middle";
      planeImage.verticalCenter = "middle";
      planeImage.path = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";
      planeImage.fill = chart.colors.getIndex(15).brighten(-0.2);
      planeImage.strokeOpacity = 0;

      // Plane animation
      var currentLine = 0;
      var direction = 1;
      function flyPlane() {

        // Get current line to attach plane to
        plane.mapLine = lineSeries.mapLines.getIndex(currentLine);
        plane.parent = lineSeries;

        // Set up animation
        var from, to;
        var numLines = lineSeries.mapLines.length;
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
        var animation = plane.animate({
            from: from,
            to: to,
            property: "position"
        }, 5000, am4core.ease.sinInOut);
        animation.events.on("animationended", flyPlane)

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
      flyPlane();
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
