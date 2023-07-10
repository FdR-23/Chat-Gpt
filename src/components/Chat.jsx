import React, { useState, useEffect, useRef } from 'react'
import { useMessageContext } from '../MeesageProvier';

const Chat = ({ isChatGPTWriting, setIsChatGPTWriting }) => {
    const [inputValue, setInputValue] = useState('');


    const chatContainerRef = useRef(null);
    const { messages, setMessages } = useMessageContext();

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo(0, chatContainerRef.current.scrollHeight);
        }
    }, [messages]);

    //Para chatear
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    //Enviar el mensaje
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            const newMessage = {
                role: 'user',
                content: inputValue,
            };
            if (messages) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } else {
                setMessages([newMessage]);
            }
            setInputValue('');
            setIsChatGPTWriting(true);
        }
    };


    return (
        <div className=' flex-1 flex h-full justify-center'>
            <div className="w-[700px] shadow-sm border flex flex-col my-2 ">

                {/* <h3 className="px-4 py-2 font-semifbold border-b border-gray-900  bg-gray-200  font-bold">
                Chat con GPT
            </h3> */}

                <div
                    id={`scroll-chat`}
                    className=" flex-grow overflow-auto p-2 bg-white" ref={chatContainerRef}>
                    {messages && messages.map((message, index) => (
                        message.role === 'system' ? null : (
                            message.role === 'user' ? (
                                message.content === 'generar' ? <></> :
                                    <div key={index} className="flex justify-start mb-4 mr-20">
                                        <div className="bg-blue-500 text-white rounded-lg p-2">
                                            <span className="text-[12px]  text-gray-900">Me</span>
                                            <p className="">{message.content}</p>
                                        </div>
                                    </div>) :
                                <div key={index} className="flex justify-end mb-4 ml-20">
                                    <div className="bg-gray-400 text-white rounded-lg p-2 whitespace-pre-line">
                                        <span className="text-[12px]  text-gray-900">GPT</span>
                                        <p className="">{message.content}</p>
                                    </div>
                                </div>
                        )
                    ))}

                    {messages && messages.length > 0 && messages[messages.length - 1].role === 'user' && isChatGPTWriting && (
                        <div key='typing' className="flex justify-end mb-4">
                            <div className="bg-gray-400 text-white rounded-lg p-2">
                                <span className="text-[12px]  text-gray-900">GPT</span>
                                <p className="">Escribiendo ...</p>
                            </div>
                        </div>
                    )}
                </div>

                <form
                    className={`${Boolean(!messages) ? 'hidden' : 'flex'} p-3 rounded-t-sm bg-slate-300 `}
                    onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 mt-2 w-full mr-1"
                        placeholder="Escribe un mensaje..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded-md px-4 py-2 mt-2"
                    >
                        Enviar
                    </button>
                </form>
                
            </div>
        </div>
    )
}

export default Chat