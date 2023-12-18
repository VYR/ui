import { ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { SALARY_POSTING_COLUMNS } from 'src/app/shared/enums';

export const USER_TABLE_COLUMNS =  [
    {
        key: 'created',
        displayName: 'Join Date',
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
        key: 'schemeType',
        displayName: 'Schemes',
        sortable: true,
        type: ColumnType.link,
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
        key: 'currentState',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
];

export const INDIVIDUAL_SCHEME_PAY_TABLE_COLUMNS =  [
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
        key: 'individualAmount',
        displayName: 'Amount',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'individualMonthToPay',
        displayName: 'Month',
        sortable: true,
    },
    {
        key: 'currentState',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
];
export const INDIVIDUAL_SCHEME_TABLE_COLUMNS =  [
    {
        key: 'created',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'individualAmount',
        displayName: 'Amount',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'individualMonths',
        displayName: 'No of Months',
        sortable: true,
    },
    {
        key: 'currentState',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
];
export const GROUP_SCHEME_TABLE_COLUMNS =  [
    {
        key: 'created',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },    
    {
        key: 'groupTotalAmount',
        displayName: 'Total Amount',
        type: ColumnType.amount,
        sortable: true,
    }, 
    {
        key: 'groupMonths',
        displayName: 'No of Months',
        sortable: true,
    },
    {
        key: 'groupAmountPerMonth',
        displayName: 'Amount Per Month',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'currentState',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
];
export const GROUP_SCHEME_PAY_TABLE_COLUMNS =  [
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
        key: 'groupAmount',
        displayName: 'Total Amount',
        type: ColumnType.amount,
        sortable: true,
    }, 
    {
        key: 'groupMonthToPay',
        displayName: 'Month',
        sortable: true,
    },
    {
        key: 'currentState',
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

