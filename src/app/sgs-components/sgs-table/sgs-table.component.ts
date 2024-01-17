import { SelectionModel } from '@angular/cdk/collections';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SGSTableQuery, SGSTableConfig, SGSTableColumn, ColumnType, SortDirection } from './models/config.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
@Component({
    selector: 'app-sgs-table',
    templateUrl: './sgs-table.component.html',
    styleUrls: ['./sgs-table.component.scss'],
})
export class SgsTableComponent implements OnChanges, AfterViewInit {
    @ViewChild(MatTable) table!: MatTable<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @Input() config: SGSTableConfig = new SGSTableConfig();
    @Output() _lazyLoad: EventEmitter<SGSTableQuery> = new EventEmitter<SGSTableQuery>();
    @Output() _select: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
    @Output() _clickCell: EventEmitter<any> = new EventEmitter<any>();
    selection = new SelectionModel<any>(true, []);
    ColumnType = ColumnType;
    totalRows = 0;
    pageSize = 5;
    currentPage = 0;
    pageSizeOptions: number[] = [5, 10, 25];
    showPagination:boolean=true;
    columnDefs: Array<SGSTableColumn> = [];
    columns: Array<String> = [];
    dataSource = new MatTableDataSource<any>([]);
    query: SGSTableQuery = new SGSTableQuery();

    constructor(private cdr: ChangeDetectorRef) {
        this.query.pageIndex = 0;
        this.query.pageSize = 5;
        this._lazyLoad.emit(this.query);
        this.dataSource = new MatTableDataSource<any>([]);
    }
    onToggleChange($event: MatSlideToggleChange, column: any, element: any) {
        element[column.key] = $event.checked;
        this._clickCell.emit({ key: column.key, data: element });
    }
    ngOnChanges(changes: SimpleChanges): void {
        // if (changes['config'].firstChange) return;
        this.selection.clear();
        if (!this.config) return;
        this.columnDefs = this.config.columns;
        this.columns = this.config.columns.map((x) => x.key);
        if (this.config.selection) this.columns.push('select');
        if (this.config.pageSizeOptions) this.pageSizeOptions = this.config.pageSizeOptions;
        this.showPagination=this.config.showPagination;
        this.dataSource.data = this.config.data;
        setTimeout(() => {
            if (this.paginator) this.paginator!.length = this.config.totalRecords;
            if (this.config.clientPagination) this.dataSource.paginator = this.paginator;
        });
        this.cdr.detectChanges();
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        setTimeout(() => {
            if (this.paginator) {
                this.paginator!.length = this.config.totalRecords;
                this.dataSource.paginator = this.paginator;
            }
        });
        this._lazyLoad.emit(this.query);
    }

    handlePageEvent(event: any) {
        if (!this.config.clientPagination) {
            this.selection.clear();
            this._select.emit([]);
        }

        this.query.pageSize = event.pageSize;
        this.query.pageIndex = event.pageIndex;
        this._lazyLoad.emit(this.query);
    }
    getSubString(value: any, length: any) {
        return value.substring(0, length);
    }
    getToolTipLength(value: any) {
        return value ? value.length : 0;
    }
    handleSort(event: any) {
        this.query.sortKey = event.active;
        this.query.sortDirection = event.direction == 'desc' ? SortDirection.desc : SortDirection.asc;
        this.paginator.pageIndex = 0;
        this.query.pageIndex=0;
        this._lazyLoad.emit(this.query);
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
            this._select.emit([]);
            return;
        }
        this.selection.select(...this.dataSource.data);
        this._select.emit(this.selection.selected);
    }

    onChangeSelection(event: any, row: any) {
        if (!this.config.selection) return;
        event ? this.selection.toggle(row) : null;
        this._select.emit(this.selection.selected);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
}
