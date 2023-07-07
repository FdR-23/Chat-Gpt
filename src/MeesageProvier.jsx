import React, { useState, useContext } from 'react'

export const messageContext = React.createContext();
export const useMessageContext = () => {
    return useContext(messageContext)
}

export const messageSystemContext = React.createContext();
export const useMessageSystemContext = () => {
    return useContext(messageSystemContext)
}

export const valueParamsContext = React.createContext();
export const useValueParamsContext = () => {
    return useContext(valueParamsContext)
}


const MessageProvider = ({ children }) => {
    const [inputValueParams, setInputValueParams] = useState({

        quantityAnswer: 1,
    });
    const [inputValueSystem, setInputValueSystem] = useState({
        rol: 'Default',
        typeComunication: 'Default',
        audience: '',
        channel: '',
        countUser: '',
        eventName: '',
        toneAndStyle: '',
        message: '',
        wordOrCharacter: 'Default',
        quantityWordOrCharacter: '',
    });
    const [messages, setMessages] = useState()

    return (
        < valueParamsContext.Provider value={{
            inputValueParams: inputValueParams,
            setInputValueParams: setInputValueParams
        }}>
            <messageSystemContext.Provider value={{
                inputValueSystem: inputValueSystem,
                setInputValueSystem: setInputValueSystem
            }}>
                <messageContext.Provider value={{
                    messages: messages,
                    setMessages: setMessages
                }}>
                    {children}
                </messageContext.Provider>
            </messageSystemContext.Provider>
        </valueParamsContext.Provider>
    )
}

export default MessageProvider