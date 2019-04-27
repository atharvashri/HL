import { Component } from '@angular/core';

@Component({
  selector: 'do-display-link',
  template: `<a [routerLink]="['/builtylist']" [queryParams]="{do: currDO.doDisplay, completedDO: completedDO}">{{currDO.doDisplay}}</a>`
})
export class DOLinkActionComponent{

  constructor(){

  }
  currDO: any
  completedDO: boolean
}
