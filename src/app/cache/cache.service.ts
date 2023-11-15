import { Injectable } from '@angular/core';

import { ConfigService } from '../configuration';
import { InMemoryStorage } from './inMemoryStorage';
import { LocalStorage } from './localStorage';
import { SessionStorage } from './sessionStorage';
@Injectable()
export class CacheService {
    public static CacheOptions: any = {
        LocalStorage: 'localStorage',
        SessionStorage: 'sessionStorage',
        InMemory: 'inMemory',
    };
    private cacheProvider: any = null;

    constructor(
        private localStorage: LocalStorage,
        private sessionStorage: SessionStorage,
        private inMemoryStorage: InMemoryStorage,
        private configService: ConfigService
    ) {
        this.cacheProvider = this.configService.get('caheProvider');
    }

    public isSupported(provider: string): boolean {
        let ret: boolean;
        switch (provider) {
            case CacheService.CacheOptions.LocalStorage:
                ret = this.localStorage.isSupported();
                break;
            case CacheService.CacheOptions.SessionStorage:
                ret = this.sessionStorage.isSupported();
                break;
            default:
                ret = this.sessionStorage.isSupported();
        }
        return ret;
    }

    /**
     * Check if provider has an Item / exists with the give key
     * @param key the key of the Item
     */
    public has(key: string): boolean {
        let ret: boolean;
        switch (this.cacheProvider) {
            case CacheService.CacheOptions.LocalStorage:
                ret = this.localStorage.has(key);
                break;
            case CacheService.CacheOptions.SessionStorage:
                ret = this.sessionStorage.has(key);
                break;
            case CacheService.CacheOptions.InMemory:
                ret = this.inMemoryStorage.has(key);
                break;
            default:
                ret = this.sessionStorage.has(key);
        }
        return ret;
    }

    /**
     * Set data based on key value pair
     * @param key the key of the Item
     */
    public get(key: string): any {
        let ret: any = null;
        switch (this.cacheProvider) {
            case CacheService.CacheOptions.LocalStorage:
                ret = this.localStorage.get(key);
                break;
            case CacheService.CacheOptions.SessionStorage:
                ret = this.sessionStorage.get(key);
                break;
            case CacheService.CacheOptions.InMemory:
                ret = this.inMemoryStorage.get(key);
                break;
            default:
                ret = this.sessionStorage.get(key);
        }
        return ret;
    }

    /**
     * Set data based on key value pair
     * @param key the key of the Item
     * @param value - value of the key to be stored.
     */
    public set(key: string, value: any, provider: any = null): boolean {
        let ret;
        if (provider !== null && this.isSupported(provider)) {
            ret = true;
            this._set(key, value, provider);
        } else {
            if (this.isSupported(this.cacheProvider)) {
                ret = true;
                this._set(key, value, this.cacheProvider);
            } else {
                ret = false;
            }
        }
        return ret;
    }

    /**
     * Delete item from the provider based on the key
     * @param key the key of the Item
     * @param Optional - CacheOptions
     */
    public remove(key: string, provider: any = null): void {
        if (provider == null) {
            this._remove(key, this.cacheProvider);
        } else {
            this._remove(key, provider);
        }
    }

    /**
     * Clear all items from providers
     * @param Optional - CacheOptions
     */
    public clear(provider: any = null): void {
        if (provider == null) {
            this.localStorage.clear();
            this.sessionStorage.clear();
            this.sessionStorage.clear();
        } else {
            switch (provider) {
                case CacheService.CacheOptions.LocalStorage:
                    this.localStorage.clear();
                    break;
                case CacheService.CacheOptions.SessionStorage:
                    this.sessionStorage.clear();
                    break;
                default:
                    this.sessionStorage.clear();
            }
        }
    }

    private _set(key: string, value: any, provider: string): void {
        switch (provider) {
            case CacheService.CacheOptions.LocalStorage:
                this.localStorage.set(key, value);
                break;
            case CacheService.CacheOptions.SessionStorage:
                this.sessionStorage.set(key, value);
                break;
            case CacheService.CacheOptions.InMemory:
                this.inMemoryStorage.set(key, value);
                break;
            default:
                this.sessionStorage.set(key, value);
        }
    }

    private _remove(key: string, provider: string): void {
        switch (provider) {
            case CacheService.CacheOptions.LocalStorage:
                this.localStorage.remove(key);
                break;
            case CacheService.CacheOptions.SessionStorage:
                this.sessionStorage.remove(key);
                break;
            default:
                this.sessionStorage.remove(key);
        }
    }
}
