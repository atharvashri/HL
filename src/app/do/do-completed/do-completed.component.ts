import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AngularGridInstance, Column, GridOption, ExtensionName, AngularSlickgridComponent, AngularUtilService } from '../../../../node_modules/angular-slickgrid';
import { DOGridUtil } from '../do-grid.util';
import { DoService } from '../../services/do.service';
import { DOLinkActionComponent } from '../do-link-action.component';


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

@ViewChild('gridRef') gridComponent : ElementRef<AngularSlickgridComponent>;
  angularGrid: AngularGridInstance;
  allColumns: Column[];
  gridOptions: GridOption;
  dataset: any[];
  visibleColumns: Column[];

  ngOnInit() {
    this.visibleColumns = DOGridUtil.getVisibleColumnsForCompletedDO()
    this.visibleColumns[0].asyncPostRender = this.doLinkActionRenderer.bind(this)

    this.allColumns = DOGridUtil.getAllColumnsForDO()
    this.allColumns[0].asyncPostRender = this.doLinkActionRenderer.bind(this)

    this.gridOptions = {
      enableColumnReorder: false,
      enableAutoResize: true,
      //enableGridMenu: true,
      defaultColumnWidth: 100,
      enableAutoTooltip: true,
      enableAsyncPostRender: true,
      autoResize: {
        containerId: 'completed-do-container'
      },
      gridMenu: {
        // all titles optionally support translation keys, if you wish to use that feature then use the title properties finishing by 'Key'
        // example "customTitle" for a plain string OR "customTitleKey" to use a translation key
        customTitleKey: 'CUSTOM_COMMANDS',
        iconCssClass: 'fa fa-ellipsis-v',
        hideForceFitButton: true,
        hideSyncResizeButton: true,
        hideToggleFilterCommand: false, // show/hide internal custom commands
        menuWidth: 17,
        resizeOnShowHeaderRow: true,
        onCommand: (e, args) => {
          if (args.command === 'help') {
            alert('Please help!!!');
          }
        }
      }
    }

    this.doService.getCompletedDos().subscribe(
      (res) => {
        if(res.success){
          this.dataset = res.data;
        }
      }
    )
  }


  constructor(private doService: DoService, private angularUtilService: AngularUtilService) {

  }


  onGridReady(e){
    this.angularGrid = e;
    //this.angularGrid.slickGrid.setColumns(this.visibleColumns);
    if(this.gridComponent['grid']){
      this.gridComponent['grid'].setColumns(this.visibleColumns);
    }
  }

  toggleGridMenu(e) {
    if (this.angularGrid && this.angularGrid.extensionService) {
      const gridMenuInstance = this.angularGrid.extensionService.getSlickgridAddonInstance(ExtensionName.gridMenu);
      gridMenuInstance.showGridMenu(e);
    }
  }

  doLinkActionRenderer(cellNode: any, row: number, dataContext: any, columnDef: Column){
      const componentOutput = this.angularUtilService.createAngularComponent(DOLinkActionComponent)
      Object.assign(componentOutput.componentRef.instance, {currDO: dataContext, completedDO: true});
      setTimeout(() => (cellNode).empty().html(componentOutput.domElement));
  }

}
