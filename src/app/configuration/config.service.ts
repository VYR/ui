import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { EncryptDecryptService } from '../utility/encrypt-decrypt.service';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private env: any = new Object();
    private config: any = new Object();
    private operations: any = new Object();
    private countries: any = new Array();
    constructor(private http: HttpClient, private crypto: EncryptDecryptService) {}

    /**
     * Loads the enviroment variable first
     * based on the enviroment variable selected, load the config file.
     * config file Env - development or production
     */
    public load(): any {
        return new Promise((resolve) => {
            return this.http
                .get('config/env.json')
                .pipe(retry(3), catchError(this.handleError))
                .subscribe((envData: any) => {
                    const enviroment: any = this.crypto.decrypt(envData.data);
                    this.http
                        .get(`config/${enviroment.env}.json`)
                        .pipe(retry(3), catchError(this.handleError))
                        .subscribe((res: any) => {
                            this.config = this.crypto.decrypt(res.data);
                            this.http
                                .get(`config/operations.json`)
                                .pipe(retry(3), catchError(this.handleError))
                                .subscribe((response: any) => {
                                    this.operations = this.crypto.decrypt(response.data);
                                    resolve(true);
                                });
                        });
                });
        });
    }

    /**
     * Return environment variable baysed on the key
     * @param key - env type key
     */
    public getCountry(code: any): any {
        const index = this.countries.findIndex((x: any) => x.code === code);
        if (index !== -1) {
            return this.countries[index];
        } else {
            return null;
        }
    }

    /**
     * Return environment variable baysed on the key
     * @param key - env type key
     */
    public getEnv(key: any): any {
        return this.env[key];
    }

    /**
     * Returns Operation based on the key
     * @param key - Operation key to retrieve it value.
     */
    public getOperation(key: any): any {
        return this.operations[key];
    }

    /**
     * Returns config value based on the key
     * @param key - config key to retrieve it value.
     */
    public get(key: any): any {
        return this.config[key];
    }

    /**
     * Handles error
     * @param error - http error response
     */
    private handleError(error: HttpErrorResponse): any {
        return throwError(error);
    }
}
