import { ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
export const ROLES:any = {
    '0' : 'Scheme Member',
    '2' : 'Promoter',
    '1' : 'Admin',
    '3' : 'Employee',
}

export const USER_TABLE_COLUMNS =  [
    {
        key: 'created_at',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'userId',
        displayName: 'User ID',
        type: ColumnType.link,
        sortable: true,
    },
    {
        key: 'firstName',
        displayName: 'First Name',
        sortable: true,
    },
    {
        key: 'lastName',
        displayName: 'Last Name',
        sortable: true,
    },
    {
        key: 'email',
        displayName: 'Email ID',
        sortable: true,
    },
    {
        key: 'mobilePhone',
        displayName: 'Mobile Number',
        sortable: true,
    }, 
    {
        key: 'updated_at',
        displayName: 'Updated Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'status',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
];

export const SCHEME_PAY_TABLE_COLUMNS =  [
    {
        key: 'created_at',
        displayName: 'Joining Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'paidDate',
        displayName: 'Paid Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'dueDate',
        displayName: 'Due Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'amount_paid',
        displayName: 'Amount',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'month_paid',
        displayName: 'Month',
        sortable: true,
    },
    {
        key: 'lateFee',
        displayName: 'Late Fee',
        sortable: true,
    },
    {
        key: 'status',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
];
export const INDIVIDUAL_SCHEME_TABLE_COLUMNS =  [
    {
        key: 'created_at',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'coins',
        displayName: 'No of Coins',
        type: ColumnType.number,
        sortable: true,
    },
    {
        key: 'no_of_months',
        displayName: 'No of Months',
        sortable: true,
    }, 
    {
        key: 'amount_per_month',
        displayName: 'Amount Per Month',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'updated_at',
        displayName: 'Updated Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'status',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
];
export const GROUP_SCHEME_TABLE_COLUMNS =  [
    {
        key: 'created_at',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'total_amount',
        displayName: 'Total Amount',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'no_of_months',
        displayName: 'No of Months',
        sortable: true,
    }, 
    {
        key: 'amount_per_month',
        displayName: 'Amount Per Month',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'updated_at',
        displayName: 'Updated Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'status',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
];
export const DEALERS_TABLE_COLUMNS = [
    {
        key: 'created',
        displayName: 'Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'userId',
        displayName: 'User Id',
        type: ColumnType.link,
        sortable: true,
    },
    {
        key: 'name',
        displayName: 'Name',
        type: ColumnType.label,
        sortable: true,
    },
    {
        key: 'schemeType',
        displayName: 'Scheme',
        type: ColumnType.label,
        sortable: true,
    },
    {
        key: 'txnAmount',
        displayName: 'Amount',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'currentState',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    },
    {
        key: 'reject',
        displayName: 'Reject',
        type: ColumnType.reject,
    },
    {
        key: 'approve',
        displayName: 'Approve',
        type: ColumnType.approve,
    },
];

export const STATUSES:Array<string>= [
    'pending',
    'active',
    'inactive',
    'rejected'
];
export const USER_TYPES:Array<any>= [
    {
        id:0,
        name:'Scheme Member'
    },
    {
        id:1,
        name:'Admin'
    },
    {
        id:2,
        name:'Promoters'
    },
    {
        id:3,
        name:'Employees'
    }
];


