import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConfigService } from '../configuration/config.service';
import { Directions } from '../shared/enums';
import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable()
export class UtilService {
    public load = new Subject();
    public direction = new BehaviorSubject(Directions.LTR);

    constructor(
        private translateService: TranslateService,
        private notificationService: ToastrService,
        private configService: ConfigService,
        private spinner: NgxSpinnerService
    ) {}

    /**
     * Translates given message code and title code and displays corresponding notification
     * @param messageTranslationCode - code to translate the string
     * @param type - message type of the notification
     * @param titleTranslationCode - translation code of title to display in the notification
     */
    public displayNotification(
        messageTranslationCode: string,
        type: string = 'info',
        titleTranslationCode?: string
    ): void {
        const message: string =
            messageTranslationCode && messageTranslationCode !== ''
                ? this.translateService.instant(messageTranslationCode)
                : 'An Internal error has occured while processing your request.123';
        let title: string = titleTranslationCode ? this.translateService.instant(titleTranslationCode) : null;
        const options = this.configService.get('notifications') ? this.configService.get('notifications').options : {};
        switch (type) {
            case 'error':
                title = this.translateService.instant('ERROR');
                this.notificationService.error(message, title, options);
                break;

            case 'success':
                title = this.translateService.instant('SUCCESS');
                this.notificationService.success(message, title, options);
                break;

            case 'warning':
                title = this.translateService.instant('WARNING');
                this.notificationService.warning(message, title, options);
                break;

            case 'info':
                title = this.translateService.instant('INFO');
                this.notificationService.info(message, title, options);
                break;
        }
    }

    /**
     * Translates lookup names by looking into lookup code
     * @param data - lookup data array to translate
     */
    public translateLookupData(data: any[]): any[] {
        // Translate quantity stock adjustment reasons
        return data.map((lookup) => {
            lookup.name = lookup.code ? this.translateService.instant('Lookups')[lookup.code] : lookup.name;
            return lookup;
        });
    }

    /**
     * Starts the ngx spinner
     */
    public startSpinner(): void {
        this.spinner.show(undefined, this.configService.get('spinner'));
    }

    /**
     * Starts the ngx spinner
     */
    public stopSpinner(): void {
        this.spinner.hide();
    }

    /**
     * Starts the ngx spinner
     */
    public changeDirection(type: Directions): void {
        this.direction.next(type);
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        fileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }

    public downloadPdf(base64String: any, fileName: any) {
        const source = `data:application/pdf;base64,${base64String}`;
        const link = document.createElement('a');
        link.href = source;
        link.download = `${fileName}.pdf`;
        link.click();
    }

    public downloadFile(base64String: any, fileName: any, fileType: any) {
        const source = `data:'${fileType}';base64,${base64String.data}`;
        fileSaver.saveAs(source, fileName);
    }
    /**
     * Utility service to loop over list and find match data based on key passed.
     */
    public getNameFromList(codeVal: string, dataList: any[], displayNameKey: string, conditionCheckKey: string) {
        function displayName(dataObj: any) {
            return dataObj[conditionCheckKey] === codeVal;
        }
        if (dataList.length > 0) {
            const countryObj = dataList.find(displayName);
            return countryObj ? countryObj[displayNameKey] : '';
        }
        return codeVal;
    }

    public readFromExcel(files: any, onlyHeaders: boolean = false) {
        return new Observable((subscriber) => {
            try {
                const file = files;
                let workBook: any = null;
                let jsonData: any = null;
                let headers: any = null;
                const reader = new FileReader();
                let output = {};
                reader.onloadstart = () => {
                    this.startSpinner();
                };
                reader.onloadend = () => {
                    this.stopSpinner();
                };
                reader.onload = (event) => {
                    const data = reader.result;
                    workBook = XLSX.read(data, { type: 'binary' });
                    const wsname: string = workBook.SheetNames[0];
                    const ws: XLSX.WorkSheet = workBook.Sheets[wsname];
                    jsonData = XLSX.utils.sheet_to_json(ws);
                    headers = XLSX.utils.sheet_to_json(ws, { header: 1 });
                    const filterJsonData = this.sheetjsCleanEmptyRows(jsonData);
                    output = {
                        data: onlyHeaders ? headers : filterJsonData,
                        fileName: files.name,
                    };
                    subscriber.next(output);
                };
                reader.readAsBinaryString(file);
            } catch (error) {
                this.stopSpinner();
                this.displayNotification('An error has occured while processing Excel Document', 'error');
                subscriber.next({
                    data: null,
                });
            }
        });
    }

    private sheetjsCleanEmptyRows(row: any) {
        if (!row) return [];
        const data: any = [];
        row.forEach((x: any) => {
            if (!Object.values(x).every((item) => !item)) {
                data.push(x);
            }
        });
        return data;
    }

    public readFile(files: any) {
        return new Observable((subscriber) => {
            try {
                const file = files;
                const reader = new FileReader();
                reader.readAsText(file);
                let output = {};
                reader.onloadstart = () => {
                    this.startSpinner();
                };
                reader.onloadend = () => {
                    this.stopSpinner();
                };
                reader.onload = (event) => {
                    output = {
                        data: reader.result,
                        fileName: files.name,
                    };
                    subscriber.next(output);
                };
            } catch (error) {
                this.stopSpinner();
                this.displayNotification('An error has occured while processing Excel Document', 'error');
                subscriber.next({
                    data: null,
                });
            }
        });
    }

    public convertFileToByteArray(file: File) {
        return new Observable((subscriber: any) => {
            try {
                const reader = new FileReader();
                let output = {};
                reader.onloadstart = () => {
                    this.startSpinner();
                };
                reader.onloadend = () => {
                    this.stopSpinner();
                };
                reader.onload = (event) => {
                    const data = reader.result;

                    // const fileByteArray:Array<any> = [];
                    // for (let i = 0; i < array.length; i++) {
                    //     fileByteArray.push(array[i]);
                    // }
                    output = {
                        data: data,
                        fileName: file.name,
                    };
                    subscriber.next(output);
                };
                reader.readAsBinaryString(file);
            } catch (error) {
                this.stopSpinner();
                this.displayNotification('An error has occured while processing Excel Document', 'error');
                subscriber.next({
                    data: null,
                });
            }
        });
    }
}
