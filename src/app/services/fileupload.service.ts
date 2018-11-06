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

  uploadfiles(fileQueue: Array<string>, vehicleno){

    let filemap = new Map();
    let extraparams = {
      'panno': this.panno
    }
    this.uploader.queue.forEach((fileitem, idx) => {
        fileitem.url = this.fileuploadurl + fileQueue[idx]
        if(fileQueue[idx] === 'rccopy'){
          extraparams["vehicleno"] = vehicleno;
        }
        this.uploader.options.additionalParameter = extraparams;
        filemap.set(fileQueue[idx], fileitem);

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

  getFileExtension(filename){
    return filename.substring(filename.lastIndexOf("."), filename.length);
  }


}
