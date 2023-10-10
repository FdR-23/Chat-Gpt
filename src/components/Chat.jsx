import { useState, useEffect, useRef } from 'react'
import { useMessageContext } from '../hooks/useMessageContext';


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
        <div className='flex justify-center flex-1 h-full '>
            <div className="w-[700px] shadow-sm shadow-black border flex flex-col my-2 rounded-sm overflow-hidden">
                {/* <h3 className="px-4 py-2 font-bold bg-gray-200 border-b border-gray-900 font-semifbold">
                    Chat con GPT
                </h3> */}
                
                {/* Chat message */}
                <div
                    id={`scroll-chat`}
                    className="flex-grow h-screen p-2 overflow-auto bg-white over" ref={chatContainerRef}>
                    {messages && messages.map((message, index) => (
                        message.role === 'system' ? null : (
                            message.role === 'user' ? (
                                message.content === 'generar' ? <></> :
                                    <div key={index} className="flex justify-start mb-4 mr-32">
                                        <div className="p-2 pt-1 text-white bg-blue-500 rounded-lg">
                                            <span className="text-[14px] font-bold text-black">Me</span>
                                            <p>{message.content}</p>
                                        </div>
                                    </div>) :
                                <div key={index} className="flex justify-end mb-4 ml-32">
                                    <div className="p-2 pt-1 text-white whitespace-pre-line bg-gray-500 rounded-lg">
                                        <span className="text-[14px] font-bold text-black">GPT</span>
                                        <p className="">{message.content}</p>
                                    </div>
                                </div>
                        )
                    ))}

                    {messages && messages.length > 0 && messages[messages.length - 1].role === 'user' && isChatGPTWriting && (
                        <div key='typing' className="flex justify-end mb-4">
                            <div className="p-2 text-white bg-gray-400 rounded-lg">
                                <span className="text-[14px] font-bold text-black">GPT</span>
                                <p className="">Escribiendo ...</p>
                            </div>
                        </div>
                    )}
                </div>

                <form
                    className={`${!messages ? 'hidden' : 'flex'} p-3 rounded-t-sm bg-slate-300  border-t`}
                    onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-2 mr-1 border border-gray-300 rounded-md"
                        placeholder="Escribe un mensaje..."
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 mt-2 text-white transition-all duration-300 bg-blue-500 rounded-md hover:bg-blue-700">
                        Enviar
                    </button>
                </form>

            </div>
        </div>
    )
}

export default Chat