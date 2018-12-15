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

  static mobileValidator(number){
    const mobileregex = /^(?!0)\d{10}$/;
    if(mobileregex.test(number.value) || (number.value !== 0 && !number.value)){
      return null;
    }
    return{
      invalidmobile: true
    }
  }

static ifsccodeValidator(code){
  const ifscregex = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
  console.log('ifsc code validator triggered for ' + code.value);
  console.log(ifscregex.test(code.value) || (code.value !== 0 && !code.value));
  if(ifscregex.test(code.value) || (code.value !== 0 && !code.value)){
    return null;
  }
  return{
    invalidIfsc: true
  }
}
}
