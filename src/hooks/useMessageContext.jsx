import React, { useContext } from 'react'

export const messageContext = React.createContext();
export const useMessageContext = () => {
    return useContext(messageContext)
}