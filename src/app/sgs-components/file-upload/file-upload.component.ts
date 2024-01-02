import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnChanges {
    @Input() label: string = 'File Upload';
    @Input() accept!: string;
    @Input() maxSize!: number;
    @Output() _onUpload: EventEmitter<File> = new EventEmitter<File>();
    @Input() file!: any;
    @Input() isMultiple!: boolean;
    @Input() isDelete!: boolean;
    error!: string;
    constructor() {}
    getFileExtension(fileName: any) {
        return fileName.substr(fileName.lastIndexOf('.') + 1);
    }
    ngOnChanges(): void {
        if (this.isDelete) this.deleteFile();
    }

    uploadFile(target: any) {
        this.error = '';
        let acceptedFiles = this.accept.length > 0 ? this.accept.split(',') : [];
        acceptedFiles = acceptedFiles.map((type: any) => {
            return type.toLowerCase();
        });
        if (this.isMultiple) {
            //handle multiple files
            let isError = false;
            let selectedFiles: Array<any> = target.files || [];
            for (let i = 0; i < selectedFiles.length; i++) {
                let file = selectedFiles[i];
                const size = file.size;
                const type = '.' + this.getFileExtension(file.name);
                //quit if file type not allowed
                if (!acceptedFiles.includes(type.toLowerCase())) {
                    isError = true;
                    this.error = `Uploaded file type ${type} is not allowed`;
                    break;
                }
                //quit if file size not allowed
                if (this.maxSize && size > this.maxSize * 1000000) {
                    this.error = `Uploaded file ${file.name} size should be less than ${this.maxSize}`;
                    this.file = null;
                    isError = true;
                    break;
                }
            }
            if (isError) return;
            this._onUpload.emit(target.files);
        } else {
            //handle single file
            const size = target.files[0].size;
            //quit if file type not allowed
            const type = '.' + this.getFileExtension(target.files[0].name);
            if (!acceptedFiles.includes(type.toLowerCase())) {
                this.error = `Uploaded file type ${type} is not allowed`;
                return;
            }
            //quit if file size not allowed
            if (this.maxSize && size > this.maxSize * 1000000) {
                this.error = `Uploaded file size should be less than ${this.maxSize}`;
                this.file = null;
                return;
            }
            this.file = target.files[0];
            this._onUpload.emit(this.file);
        }
    }

    deleteFile() {
        this.file = null;
        this._onUpload.emit(this.file);
    }
}
