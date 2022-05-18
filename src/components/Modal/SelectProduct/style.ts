import styled, { css } from "styled-components"
import { shade } from "polished";

interface SearchFieldProps{
    disabled?: boolean
}

export const Container = styled.div`
    width: calc(100% - 15px * 2);
    padding: 15px;
`

export const SearchField = styled.div<SearchFieldProps>`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

    label{
        font-size:1.4rem;
        font-weight: 600;
        margin-bottom: 8px;
    }

    > div{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        input{
            flex: 1;
            height: 30px;
            border-radius: 5px 0px 0px 5px;
            border-width: 1px;
            border-color: #e6e6e6;
            border-style: solid;
            outline: none;
            background-color: #e6e6e6;
            padding: 5px;
        }

        button{
            width: 45px;
            height: 30px;
            background-color: #12a454;
            border-width: 1px;
            border-color: #f9f9f9;
            border-style: solid;
            border-radius: 0px 5px 5px 0px;
            transition: 200ms;
            
            svg{
                color: #f9f9f9;
            }

            ${props => !props.disabled && css`
                &:hover{
                    background-color: ${ shade(0.2, "#12a454") };
                }
            `}
        }

        @media(max-width: 350px){

            input{ width: 85%; }
            
            button{ width: 15%; }
        }
    }
`

export const ProductsTable = styled.div`
    width: 100%;
    height: 50vh;
    padding-top: 25px;
    position: relative;

    > p{
        position: absolute;
        bottom: 15px;
        left: 15px;
        font-size: 15px;
        background-color: #e6e6e6;
        padding: 0px 5px;
        border-radius: 10px;
        transition: 200ms;
        z-index: 1;

        &:hover{
            cursor: pointer;
            background-color: #3a6df0;
        }
    }

    > button{
        position: absolute;
        top: 0;
        right: 0;
        background-color: #ffffff00;
        border: none;
    }

    > div{
        z-index: 0;
    }

    .MuiDataGrid-row:hover{
        cursor: pointer !important;
    }

    .MuiDataGrid-selectedRowCount{
        visibility: hidden !important;
    }

    .selected-row{
        background-color: #bbfcd0 !important;
    }
`

export const ActionButtons = styled.div`
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button{
        width: 48%;
    }
`

export const RemoveButton = styled.button`
    background-color: #E83F5B;
    border: none;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    transition: 200ms;

    svg{
        color: #f9f9f9;
    }

    &:hover{
        background-color: ${ shade(0.2, "#E83F5B")};
    }

    &:active{
        background-color: ${ shade(0.3, "#E83F5B")};
    }
`