import styled from 'styled-components';

export const Container = styled.div`
    display: grid;
    width: 100%;
    height: 100vh;
    grid-template-columns: 8fr 2fr;
    background-color: #202960;
`

export const Holder = styled.div`
    display: grid;
    grid-template-rows: 8.5fr 1.5fr;
    grid-gap: 15px;
    height: 100%;
`

export const Utils = styled.div`
    height: 100%;
    background-color: #2D2B8D;
    border-radius: 15px;
`
export const VideoContainer = styled.div`
`

export const ActionHolder = styled.div`
    width: 100%;
    display: grid;
    place-items: center;
    height: 100%;
`

export const Actions = styled.div`
    background-color: #2D2B8D;
    width: 50%;
    height: 10vh;
    border-radius: 15px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
`