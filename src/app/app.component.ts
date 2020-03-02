import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-material-amcharts';

  countryName: string = 'China';

  onCountryChanged(country) {
    console.log(country);
    this.countryName = country;
  }
}
