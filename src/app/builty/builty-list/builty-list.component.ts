import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BuiltyService } from '../../services/builty.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Observable } from '../../../../node_modules/rxjs';
import { AppUtil } from '../../utils/app.util';
import { BuiltyGridUtil } from '../builty-grid.util';
import { Column, AngularGridInstance, GridOption, AngularSlickgridComponent, ExtensionName, AngularUtilService } from 'angular-slickgrid';
import { BiltyEditActionComponent } from '../bilty-edit-action.component';
import { BiltyDeleteActionComponent } from '../bilty-delete-action.component';
import { AppConstants } from '../../utils/app.constants';

@Component({
  selector: 'app-builty-list',
  templateUrl: './builty-list.component.html',
  styleUrls: ['./builty-list.component.css']
})
export class BuiltyListComponent implements OnInit {

  builtylist: Array<any>;
  activebuilties: Array<any>;
  viewactive: boolean;
  userrole;
  @ViewChild('gridRef') gridComponent : ElementRef<AngularSlickgridComponent>;
  allColumns: Column[];
  gridOptions: GridOption;
  visibleColumns: Column[];
  doFilterCriteria: string;
  angularGrid: AngularGridInstance;
  grid: any
  dataView: any

  constructor(private builtyservice: BuiltyService, private toasterservice: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private angularUtilService: AngularUtilService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
          this.doFilterCriteria = params['do']
          //if completeDO param is true then only set viewActive to false else it should be true by default
          this.viewactive = params['completedDO'] && params['completedDO'] == "true" ? false : true
          if(this.viewactive){
            this.showActiveBuilties();
          }else{ // show completed builties
            this.showCompletedBuilties()
          }

          this.userrole = localStorage.getItem('currentRole');
          this.visibleColumns = BuiltyGridUtil.getVisibleColumnsForCompletedBilty()
          this.allColumns = BuiltyGridUtil.getAllColumnsForBilty()
          let actionColumns = []
          if(this.canedit()){
             actionColumns.push({ id: 'editBilty', excludeFromHeaderMenu: true, field: 'id', maxWidth: 30, asyncPostRender: this.biltyEditActionRenderer.bind(this)});
          }
          if(this.candelete()){
              actionColumns.push({ id: 'deleteBilty', excludeFromHeaderMenu: true, field: 'id', maxWidth: 30, asyncPostRender: this.biltyDeleteActionRenderer.bind(this)})
          }
          this.visibleColumns = this.visibleColumns.concat(actionColumns);
          this.allColumns = this.allColumns.concat(actionColumns);

          this.gridOptions = {
            enableColumnReorder: false,
            enableAutoResize: true,
            //enableGridMenu: true,
            enableColumnPicker: false,
            defaultColumnWidth: 100,
            enableAutoTooltip: true,
            enableAsyncPostRender: true,
            enableFiltering: true,
            autoResize: {
              containerId: 'bilty-list-container'
            },
            presets: {
              filters:[
                {columnId: 'doId', searchTerms:[this.doFilterCriteria ? this.doFilterCriteria : '']}
              ]
            },
            gridMenu: {
              // all titles optionally support translation keys, if you wish to use that feature then use the title properties finishing by 'Key'
              // example "customTitle" for a plain string OR "customTitleKey" to use a translation key
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
      }
    )
  }

  showupdateform(index){
    let _builty = this.builtylist[index];
    this.builtyservice.setbiltyToUpdate(_builty);
    this.router.navigate(['builty'], { queryParams: { update: 'true' } })
  }

  showActiveBuilties(){
    let _return = this.builtyservice.getActiveBuilties();
    if(_return instanceof Observable){
      _return.subscribe(
        (res) => {
          if(res.success){
              this.builtyservice.setActiveBuilties(res.data);
              this.builtylist = res.data;
          }else{
            this.toasterservice.error(res.message);
          }
        }
      );
    }else{
        this.builtylist = _return;
    }
    this.viewactive = true;
  }

  showCompletedBuilties(){
    this.builtyservice.getCompletedBuilties().subscribe(
      (res) => {
        if(res.success){
          this.builtylist = res.data;
        }else{
          this.toasterservice.error("Problem retireving completed builty list");
        }
      },
      (error) => {
        this.toasterservice.error("Internal server error!");
      }
    )
    this.viewactive = false;
  }

  showupdatereceiptform(){
    this.router.navigate(['builtyreceipt']);
  }

  deletebuilty(index){
    let _builty = this.builtylist[index];
    if(confirm("Are you sure to delete the builty " + _builty.biltyNo + "?")){
      this.builtyservice.deleteBuilty(_builty.id).subscribe(
        (res) => {
          if(res.success){
            this.toasterservice.success(res.message);
            this.builtylist.splice(index, 1);
          }else{
            this.toasterservice.error(res.message);
          }
        },
        () => {
          this.toasterservice.error("Internal server error!");
        }
      )
    }
  }

  canedit(){
    if(this.userrole === AppUtil.ROLE_ADMIN && this.viewactive){
      return true;
    }
    return false;
  }

  candelete(){
    if(this.viewactive){
      return true;
    }
    return false;
  }

  onGridReady(e){
    this.angularGrid = e;
    //this.angularGrid.slickGrid.setColumns(this.visibleColumns);
    if(this.gridComponent['grid']){
      this.gridComponent['grid'].setColumns(this.visibleColumns);
    }
    this.dataView = this.angularGrid.dataView;
    this.grid = this.angularGrid.slickGrid;

    this.dataView.getItemMetadata = this.updateRowBackGroundForFreightByDoOwner(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
  }

  updateRowBackGroundForFreightByDoOwner(previousItemMetadata: any){
    const doOwnerClass = 'freight-by-owner';
    const paymentInitiatedClass = 'payment-initiated';
    return (rowNumber: number) => {
      const item = this.dataView.getItem(rowNumber);
      let meta = {
        cssClasses: ''
      };
      if (typeof previousItemMetadata === 'object') {
        meta = previousItemMetadata(rowNumber);
      }

      if (meta && item) {
        if (item.freightToBePaidBy && item.freightToBePaidBy.toLowerCase() === AppConstants.DO_OWNER.toLowerCase()) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + doOwnerClass;
        }else if (item.paymentStatus && item.paymentStatus === 3){ // 3 means payment initiated
          meta.cssClasses = (meta.cssClasses || '') + ' ' + paymentInitiatedClass;
        }
      }
      return meta;
    };
  }

  toggleGridMenu(e) {
    if (this.angularGrid && this.angularGrid.extensionService) {
      const gridMenuInstance = this.angularGrid.extensionService.getSlickgridAddonInstance(ExtensionName.gridMenu);
      gridMenuInstance.showGridMenu(e);
    }
  }

  biltyEditActionRenderer(cellNode: any, row: number, dataContext: any, columnDef: Column){
    const componentOutput = this.angularUtilService.createAngularComponent(BiltyEditActionComponent)
    Object.assign(componentOutput.componentRef.instance, {currBilty: dataContext});
    setTimeout(() => (cellNode).empty().html(componentOutput.domElement));
  }

  biltyDeleteActionRenderer(cellNode: any, row: number, dataContext: any, columnDef: Column){
    if(this.viewactive){
      const componentOutput = this.angularUtilService.createAngularComponent(BiltyDeleteActionComponent)
      Object.assign(componentOutput.componentRef.instance, {currBilty: dataContext});
      columnDef.maxWidth = 30;
      setTimeout(() => (cellNode).empty().html(componentOutput.domElement));
    }else{
      columnDef.maxWidth = 0;
      setTimeout(() => (cellNode).empty().html(""));
    }
  }

}
