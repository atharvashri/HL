import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '.hl-checkbox label'
})
export class HlCheckboxDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick(){
    var className = this.el.nativeElement;
    console.log('ClassName: ' + className);
  }

}
