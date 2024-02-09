export class SGSTableConfig {
    columns: Array<SGSTableColumn> = [];
    data: Array<any> = [];
    pageSize?: number;
    totalRecords!: number;
    showPagination: boolean = true;
    selection!: boolean;
    clientPagination?: boolean;
    pageSizeOptions?: Array<number> = [];
}

export class SGSTableColumn {
    key!: string;
    displayName!: string;
    type?: ColumnType = ColumnType.label;
    icon?: string;
    sortable?: boolean;
    UUID?: string = '';
    minWidth?: number;
    extraText?: string;
    callBackFn?: (param: any) => boolean | undefined;
}

export class SGSTableQuery {
    sortKey!: string;
    sortDirection!: SortDirection;
    pageIndex: number = 0;
    pageSize: number = 5;
}

export enum SortDirection {
    asc = 'ASC',
    desc = 'DESC',
}

export enum ColumnType {
    link = 'link',
    button = 'button',
    icon = 'icon',
    label = 'label',
    amount = 'amount',
    approve = 'approve',
    reject = 'reject',
    date = 'date',
    status = 'status',
    attachment = 'attachment',
    switch = 'switch',
    toolTip = 'toolTip',
    html = 'html',
    number = 'number',
    onlyDate = 'onlyDate'
}
