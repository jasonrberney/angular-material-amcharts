import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface Country {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})

export class AppHeaderComponent implements OnInit {
  //@Input() countryChange;
  @Output() countryChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

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
