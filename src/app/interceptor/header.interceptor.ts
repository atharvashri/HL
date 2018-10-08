import { Injectable } from '@angular/core'
import { HttpHandler, HttpRequest, HttpInterceptor, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        // let jsonReq: HttpRequest<any> = req.clone({
        //     setHeaders: { "content-type": "application/json","x-auth-token": localStorage.getItem('token')}
        // });
        req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ') })
        return next.handle(req);
    }
}