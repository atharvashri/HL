import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { AppConfig } from '../../../app-config';
import { AngularSlickgridComponent, AngularGridInstance, Column, GridOption, ExtensionName, AngularUtilService } from 'angular-slickgrid';
import { DOGridUtil } from '../../do-grid.util';
import { DOEditActionComponent } from '../../do-edit-action.component';
import { DOLinkActionComponent } from '../../do-link-action.component';

export interface RunningDo {
    doId: number;
    collaryName: string;
    quantity: number;
    areaDoNo: number;
    bspDoNo: number;
}

@Component({
    selector: 'app-do-running-list',
    templateUrl: './do-running-list.component.html',
    styleUrls: ['do-running-list.component.css']
})

export class DoRunningListComponent implements OnInit {

  isrunningDoTablevisible: boolean = false;
  s3url: string;
  @Input() activeDoProperties: any
  @Input() activeDoList: any

  @ViewChild('gridRef') gridComponent : ElementRef<AngularSlickgridComponent>;
    angularGrid: AngularGridInstance;
    allColumns: Column[];
    gridOptions: GridOption;
    visibleColumns: Column[];

    ngOnInit() {

      let actionColumns = [
        { id: 'editDO', excludeFromHeaderMenu: true, field: 'id', maxWidth: 30, asyncPostRender: this.doEditActionRenderer.bind(this)},
        { id: 'doCopy', excludeFromHeaderMenu: true, field: 'id', maxWidth: 30, formatter: this.doCopyFormatter.bind(this)},
      ]
      //get common list of columns from grid util
      this.visibleColumns = DOGridUtil.getVisibleColumnsForCompletedDO()
      //concat action columns to visibleColeumn
      this.visibleColumns = this.visibleColumns.concat(actionColumns)
      //add async renderer to first column which is do display
      this.visibleColumns[0].asyncPostRender = this.doLinkActionRenderer.bind(this)
      // get all columns from hrid util
      this.allColumns = DOGridUtil.getAllColumnsForDO()
      //add action columns to all columns as well
      //else action columns will be disappeared if columns selection is chnaged via grid menu
      this.allColumns = this.allColumns.concat(actionColumns)
      //add async renderer to first column which is do display
      this.allColumns[0].asyncPostRender = this.doLinkActionRenderer.bind(this)
      this.gridOptions = {
        enableColumnReorder: false,
        enableAutoResize: true,
        enableAsyncPostRender: true,
        //enableGridMenu: true,
        enableColumnPicker: false,
        defaultColumnWidth: 100,
        enableAutoTooltip: true,
        autoResize: {
          containerId: 'running-do-container'
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

      // this.doService.getActiveDos().subscribe(
      //   (res) => {
      //     if(res.success){
      //       this.dataset = res.data;
      //     }
      //   }
      // )
      this.s3url = AppConfig.AWS_S3_BUCKET;
    }

    constructor(private router: Router, private angularUtilService: AngularUtilService) { }

    onUpdateDO(evt) {
        this.router.navigate(['do'], { queryParams: { update: evt.target.id } });
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

    doEditActionRenderer(cellNode: any, row: number, dataContext: any, columnDef: Column){
        const componentOutput = this.angularUtilService.createAngularComponent(DOEditActionComponent)
        Object.assign(componentOutput.componentRef.instance, {currDO: dataContext});
        setTimeout(() => (cellNode).empty().html(componentOutput.domElement));
    }

    doLinkActionRenderer(cellNode: any, row: number, dataContext: any, columnDef: Column){
        const componentOutput = this.angularUtilService.createAngularComponent(DOLinkActionComponent)
        Object.assign(componentOutput.componentRef.instance, {currDO: dataContext, completedDO: false});
        setTimeout(() => (cellNode).empty().html(componentOutput.domElement));
    }

    doCopyFormatter(row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any): string{

      //<a *ngIf="activeDO.doCopy" target="_blank" [href]="s3url+activeDO.doCopy"><img src="/assets/img/img_icon.png" width="20" height="20" title="View DO Copy"/></a>
      if(dataContext && dataContext.doCopy){
        return `<a target="_blank" href="${this.s3url}${dataContext.doCopy}"><img src="/assets/img/img_icon.png" width="20" height="20" title="View DO Copy"/></a>`
      }
      return ''
    }
}
