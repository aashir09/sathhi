export class Coupons {
    id: number
    
    name: string
    
    code: string
    
    type: string
    
    value: number
    
    maxUsage: number
    
    userUsage: number
    
    validFrom: Date
    
    validTo: Date
    
    maxDiscountAmount: number
    
    description: string
    
    termsCondition: string
    
    isActive: boolean
    
    isDelete: boolean
    
    createdDate: Date
    
    modifiedDate: Date
    
    createdBy: number
    
    modifiedBy: number
    
    packages: []
}