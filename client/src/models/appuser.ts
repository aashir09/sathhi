export class AppUser {
    id: number
    
    firstName: string
    
    middleName: string
    
    lastName: string
    
    contactNo: string
    
    email: string
    
    gender: string
    
    password: string
    
    imageId: number
    
    isPasswordSet: boolean
    
    isDisable: boolean
    
    isVerified: boolean
    
    isActive: boolean
    
    isDelete: boolean
    
    createdDate: Date
    
    modifiedDate: Date
    
    imageUrl: string
    
    roleId: number
    
    userDocuments: AppUserDocuments[]

    isDocumentVerified: boolean
    
    isDocumentUploaded: boolean

    constructor() {
        this.userDocuments = new Array<AppUserDocuments>();
    }
}

export class AppUserDocuments {
    id: number
    
    userId: number
    
    documentTypeId: number
    
    documentUrl: string
    
    isVerified: boolean
    
    isRequired: boolean
    
    isActive: boolean
    
    isDelete: boolean
    
    createdDate: Date
    
    modifiedDate: Date
    
    createdBy: number
    
    modifiedBy: number
    
    documentTypeName: string
    
    isError: boolean
}