import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-country-display',
  templateUrl: './country-display.component.html',
  styleUrls: ['./country-display.component.scss']
})
export class CountryDisplayComponent implements OnInit {
  @Input() countryName;

  ngOnChanges(changes: CountryDisplayComponent) {

    console.log(changes.countryName.currentValue) ;
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }

  constructor() { }

  ngOnInit() {
  }

}
