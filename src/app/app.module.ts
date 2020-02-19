import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AmchartsGlobeComponent,
    AmchartsXychartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
