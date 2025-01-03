

export enum NotificationSchedule {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    NONE = 'NONE'
}

export enum NotificationMethod {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    PUSH = 'PUSH',
    INAPP = 'INAPP',
    NONE = 'NONE'
}

export enum UserPermissions {
    COLLECTION_READ = 'COLLECTION_READ',
    COLLECTION_WRITE = 'COLLECTION_WRITE',
    COLLECTION_DELETE = 'COLLECTION_DELETE',
    BUDGET_READ = 'BUDGET_READ',
    BUDGET_WRITE = 'BUDGET_WRITE',
    BUDGET_DELETE = 'BUDGET_DELETE',
    USER_READ = 'USER_READ',
    USER_WRITE = 'USER_WRITE',
    USER_DELETE = 'USER_DELETE'
}