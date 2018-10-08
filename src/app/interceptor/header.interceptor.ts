import { Injectable } from '@angular/core'
import { HttpHandler, HttpRequest, HttpInterceptor, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let jsonReq: HttpRequest<any> = req.clone({
            setHeaders: { 'content-type': 'application/json','token':localStorage.getItem('token')}
        });

        return next.handle(jsonReq);
    }
}