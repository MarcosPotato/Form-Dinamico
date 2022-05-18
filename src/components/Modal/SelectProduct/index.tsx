import React from 'react'
import { 
    useState, 
    useEffect, 
    useCallback, 
    forwardRef,
    useImperativeHandle 
} from 'react'

import { DialogRef } from '../index'

import api from '../../../services/api'

import { removeSymbolsOnString } from '../../../utils/format/removeSymbolsOnString'

import { DataGrid, ptBR, GridColumns } from '@mui/x-data-grid'
import { Close, Search } from '@mui/icons-material'
import { Stack, Button, Dialog } from '@mui/material'

import { RemoveButton } from './style'

import { 
    Container,
    ProductsTable,
    SearchField,
    ActionButtons
} from './style'

interface RequestProductsParams{
    tabela: string
    campos: string
    ordem: string
    bloqueio: string
    pesquisa?: string
    company?: string
    branch?: string
}

export interface Product{
    id?: string | number
    codigo: string
    descricao: string
    um: string
    cc: string
    ncm: string
    valor_unitario?: number | string
    valor_total?: number | string
    quantidade?: number
}

export interface SelectProductProps{
    onSelect(products: Array<Product>): void
}

const SelectProduct: React.ForwardRefRenderFunction<DialogRef, SelectProductProps> = ({ onSelect }, ref) => {

    const [open, setOpen] = useState<boolean>(false)

    const [filterContent, setFilterContent] = useState<string>("")
    const [isLoading, setIsLoading]         = useState<boolean>(true)
    const [selectedItens, setSelectedItens] = useState<Array<Product>>([])
    const [productsList, setProductsList]   = useState<Array<Product>>([])

    const [viewSelectedProducts, setViewSelectedProducts] = useState<boolean>(false)

    const [tableColumns, setTabelColumns] = useState<GridColumns>([
        { field: 'codigo', headerName: 'Código Produto', headerAlign: "center", align: "center", width: 140 },
        { field: 'descricao', headerName: 'Descrição', width: 500 },
        { field: 'cc', headerName: 'Centro de Custo', headerAlign: "center", align: "center", flex: 1, minWidth: 150 },
        { field: 'ncm', headerName: 'NCM', headerAlign: "center", align: "center", flex: 1, minWidth: 150 },
        { field: 'um', headerName: "Unidade de Medida", flex: 1, align: "center", headerAlign: "center", minWidth: 170}
    ])

    const selectProduct = useCallback(( row: Product): void => {
        const isSelected = selectedItens.findIndex(productSelected => productSelected.codigo === row.codigo)

        if(isSelected < 0){ setSelectedItens(prev => [...prev, row])}
    }, [selectedItens])

    const unselectProduct = useCallback(( id: string ): void => {
        setSelectedItens(prev => prev.filter(product => product.codigo !== id))
    }, [])

    const getProducts = useCallback(async(): Promise<void> => {
        setProductsList([])

        const requestParams: RequestProductsParams = {
            tabela: "SB1",
            campos: "B1_COD,B1_DESC,B1_UM,B1_CC,B1_POSIPI",
            ordem: "B1_DESC",
            bloqueio: "B1_MSBLQL",
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
                setProductsList(response.data.consultapadrao.map((info: any) => ({
                    codigo: info.B1_COD,
                    descricao: info.B1_DESC,
                    um: info.B1_UM,
                    cc: info.B1_CC,
                    ncm: info.B1_POSIPI
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
    }, [filterContent/* , addToast */])

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])

    useImperativeHandle(ref, () => ({
        dialogName: "product",
        isOpen: open,
        openDialog: () => setOpen(true),
        closeDialog: handleClose
    }))

    useEffect(() => {
        getProducts()

        return () => {
            setFilterContent("")
            setProductsList([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        if(viewSelectedProducts){
            setTabelColumns([
                { field: 'codigo', headerName: 'Código Produto', width: 140 },
                { field: 'descricao', headerName: 'Descrição', width: 500 },
                { field: 'cc', headerName: 'Centro de Custo', flex: 1, minWidth: 150 },
                { field: 'ncm', headerName: 'NCM', flex: 1, minWidth: 150 },
                { field: 'um', headerName: "Unidade de Medida", flex: 1, minWidth: 170},
                { field: 'remove', headerName: "Opções", align: "center", renderCell: (props) => (
                    <RemoveButton type="button" onClick={() => unselectProduct(props.row.codigo) }>
                        <Close/>
                    </RemoveButton>
                )}
            ])
        } else{
            setTabelColumns([
                { field: 'codigo', headerName: 'Código Produto', width: 140 },
                { field: 'descricao', headerName: 'Descrição', width: 500 },
                { field: 'cc', headerName: 'Centro de Custo', flex: 1, minWidth: 150 },
                { field: 'ncm', headerName: 'NCM', flex: 1, minWidth: 150 },
                { field: 'um', headerName: "Unidade de Medida", flex: 1, minWidth: 170},
            ])
        }
    }, [viewSelectedProducts, unselectProduct])

    return(
        <Dialog
            open={ open }
            fullWidth
            maxWidth="md"
            onClose={ handleClose }
        >
            <Container>
                <SearchField>
                    <label>Pesquisar Produto</label>
                    <div>
                        <input 
                            type="text"
                            disabled={ viewSelectedProducts }
                            onChange={event => setFilterContent(event.target.value)}
                        />
                        <button 
                            onClick={ getProducts }
                            disabled={ viewSelectedProducts }
                        >
                            <Search/>
                        </button>
                    </div>
                </SearchField>
                <ProductsTable>
                    { selectedItens.length > 0 && 
                        <p onClick={ () => setViewSelectedProducts(prev => !prev) }>
                            { viewSelectedProducts ? "Voltar" : `${ selectedItens.length } produtos selecionados` }
                        </p>
                    }
                    <DataGrid
                        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                        rows={ viewSelectedProducts? selectedItens : productsList }
                        columns={ tableColumns }
                        pageSize={30}
                        rowsPerPageOptions={[30]}
                        getRowId={ product => product.codigo }
                        getRowClassName={({ row }) => selectedItens.findIndex(item => item.codigo === row.codigo) >= 0 ? `selected-row` : ""}
                        disableColumnFilter
                        loading={ isLoading }
                        onRowClick={({ row }) => selectProduct(row as Product)}
                        components={{
                            NoRowsOverlay: () => (
                                <Stack height="100%" alignItems="center" justifyContent="center">
                                    Nenhum produto encontrado
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
                            onSelect(selectedItens)
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

export default forwardRef(SelectProduct)