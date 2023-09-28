import React,{useContext} from 'react'
export const messageSystemContext = React.createContext();
export const useMessageSystemContext = () => {
    return useContext(messageSystemContext)
}