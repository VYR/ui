import { Injectable } from '@angular/core';

import { ConfigService } from '../configuration';
import { EncryptDecryptService } from '../utility/encrypt-decrypt.service';

@Injectable({
    providedIn: 'root',
})
export class SessionStorage {
    public cacheEcryption: boolean = false;

    constructor(private encryptDecryptService: EncryptDecryptService, private configService: ConfigService) {
        this.cacheEcryption = this.configService.get('cacheEcryption');
    }
    /**
     * Return true if the Browser supports sessionStorage
     */
    public isSupported(): boolean {
        return typeof sessionStorage !== 'undefined';
    }

    /**
     * Check if sessionStorage has an Item / exists with the give key
     * @param key the key of the Item
     */
    public has(key: string): boolean {
        return sessionStorage.getItem(key) !== null;
    }

    /**
     * Return item from sessionStorage based on the key
     * @param key the key of the Item
     */
    public get(key: string): any {
        let data: any = null;
        if (!!sessionStorage.getItem(key)) {
            data = this.cacheEcryption
                ? this.encryptDecryptService.decrypt(sessionStorage.getItem(key)!)
                : sessionStorage.getItem(key);
        }
        return JSON.parse(data);
    }
    /**
     * Set data based on key value pair
     * @param key the key of the Item
     * @param value - value to set
     */
    public set(key: string, value: any): void {
        const data = this.cacheEcryption
            ? this.encryptDecryptService.encrypt(JSON.stringify(value))
            : JSON.stringify(value);
        sessionStorage.setItem(key, data);
    }
    /**
     * Delete item from sessionStorage based on the key
     * @param key the key of the Item
     */
    public remove(key: string): void {
        sessionStorage.removeItem(key);
    }

    /**
     * Clear all items from sessionStorage
     */
    public clear(): void {
        sessionStorage.clear();
    }
}
