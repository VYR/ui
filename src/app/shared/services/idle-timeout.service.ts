import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, interval, map, Observable, takeWhile } from 'rxjs';
import { CacheService } from 'src/app/cache/cache.service';
import { ConfigService } from 'src/app/configuration';
import { ApplicationContextService } from './application-context.service';
const STORE_KEY = 'userLastAction';

@Injectable()
export class IdleTimeoutService {
    public static runTimer: boolean;
    public static runSecondTimer: boolean;
    public USER_IDLE_TIMER_VALUE_IN_MIN!: number;
    public FINAL_LEVEL_TIMER_VALUE_IN_MIN!: number;
    public userIdlenessChecker!: BehaviorSubject<string> | undefined;
    public secondLevelUserIdleChecker!: BehaviorSubject<string> | undefined;
    private sessionForIdle!: Observable<number>;
    private userActivityChangeCallback!: ($event: any) => void;
    public clockForIdle!: Observable<number>;

    public inactivityTimerEvent: Array<any>[] = [
        [document, 'click'],
        [document, 'wheel'],
        [document, 'scroll'],
        [document, 'mousemove'],
        [document, 'keyup'],
        [window, 'resize'],
        [window, 'scroll'],
        [window, 'mousemove'],
    ];

    constructor(
        private zone: NgZone,
        private cache: CacheService,
        private config: ConfigService,
        private appContext: ApplicationContextService
    ) {
        this.USER_IDLE_TIMER_VALUE_IN_MIN =
            (this.appContext.getCurrentUser().expirationTime - this.config.get('timeoutAlertDuration') || 2) / 60 || 28;
        this.FINAL_LEVEL_TIMER_VALUE_IN_MIN = this.config.get('timeoutAlertDuration') || 2;

        if (!this.userIdlenessChecker) {
            this.userIdlenessChecker = new BehaviorSubject<string>('INITIATE_TIMER');
        }

        if (!this.secondLevelUserIdleChecker) {
            this.secondLevelUserIdleChecker = new BehaviorSubject<string>('INITIATE_SECOND_TIMER');
        }
    }

    public initilizeSessionTimeout(): void {
        IdleTimeoutService.runTimer = true;
        if (this.USER_IDLE_TIMER_VALUE_IN_MIN === 0) {
            this.userIdlenessChecker!.thrownError('Please provide USER_IDLE_TIMER_VALUE in minuite');
            return;
        }

        this.reset();
        this.initListener();
        this.initInterval();
    }

    get lastAction(): number {
        return parseInt(this.cache.get(STORE_KEY), 10);
    }

    set lastAction(value) {
        this.cache.set(STORE_KEY, value.toString());
    }

    private initListener(): void {
        this.zone.runOutsideAngular(() => {
            this.userActivityChangeCallback = ($event) => this.handleUserActiveState($event);
            this.inactivityTimerEvent.forEach((entry: any[]) => {
                entry[0].addEventListener(entry[1], this.userActivityChangeCallback.bind(this), true);
            });
        });
    }

    handleUserActiveState(event: any): void {
        this.reset();
    }

    public reset(): void {
        this.lastAction = Date.now();
        if (this.userIdlenessChecker) {
            this.userIdlenessChecker.next('RESET_TIMER');
        }
    }

    private initInterval(): void {
        const intervalDuration = 1000;
        this.sessionForIdle = interval(intervalDuration).pipe(
            map((tick: number) => {
                return tick;
            }),
            takeWhile(() => IdleTimeoutService.runTimer)
        );

        this.check();
    }

    private check(): void {
        this.sessionForIdle.subscribe(() => {
            const now = Date.now();
            const timeleft = this.lastAction + this.USER_IDLE_TIMER_VALUE_IN_MIN * 60 * 1000;
            const diff = timeleft - now;
            const isTimeout = diff < 0;
            if (!this.userIdlenessChecker) return;
            this.userIdlenessChecker!.next(`${diff}`);
            if (isTimeout) {
                this.inactivityTimerEvent.forEach((entry: any[]) => {
                    entry[0].removeEventListener(entry[1], this.userActivityChangeCallback, true);
                });
                this.zone.run(() => {
                    if (this.userIdlenessChecker) {
                        this.userIdlenessChecker.next('STOPPED_TIMER');
                        if (this.FINAL_LEVEL_TIMER_VALUE_IN_MIN > 0) {
                            this.secondLevelUserIdleChecker!.next('SECOND_TIMER_STARTED');
                            this.executeFinalTimer();
                        }
                    }
                    IdleTimeoutService.runTimer = false;
                });
            }
        });
    }

    public removeActionFromStore(): void {
        localStorage.removeItem(STORE_KEY);
    }

    private executeFinalTimer = () => {
        IdleTimeoutService.runSecondTimer = true;
        this.initializeFinalTimer();
    };

    private initializeFinalTimer(): void {
        const intervalDuration = 1000;
        this.clockForIdle = interval(intervalDuration).pipe(
            map((tick: number) => {
                return tick;
            }),
            takeWhile(() => IdleTimeoutService.runSecondTimer)
        );
        this.checkUserActionTime();
    }

    private checkUserActionTime(): void {
        let timeInSecond = 60;
        let timeInMin = this.FINAL_LEVEL_TIMER_VALUE_IN_MIN - 1;
        this.clockForIdle.subscribe(() => {
            if (--timeInSecond === 0) {
                if (--timeInMin === 0) {
                    timeInMin = timeInMin > 0 ? timeInMin - 1 : 0;
                }
                if (timeInMin === -1 && timeInSecond === 0) {
                    IdleTimeoutService.runSecondTimer = false;

                    if (this.secondLevelUserIdleChecker) {
                        this.secondLevelUserIdleChecker.next('SECOND_TIMER_STOPPED');
                    }
                }
                if (timeInMin < 0) {
                    timeInMin = 0;
                    setTimeout(() => {
                        timeInSecond = 60;
                    }, 800);
                } else {
                    timeInSecond = 60;
                }
            }
            this.secondLevelUserIdleChecker!.next(`${timeInMin}:${timeInSecond}`);
        });
    }

    ngOnDestroy(): void {
        if (this.userIdlenessChecker) {
            this.userIdlenessChecker.unsubscribe();
            this.userIdlenessChecker = undefined;
        }
        if (this.secondLevelUserIdleChecker) {
            this.secondLevelUserIdleChecker.unsubscribe();
            this.secondLevelUserIdleChecker = undefined;
        }
    }
}
