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
      polygonTemplate.fill = am4core.color("#47c78a");
      polygonTemplate.stroke = am4core.color("#454a58");
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
      
      let animation;
      setTimeout(function(){
        //animation = chart.animate({property:"deltaLongitude", to:100000}, 20000000);

        loadLines([
          { "latitude": 48.856614, "longitude": 2.352222 },
          { "latitude": 40.712775, "longitude": -74.005973 },
          { "latitude": 49.282729, "longitude": -123.120738 }
        ]);
      }, 3000)
      
      chart.seriesContainer.events.on("down", function(){
        if(animation){
          animation.stop();
        }
      })

      this.zone.run(() => this.citiesService.get()
        .subscribe(data => {
          this.locations = data
          loadLines(data);
        }));
      
      let lineSeries = chart.series.push(new am4maps.MapLineSeries());
      lineSeries.mapLines.template.strokeWidth = 4;
      lineSeries.mapLines.template.stroke = am4core.color("#e03e96");
      lineSeries.mapLines.template.nonScalingStroke = true;

      let line = lineSeries.mapLines.create();
      line.id = "myline";
      line.setClassName();

      const loadLines = (geoLines) => {
        if (line.multiGeoLine) {
          line.multiGeoLine = [[...geoLines, ...line.multiGeoLine[0]]];
        }
        else {
          line.multiGeoLine = [geoLines];
        }
      }
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
