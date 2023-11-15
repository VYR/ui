import { Injectable } from '@angular/core';

import { ConfigService } from '../configuration';
import { EncryptDecryptService } from '../utility/encrypt-decrypt.service';

@Injectable({
    providedIn: 'root',
})
export class InMemoryStorage {
    public cacheEcryption: boolean = false;
    public data: any = [];

    constructor(private encryptDecryptService: EncryptDecryptService, private configService: ConfigService) {
        this.cacheEcryption = this.configService.get('cacheEcryption');
    }
    /**
     * Check if In memory storage has an Item / exists with the give key
     * @param key the key of the Item
     */
    public has(key: string): boolean {
        return this.data.find((x: any) => x.key === key);
    }
    /**
     * Return item froM In Memory Storage based on the key
     * @param key the key of the Item
     */
    public get(key: string): any {
        let data = null;
        if (this.has(key)) {
            data = this.cacheEcryption ? this.encryptDecryptService.decrypt(this.data[key]) : this.data[key];
        }
        return JSON.parse(data);
    }

    /**
     * Set data based on key value pair
     * @param key the key of the Item
     * @param value - value to be stored in the key
     */
    public set(key: string, value: any): void {
        const data = this.cacheEcryption
            ? this.encryptDecryptService.encrypt(JSON.stringify(value))
            : JSON.stringify(value);
        this.data[key] = data;
    }
}
