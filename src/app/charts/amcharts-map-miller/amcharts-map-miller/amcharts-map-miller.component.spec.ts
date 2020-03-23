import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartsMapMillerComponent } from './amcharts-map-miller.component';

describe('AmchartsMapMillerComponent', () => {
  let component: AmchartsMapMillerComponent;
  let fixture: ComponentFixture<AmchartsMapMillerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmchartsMapMillerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmchartsMapMillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
