import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

interface Country {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  providers: []
})

export class AppHeaderComponent implements OnInit {

  @Output() countryChange = new EventEmitter();

  constructor() {

  }

  ngOnInit() {

  }

  countryNamesArr: Array<string> = am4geodata_worldLow.features.map((feature: any) => feature.properties.name).sort();

  onCountrySelectionChange(value) {
    console.log(value);
    this.countryChange.emit(value);
  }

  countries: Country[] = [
    {value: 'united-states', viewValue: 'United States'},
    {value: 'spain', viewValue: 'Spain'},
    {value: 'south-africa', viewValue: 'South Africa'}
  ]

}
