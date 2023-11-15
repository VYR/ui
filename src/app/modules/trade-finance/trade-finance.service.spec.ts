import { TestBed } from '@angular/core/testing';

import { TradeFinanceService } from './trade-finance.service';

describe('TradeFinanceService', () => {
    let service: TradeFinanceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TradeFinanceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
