import { keyframes } from "styled-components"

export const fade = keyframes`
    from{
        opacity: 0;
        transform: scale(0.9);
    } to {
        opacity: 1;
        transform: scale(1);
    }
`

export const invertedFade = keyframes`
    from{
        opacity: 1;
        transform: scale(1);
    } to {
        opacity: 0;
        transform: scale(0.9);
    }
`

export const shake = keyframes`
    10%, 90%{
        transform: translate3d(-1px, 0, 0);
    }

    20%, 80%{
        transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70%{
        transform: translate3d(-4px, 0, 0);
    }

    40%, 60%{
        transform: translate3d(4px, 0, 0);
    }
`