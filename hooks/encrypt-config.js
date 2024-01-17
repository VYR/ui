const fs = require('fs-extra');
const CryptoJS = require('crypto-js');

const encrypt = (input) => {
    const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    const key = generateKey(salt);
    const encrypted = CryptoJS.AES.encrypt(input, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
    });
    const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const aesPassword = iv + '::' + salt + '::' + ciphertext;
    return btoa(aesPassword);
};

const decrypt = (input) => {
    const config = atob(input).split('::');
    const key = generateKey(config[1]);
    const decrypted = CryptoJS.AES.decrypt(config[2], key, {
        iv: CryptoJS.enc.Hex.parse(config[0]),
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

const generateKey = (salt) => {
    return CryptoJS.PBKDF2('SGs@1243$#', CryptoJS.enc.Hex.parse(salt), {
        keySize: 4,
        iterations: 1000,
    });
};

function encryptConfigFiles(rootPth, dest) {
    fs.readdir(rootPth, (err, files) => {
        files.forEach((file, index) => {
            const rawdata = fs.readFileSync(rootPth + file);
            data = encrypt(JSON.stringify(JSON.parse(rawdata)));
            const encrypted = JSON.stringify({ data });
            fs.writeFileSync(dest + file, encrypted);
            console.info(`${file} has been encrypted!`);
        });
    });
}

module.exports = encryptConfigFiles;
