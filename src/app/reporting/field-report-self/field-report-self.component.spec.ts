/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FieldReportSelfComponent } from './field-report-self.component';

describe('FieldReportSelfComponent', () => {
  let component: FieldReportSelfComponent;
  let fixture: ComponentFixture<FieldReportSelfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldReportSelfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldReportSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
