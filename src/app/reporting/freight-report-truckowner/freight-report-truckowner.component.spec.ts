/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FreightReportTruckownerComponent } from './freight-report-truckowner.component';

describe('FreightReportTruckownerComponent', () => {
  let component: FreightReportTruckownerComponent;
  let fixture: ComponentFixture<FreightReportTruckownerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightReportTruckownerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightReportTruckownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
