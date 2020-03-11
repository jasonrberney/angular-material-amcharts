import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CountryService } from './services/country.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CountryService]
})
export class AppComponent {

  constructor(private cs: CountryService) { }

  onChange(country) {
    this.cs.setCountry(country);
  }

  title = 'angular-material-amcharts';

  onCountryChanged(country) {
    console.log(country);
    this.update(country, 'selectCountry');

    // service
    this.onChange(country);
    console.log(this.cs.get());
  }

  // Observable - data management
  private state = new BehaviorSubject({
    selectedCountry: 'Spain'
  });
  public eventStream$ = this.state.asObservable()

  update(value, command) {
    let update = this.state.value;
    if (command === 'selectCountry') update.selectedCountry = value;
    this.state.next(update);
  }
}
