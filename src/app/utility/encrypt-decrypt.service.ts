import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptDecryptService {
    public encrypt(input: string): string {
        const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        const key = this.generateKey(salt);
        const encrypted = CryptoJS.AES.encrypt(input, key, {
            iv: CryptoJS.enc.Hex.parse(iv),
        });
        const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        const aesPassword = iv + '::' + salt + '::' + ciphertext;
        return btoa(aesPassword);
    }

    public decrypt(input: any): string {
        const config = atob(input).split('::');
        const key = this.generateKey(config[1]);
        const decrypted = CryptoJS.AES.decrypt(config[2], key, {
            iv: CryptoJS.enc.Hex.parse(config[0]),
        });
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    }

    public generateKey(salt: string) {
        return CryptoJS.PBKDF2('Q!bP@ssw0rdC!B', CryptoJS.enc.Hex.parse(salt), {
            keySize: 4,
            iterations: 1000,
        });
    }
}
