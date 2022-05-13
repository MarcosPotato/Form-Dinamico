import styled, { css } from "styled-components"
import { shake, fade } from '../../../themes/animations'

import { TextField } from '@mui/material'
import { Close, Check } from "@mui/icons-material"

interface InputProps{
    isError: boolean
    hasAnError: boolean
}

export const Container = styled.div`
    position: relative;
`

export const Input = styled(TextField)<InputProps>`

    ${ props => props.isError && css`
        fieldset{
            border-color: #c53030;
        }
        legend, label, span{
            color: #c53030;
        }
        animation: ${ shake } 500ms;
    `}

    ${ props => (!props.isError && props.hasAnError) && css`
        fieldset{
            border-color: #0dba04;
        }
        legend, label, span{
            color: #0dba04;
        }
    `}
`

export const CloseIcon = styled(Close)`
    color: #c53030;
    position: absolute;
    top: 0;
    right: 30px;
    margin-top: 7px;
    animation: ${ fade } 200ms;
`

export const CheckIcon = styled(Check)`
    color: #0dba04;
    position: absolute;
    top: 0;
    right: 30px;
    margin-top: 7px;
    animation: ${ fade } 200ms;
`

export const ErrorMessage = styled.p`
    position: absolute;
    bottom: -18px;
    color: #c53030;
    font-size: 12px;
    padding-left: 5px;
`