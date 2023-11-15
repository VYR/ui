import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient) {}

    public get(url: any, options: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(url, {
            params: options.params,
            headers: options.headers,
            responseType: options.responseType,
        });
    }

    public post(url: string, request: any, options: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(url, request, {
            params: options.params,
            headers: options.headers,
        });
    }

    public put(url: string, request: any, options: any): Observable<HttpResponse<any>> {
        return this.http.put<any>(url, request, {
            params: options.params,
            headers: options.headers,
        });
    }

    public delete(url: any, options: any): Observable<HttpResponse<any>> {
        return this.http.delete<any>(url, { params: options.params, headers: options.headers });
    }
    public getBinary(url: any, options: any): any {
        return this.http.get<any>(url, { params: options.params, responseType: options.responseType });
    }

    public uploadFile(url: string, formData: any, options: any) {
        return this.http.post<any>(url, formData, {
            params: options.params,
            headers: options.headers,
            reportProgress: true,
            observe: 'events',
        });
    }
}
