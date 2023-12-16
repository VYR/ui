import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-view-demo',
    templateUrl: './view-demo.component.html',
    styleUrls: ['./view-demo.component.scss'],
})
export class ViewDemoComponent {
    isVideoSelected = false;
    selectedVideo = { title: '', src: '' };

    @ViewChild('videoPlayer')
    videoplayer!: ElementRef;

    constructor(private dialogRef: MatDialogRef<ViewDemoComponent>) {}

    // toggleVideo(event: any) {
    //     this.videoplayer.nativeElement.play();
    // }

    demosList = [
        { title: 'User Creation', src: 'assets/videos/2.mp4' },
        { title: 'Beneficiary List and Search', src: 'assets/videos/8.mp4' },
        { title: 'Make Single Transfer', src: 'assets/videos/7.mp4' },
        { title: 'Make Multiple Transfers', src: 'assets/videos/7.mp4' },
        { title: 'Make Future Dated Payments', src: 'assets/videos/6.mp4' },
        { title: 'Balance Confirmation Request', src: 'assets/videos/1.mp4' },
    ];

    getSelectedVideoContent(video: any) {
        this.isVideoSelected = true;
        this.selectedVideo = video;
        this.videoplayer?.nativeElement.load();
    }

    cancelDialog() {
        this.dialogRef.close();
    }
}
