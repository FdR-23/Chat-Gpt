import  { useState } from 'react'
import { messageContext } from './hooks/useMessageContext';
import { messageSystemContext } from './hooks/useMessageSystemContext';
import { valueParamsContext } from './hooks/useValueParamsContext';

const MessageProvider = ({ children }) => {
    const [inputValueParams, setInputValueParams] = useState({

        quantityAnswer: 1,
    });
    const [inputValueSystem, setInputValueSystem] = useState({
        rol: '',
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