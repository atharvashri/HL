/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DoRunningComponent } from './do-running.component';

describe('DoRunningComponent', () => {
  let component: DoRunningComponent;
  let fixture: ComponentFixture<DoRunningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoRunningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
