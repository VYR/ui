import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[appTextHighlight]',
})
export class TextHighlightDirective implements OnChanges {
    @Input() appTextHighlight = '';
    colorConfig: any = {
        'awaiting approval': '#e18025',
        'pending for approval': '#ebc704',
        processed: '#2BC431',
        active: '#2BC431',
        blocked: '#EA0000',
        inactive: '#EA0000',
        'payment overdue': '#e18025',
        approved: '#2BC431',
        rejected: '#EA0000',
        approve: '#2BC431',
        reject: '#EA0000',
        submitted: '#E17F25',
        failed: '#EA0000',
        success: '#2BC431',
        pending: '#E17F25',
        completed: '#2BC431',
        cancelled: '#EA0000',
        canceled: '#EA0000',
        created: '#00a1de',
        reverted: '#6F2A7F',
        returned: '#6F2A7F',
        cleared: '#2BC431',
        paid: '#2BC431',
        uncleared: '#EA0000',
        due: '#EA0000',
        'not presented': '#e18025',
        processing: '#E17F25',
        new: '#00a1de',
        'not applicable': '#EA0000',
        issued: '#00a1de',
        'more info required': '#E17F25',
        'under process': '#E17F25',
        declined: '#EA0000',
    };

    constructor(private el: ElementRef) {}

    ngOnChanges() {
        this.el.nativeElement.style.color = this.colorConfig[this.appTextHighlight?.toLowerCase()]
            ? this.colorConfig[this.appTextHighlight.toLowerCase()]
            : '#555555';
    }
}
