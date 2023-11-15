import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigService } from '../configuration';
import { HttpService } from './http.service';
@Injectable({
    providedIn: 'root',
})
export class ServerInteractionService {
    constructor(private configService: ConfigService, private httpService: HttpService) {}

    public setTimeOut(): any {}

    public get<T>(
        operation: string,
        params?: HttpParams,
        pathVariables?: number | string | object,
        headers?: HttpHeaders | null,
        responseType?: string
    ): Observable<HttpResponse<any>> {
        this.setTimeOut();
        return this.httpService.get(this.prepareUrl(operation, pathVariables), {
            responseType,
            params,
            headers: this.prepareHeader(headers!, operation),
        });
    }
    public getBinary<T>(
        operation: string,
        params?: HttpParams,
        pathVariables?: number | string | object,
        responseType?: any
    ): Observable<HttpResponse<any>> {
        this.setTimeOut();
        return this.httpService.getBinary(this.prepareUrl(operation, pathVariables), {
            params,
            responseType,
        });
    }

    public post<T>(
        operation: string,
        body: any,
        pathVariables?: number | string | object,
        headers?: HttpHeaders | null,
        params?: HttpParams
    ): Observable<HttpResponse<any>> {
        this.setTimeOut();
        return this.httpService.post(this.prepareUrl(operation, pathVariables), body, {
            params,
            headers: this.prepareHeader(headers!, operation),
        });
    }

    public put<T>(
        operation: string,
        body: any,
        pathVariables?: number | string | object,
        headers?: HttpHeaders | null,
        params?: HttpParams
    ): Observable<HttpResponse<any>> {
        this.setTimeOut();
        return this.httpService.put(this.prepareUrl(operation, pathVariables), body, {
            params,
            headers: this.prepareHeader(headers!, operation),
        });
    }

    public delete<T>(
        operation: string,
        params: HttpParams | null = null,
        pathVariables?: number | string | object,
        headers?: HttpHeaders | null
    ): Observable<HttpResponse<any>> {
        this.setTimeOut();
        return this.httpService.delete(this.prepareUrl(operation, pathVariables), {
            params,
            headers: this.prepareHeader(headers!, operation),
        });
    }

    public uploadFile<T>(
        operation: string,
        formData: FormData,
        pathVariables?: number | string | object,
        headers?: HttpHeaders | null,
        params?: HttpParams
    ) {
        this.setTimeOut();
        return this.httpService.uploadFile(this.prepareUrl(operation, pathVariables), formData, {
            params,
            headers: this.prepareHeader(headers!, operation),
        });
    }

    private prepareUrl(operationName: any, pathVariables: number | string | object | null = null): any {
        const operationInfo = this.configService.getOperation(operationName);
        const baseUrl = this.configService.get('api')[operationInfo.baseUrl];
        return pathVariables == null
            ? `${baseUrl}${operationInfo.path}`
            : this.resolvePathVariables(`${baseUrl}${operationInfo.path}`, pathVariables);
    }

    private prepareHeader(headers: HttpHeaders | null, operation: string): any {
        if (headers) {
            return headers;
        }
        let httpHeaders: HttpHeaders = new HttpHeaders();
        const operationInfo = this.configService.getOperation(operation);
        if (operationInfo.fileUpload) return httpHeaders;
        if (operationInfo.html) return httpHeaders.append('responseType', 'text');
        return httpHeaders.set('Content-Type', 'application/json');
    }

    private resolvePathVariables(url: string, pathVariables: number | string | object | null = null): any {
        if (typeof pathVariables === 'number' || typeof pathVariables === 'string') {
            url = `${url}/${pathVariables}`;
        } else if (typeof pathVariables === 'object') {
            const keys = Object.keys(pathVariables!);
            keys.forEach((key) => {
                const reg = new RegExp(`{${key}}`, 'g');
                url = url.replace(reg, (pathVariables as any)[key]);
            });
        }
        return url;
    }
}
