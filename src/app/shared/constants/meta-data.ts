import { ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
export const ROLES:any = {
    '0' : 'Scheme Member',
    '2' : 'Promoter',
    '1' : 'Admin',
    '3' : 'Employee',
    '4' : 'Super Employee',
}
export const TOTAL_ROLETYPES:any = [0,1,2,3,4];
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
        key: 'user_email',
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
        displayName: 'Start Date',
        type: ColumnType.onlyDate,
    },
    {
        key: 'paidDate',
        displayName: 'Paid Date',
        type: ColumnType.date,
    },
    {
        key: 'dueDate',
        displayName: 'Due Date',
        type: ColumnType.onlyDate,
    },
    {
        key: 'amount_paid',
        displayName: 'Amount',
        type: ColumnType.amount,
    },
    {
        key: 'month_paid',
        displayName: 'Month',
    },
    {
        key: 'txnNo',
        displayName: 'Payment ID',
    },
    {
        key: 'lateFee',
        displayName: 'Late Fee',
    },
    {
        key: 'status',
        displayName: 'Status',
        type: ColumnType.status,
    }
];
export const SCHEME_TABLE_COLUMNS =  [
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
        key: 'status',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
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
    },
    {
        id:4,
        name:'Super Employees'
    }
];

export const RAZORPAY = { 
    LOGO:"https://savegold.in/assets/img/logo.png",
    CURRENCY: "INR",
    KEY_NAME: "razorKey",
    PAYMENT_MODE: {
        ONLINE:'online',
        OFFLINE:'offline'
    },
    THEME_COLOR: "#F0BE1C"
};
