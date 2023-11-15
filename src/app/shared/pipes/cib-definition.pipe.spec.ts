import { CIBDefinition } from './cib-definition.pipe';

describe('CIBType', () => {
    it('create an instance', () => {
        const pipe = new CIBDefinition();
        expect(pipe).toBeTruthy();
    });
});
