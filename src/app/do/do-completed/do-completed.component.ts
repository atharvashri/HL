import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ModalComponent} from '../../modal/modal.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

  
export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-do-completed',
  templateUrl: './do-completed.component.html',
  styleUrls: ['./do-completed.component.css'],
  providers: [NgbModalConfig, NgbModal]
  
})
export class DoCompletedComponent implements OnInit {

  animal: string;
  name: string;

  ngOnInit() {
  }


  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content) {
    this.modalService.open(content);
  }

}
