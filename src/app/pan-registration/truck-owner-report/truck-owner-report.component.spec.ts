/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TruckOwnerReportComponent } from './truck-owner-report.component';

describe('TruckOwnerReportComponent', () => {
  let component: TruckOwnerReportComponent;
  let fixture: ComponentFixture<TruckOwnerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckOwnerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckOwnerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
