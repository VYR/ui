import { SGSDefinition } from './sgs-definition.pipe';

describe('SGSType', () => {
    it('create an instance', () => {
        const pipe = new SGSDefinition();
        expect(pipe).toBeTruthy();
    });
});
