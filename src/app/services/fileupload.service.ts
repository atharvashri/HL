import { FileUploader } from "../../../node_modules/ng2-file-upload";

export class FileUploadService{
  fileuploadurl: string = "http://localhost:8080/upload/";
  uploader: FileUploader;
  panno: string;
  constructor() {
    this.uploader = new FileUploader({
        url: this.fileuploadurl,
        authToken: localStorage.token,
        authTokenHeader: "x-auth-token",
        parametersBeforeFiles: true
      })
  }

  getFileUploader(){
    this.uploader.clearQueue();
    this.uploader.onAfterAddingFile = file => true;
    this.panno = null;
    return this.uploader;
  }

  setPanaNo(panno: string){
    this.panno = panno;
  }

  uploadfiles(fileQueue: Array<Object>){

    let filemap = new Map();
    let extraparams = {
      'panno': this.panno
    }
    this.uploader.queue.forEach((fileitem, idx) => {
      let filetype = fileQueue[idx]['name'];
        fileitem.url = this.fileuploadurl + filetype;
        fileitem.withCredentials = false;
        if(filetype === 'passbook'){
          extraparams["accountno"] = fileQueue[idx]['accountno'];
          // for passbook we need to add fileitem for each account hence can't add filetype direcly in map
          filemap.set(fileQueue[idx]['accountno'], fileitem);
        }else{
          if(filetype === 'rccopy'){
            extraparams["vehicleno"] = fileQueue[idx]['vehicleno'];
          }
          filemap.set(filetype, fileitem);
        }
        this.uploader.options.additionalParameter = extraparams;

    })
    filemap.forEach(fileitem => {
      if(!fileitem.isUploaded)
        this.uploader.uploadItem(fileitem);
    })
  }

  getFileNameForRC(filename: string, vehicleNo: string): string{
    if(filename){
      let ext = this.getFileExtension(filename);
      return `${this.panno}_${vehicleNo}`.toUpperCase() + ext;
    }else{
      return "";
    }
  }

  getFileNameForPan(filename: string): string{
    if(filename){
      let ext = this.getFileExtension(filename);
      return `${this.panno}`.toUpperCase() + ext;
    }else{
      return "";
    }
  }

  getFileNameForDeclaration(filename: string): string{
    if(filename){
      let ext = this.getFileExtension(filename);
      return `${this.panno}_declaration`.toUpperCase() + ext;
    }else{
      return "";
    }
  }

  getFileNameForPassbook(filename: string, accountno: string){
    if(filename){
      let ext = this.getFileExtension(filename);
      return `${this.panno}_${accountno}`.toUpperCase() + ext;
    }
  }

  getFileExtension(filename){
    return filename.substring(filename.lastIndexOf("."), filename.length);
  }


}
