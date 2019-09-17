export enum CRUDAction
{
    None = 0,
    Create = 1,
    Read = 2,
    Update = 3,
    Delete = 4,
    Purge = 5
}

export enum ExecuteActionWhen
{
    AfterInsert = 'AFTER_INSERT',
    AfterUpdate = 'AFTER_UPDATE',
    AfterDelete = 'AFTER_DELETE',
    BeforeInsert = 'BEFORE_INSERT',
    BeforeUpdate = 'BEFORE_UPDATE',
    BeforeDelete = 'BEFORE_DELETE'
}

export enum IndexType
{
    None,
    BoardDisplay
}

export enum SettingDefaultValueType{
    None = 0,
    Text = 1,
    SingleSelect = 101,
    MultiSelect = 102
}

export enum ActionHandoff{
    Start = 1,
    Cancel = 2,
    Confirm = 3,
    item = 4
}