import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartsGlobeComponent } from './amcharts-globe.component';

describe('AmchartsGlobeComponent', () => {
  let component: AmchartsGlobeComponent;
  let fixture: ComponentFixture<AmchartsGlobeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmchartsGlobeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmchartsGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
