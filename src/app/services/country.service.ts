import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CountryService {

  private bs = new BehaviorSubject('');
  public eventStream$ = this.bs.asObservable();

  constructor() {}

  public setCountry(country) {
    this.bs.next(country);
  }

  get() {
    return this.bs.value;
  }
}