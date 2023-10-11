import React,{useContext} from 'react'

export const valueParamsContext = React.createContext();
export const useValueParamsContext = () => {
    return useContext(valueParamsContext)
}