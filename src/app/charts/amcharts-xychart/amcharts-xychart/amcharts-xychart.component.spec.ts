import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartsXychartComponent } from './amcharts-xychart.component';

describe('AmchartsXychartComponent', () => {
  let component: AmchartsXychartComponent;
  let fixture: ComponentFixture<AmchartsXychartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmchartsXychartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmchartsXychartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
