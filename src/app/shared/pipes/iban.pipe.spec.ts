import { Iban } from './iban.pipe';

describe('Iban', () => {
    it('create an instance', () => {
        const pipe = new Iban();
        expect(pipe).toBeTruthy();
    });
});
