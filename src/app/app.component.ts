import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-material-amcharts';

  onCountryChanged(country) {
    console.log(country);
    this.update(country, 'selectCountry');
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
