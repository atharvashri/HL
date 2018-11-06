export class CustomValidator{

  static panValidator(pan){

    const panregex = /(^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$)/;
    if(panregex.test(pan.value)){
      return null;
    }

    return{
      invalidpan: true
    }

  }

}
