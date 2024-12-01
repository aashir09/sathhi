export class UserPages {
    id: number

    path: string

    title: string

    type: string

    active: string

    group: string

    parentId: number

    displayOrder: number

    userPageId: number

    isReadPermission: boolean

    isAddPermission: boolean

    isDeletePermission: boolean

    isEditPermission: boolean

    isActive: boolean

    isDelete: boolean

    createdDate: Date

    modifiedDate: Date

    isSelected: boolean

    userId: number

    pages:UserPages[]= []
    
}