import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'do-edit-icon',
  template: '<img class="link" src="/assets/img/edit-icon.png" width="20" id="{{currDO.id}}" height="20" (click)="clickHandler($event)" title="Edit">'
})
export class DOEditActionComponent{

  constructor(private router: Router){

  }
  currDO: any
  clickHandler(data){
    this.router.navigate(['do'], { queryParams: { update: data.target.id } });
  }
}
