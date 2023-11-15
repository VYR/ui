import { Injectable } from '@angular/core';

import { ConfigService } from '../configuration';
import { EncryptDecryptService } from '../utility/encrypt-decrypt.service';

@Injectable({
    providedIn: 'root',
})
export class LocalStorage {
    public cacheEcryption: boolean = false;

    constructor(private encryptDecryptService: EncryptDecryptService, private configService: ConfigService) {
        this.cacheEcryption = this.configService.get('cacheEcryption');
    }

    /**
     * return true if the Browser supports localStorage
     */
    public isSupported(): boolean {
        try {
            const item = localStorage.getItem('');
            localStorage.removeItem('');
            localStorage.setItem('', item!);
            if (item === null) {
                localStorage.removeItem('');
            } else {
                localStorage.setItem('', item);
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Check if localStorage has an Item / exists with the give key
     * @param key the key of the Item
     */
    public has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Return item from local storage based on the key
     * @param key the key of the Item
     */
    public get(key: string): any {
        let data = null;
        if (!!localStorage['has'](key)) {
            data = this.cacheEcryption
                ? this.encryptDecryptService.decrypt(localStorage.getItem(key)!)
                : localStorage.getItem(key);
        }
        return JSON.parse(data!);
    }

    /**
     * Set data based on key value pair
     * @param key the key of the Item
     * @param value - to be stored.
     */
    public set(key: string, value: any): void {
        const data = this.cacheEcryption
            ? this.encryptDecryptService.encrypt(JSON.stringify(value))
            : JSON.stringify(value);
        localStorage.setItem(key, data);
    }

    /**
     * Delete item from local storage based on the key
     * @param key the key of the Item
     */
    public remove(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Clear all items from local storage
     */
    public clear(): void {
        localStorage.clear();
    }
}
