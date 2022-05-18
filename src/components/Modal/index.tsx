import React from 'react'
import SelectProduct, { SelectProductProps } from "./SelectProduct"
import SelectSupplier, { SelectSupplierProps } from "./SelectSupplier"

export type DialogTypes = "product" | "supplier"

export interface DialogRef{
    dialogName: string
    isOpen?: boolean
    openDialog: () => void
    closeDialog: () => void
}

export const getDialog = (type: string) => {
    switch(type){
        case "product":
            return SelectProduct
        case "supplier":
            return SelectSupplier
        default:
            throw new Error("The Dialog type must be informed when you use searchText type")
    }
}