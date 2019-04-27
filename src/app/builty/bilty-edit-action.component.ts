import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuiltyService } from '../services/builty.service';

@Component({
  selector: 'bilty-edit-icon',
  template: '<img class="link" src="/assets/img/edit-icon.png" width="20" id="{{currBilty.builtyNo}}_edit" height="20" (click)="clickHandler($event)" title="Edit">'
})
export class BiltyEditActionComponent{

  constructor(private router: Router, private biltyService: BuiltyService){

  }
  currBilty: any
  clickHandler(){
    this.biltyService.setBuiltyToUpdate(this.currBilty);
    this.router.navigate(['builty'], { queryParams: { update: 'true' } });
  }
}
