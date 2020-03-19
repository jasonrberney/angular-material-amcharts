import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppHeaderComponent } from './app-header/app-header/app-header.component';
import { AmchartsGlobeComponent } from './charts/amcharts-globe/amcharts-globe.component';
import { AmchartsXychartComponent } from './charts/amcharts-xychart/amcharts-xychart/amcharts-xychart.component';
import { CountryDisplayComponent } from './country-display/country-display/country-display.component';

import { CountryService } from './services/country.service';
import { CitiesService } from './services/cities.service';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AmchartsGlobeComponent,
    AmchartsXychartComponent,
    CountryDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [
    CountryService,
    CitiesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
