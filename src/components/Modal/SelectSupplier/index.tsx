import React from 'react'
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { DialogRef } from '..'

import api from '../../../services/api'

import { removeSymbolsOnString } from '../../../utils/format/removeSymbolsOnString'
import { cnpjMask, cpfMask } from '../../../utils/masks/inputMasks'

import { DataGrid, ptBR, GridColumns } from '@mui/x-data-grid'
import { Search } from '@mui/icons-material'
import { Stack, Button, Dialog } from '@mui/material'

import { 
    Container,
    ProductsTable,
    SearchField,
    ActionButtons
} from './style'

interface RequestSuppliersParams{
    tabela: string
    campos: string
    ordem: string
    pesquisa?: string
    company?: string
    branch?: string
}

export interface Supplier{
    id?: number
    cod: string
    loja: string
    cnpj: string
    reason: string
    name: string
    ie: string
    email: string
}

export interface SelectSupplierProps{
    initialSearch?: string
    onSelect: (products: string[]) => void
}

const SelectSupplier: React.ForwardRefRenderFunction<DialogRef, SelectSupplierProps> = ({ initialSearch, onSelect }, ref) => {

    const [open, setOpen] = useState<boolean>(false)

    const [filterContent, setFilterContent] = useState<string>(initialSearch || "")
    const [isLoading, setIsLoading]         = useState<boolean>(true)
    const [selectedItem, setSelectedItem]   = useState<Supplier>({} as Supplier)
    const [suppliersList, setSuppliersList]   = useState<Array<Supplier>>([])

    const [tableColumns] = useState<GridColumns>([
        { field: 'cod', headerName: 'Código', align: "center", headerAlign: "center", width: 80 },
        { field: 'loja', headerName: 'Loja', align: "center", headerAlign: "center", width: 80 },
        { field: 'cnpj', headerName: 'CNPJ', width: 150, renderCell: props => props.row.cnpj.length === 14 ? cnpjMask(props.row.cnpj) : cpfMask(props.row.cnpj) },
        { field: 'reason', headerName: 'Razão Social', width: 500 },
        { field: 'name', headerName: 'Nome Fantasia', flex: 1, minWidth: 300 },
        { field: 'ie', headerName: 'Inscrição Estadual', headerAlign: "center", align: "center", flex: 1, minWidth: 150 },
        { field: 'email', headerName: "Email", flex: 1, minWidth: 300 }
    ])

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])

    const getSuppliers = useCallback(async(): Promise<void> => {
        setSuppliersList([])

        const requestParams: RequestSuppliersParams = {
            tabela: "SA2",
            campos: "A2_NOME,A2_CGC,A2_INSCR,A2_EMAIL,A2_NREDUZ,A2_COD,A2_LOJA",
            ordem: "A2_NOME",
            company: "01",
            branch: "0101"
        }

        if(!!filterContent){
            requestParams.pesquisa = removeSymbolsOnString(filterContent.toUpperCase())
        }

        try{
            const response = await api.get("/consultapadrao", {
                params: requestParams,
                headers: {
                    authorization: "8c7cea11d0692ae1d3477d5cfb0d9781128af36d38b30f6c38bf987e1126ea8996ac56baa5bac59426a5e53b8eb3eeaa6a6417f77e6c6d10a25101960f8aece7"
                }
            })

            if(response.data){
                setSuppliersList(response.data.consultapadrao.map((info: any, index: number) => ({
                    id: index,
                    cod: info.A2_COD,
                    loja: info.A2_LOJA,
                    cnpj: info.A2_CGC,
                    reason: info.A2_NOME,
                    name: info.A2_NREDUZ,
                    ie: info.A2_INSCR,
                    email: info.A2_EMAIL
                })))
            }
        }catch(error: any){
            console.log(error)
            /* addToast({
                type: "error",
                title: "Não foi possivel carregar produtos",
                description: error.message
            }) */
        } finally{
            setIsLoading(false)
        }

        setSuppliersList([
            {
                id: 1,
                cod: "01",
                loja: "01",
                cnpj: "teste",
                reason: "fornecedor LTDA",
                name: "fornecedor",
                ie: "teste313",
                email: "dasda",
            }
        ])

    }, [filterContent/* , addToast */])

    const tranformValues = useCallback((value: Supplier): string[] => {
        const clonedObject = Object.assign({}, value)
        delete clonedObject.id
        const arrayValue = Object.keys(clonedObject).map(item => clonedObject[item])

        return arrayValue
    }, [])

    useImperativeHandle(ref, () => ({
        dialogName: "supplier",
        isOpen: open,
        openDialog: () => setOpen(true),
        closeDialog: handleClose
    }))

    useEffect(() => {
        getSuppliers()

        return () => {
            setFilterContent("")
            setSuppliersList([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <Dialog
            open={ open }
            fullWidth
            maxWidth="md"
            onClose={ handleClose }
        >

            <Container>
                <SearchField>
                    <label>Pesquisar Fornecedor</label>
                    <div>
                        <input 
                            type="text" 
                            onChange={event => setFilterContent(event.target.value)}
                            onKeyPress={(event => {
                                if(event.key === "Enter"){
                                    getSuppliers()
                                }
                            })} 
                        />
                        <button onClick={ getSuppliers }>
                            <Search/>
                        </button>
                    </div>
                </SearchField>
                <ProductsTable>
                    <DataGrid
                        localeText={ ptBR.components.MuiDataGrid.defaultProps.localeText }
                        rows={ suppliersList as readonly { [key: string]: any }[] }
                        columns={ tableColumns }
                        pageSize={ 30 }
                        rowsPerPageOptions={[30]}
                        disableColumnFilter
                        loading={ isLoading }
                        onRowClick={row => setSelectedItem(row.row as Supplier)}
                        onRowDoubleClick={ row => {
                            setSelectedItem(row.row as Supplier)
                            onSelect(tranformValues(row.row as Supplier))
                            handleClose()
                        }}
                        components={{
                            NoRowsOverlay: () => (
                                <Stack height="100%" alignItems="center" justifyContent="center">
                                    Nenhum fornecedor encontrado
                                </Stack>
                            )
                        }}
                    />
                </ProductsTable>
                <ActionButtons>
                    <Button 
                        type="button"
                        size='large'
                        variant="contained"
                        fullWidth
                        color="inherit"
                        onClick={ handleClose }
                    >
                        Fechar
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained"
                        color="success"
                        size='large'
                        fullWidth
                        onClick={ () => {
                            onSelect(tranformValues(selectedItem))
                            handleClose()
                        }}
                    >
                        Adicionar
                    </Button>
                </ActionButtons>
            </Container>
        </Dialog>
    )
}

export default forwardRef(SelectSupplier)