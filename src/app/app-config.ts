export class AppConfig {

  // endpoint for localhost.
  public static API_ENDPOINT='http://localhost:8080';
  public static AWS_S3_BUCKET = 'https://s3.ap-south-1.amazonaws.com/dev-hindustanlogistics-pan-data/';

  // aws host
  //public static API_ENDPOINT = 'http://13.234.84.53:8080';

  //heroku host
  //public static API_ENDPOINT = 'https://hl-web.herokuapp.com';
  public static MIN_DIFF_WITH_FREIGHT = 4000;

  public static EXTRA_RECEIVED_QUANTITY_LIMIT = 2;
}
