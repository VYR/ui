import { TestBed } from '@angular/core/testing';

import { BankAdminGroupManagementService } from './bank-admin-group-management.service';

describe('BankAdminGroupManagementService', () => {
    let service: BankAdminGroupManagementService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BankAdminGroupManagementService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
