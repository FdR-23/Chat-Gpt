import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useMessageContext, useValueParamsContext, useMessageSystemContext } from "../MeesageProvier"
import Request from "../Services/Request";

function App() {
  const [inputValue, setInputValue] = useState('');
  const { messages, setMessages } = useMessageContext();
  const { inputValueSystem, setInputValueSystem } = useMessageSystemContext();
  const { inputValueParams, setInputValueParams } = useValueParamsContext();

  const [isChatGPTWriting, setIsChatGPTWriting] = useState(false);

  const isUserMessage = messages && messages[messages.length - 1]?.role === "user"
console.log(messages)
  useEffect(() => {
    const controller = new AbortController();
    if (isUserMessage) {
      console.log("entra")
      Request(messages, inputValueParams)
        .then((data) => {
          if (data?.choices.length > 1) {
            setMessages((prevMessage) => {
              const newMessages = data?.choices.map((choice) => {
                let chatGptMessage = choice.message.content.trim();
                return { role: "assistant", content: chatGptMessage, }
              })
              return [...prevMessage, ...newMessages]
            })
          } else {
            setMessages((prevMessage) => {
              let chatGptMessage = data?.choices[0].message.content.trim();
              return [...prevMessage, { role: "assistant", content: chatGptMessage, }]
            })
          }
        });
    }
  }, [isUserMessage])



  //para el chat
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // const handleFirstMessage = (e) => {
  //   setInputValue(e.target.value);
  // };

  // para parametros de chatgpt
  const handleInputRadioParams = (e) => {
    setInputValueParams({ ...inputValueParams, quantityAnswer: e })
  };

  //para el los parametros para el mensaje  system que se le enviar a chat gpt
  const handleInputChangeSystem = (e) => {
    setInputValueSystem((prevValue) => {
      return { ...prevValue, [e.target.name]: e.target.value }
    })
  };

  //enviamos el mensaje system con los parametros 
  const handleSubmitSystem = (e) => {
    e.preventDefault()
    let textToSystem = `cuando te escriba 'generar' vas a generar un mensaje automaticamente con los siguientes parametros.
    Tu tarea es  tomar el rol de ${inputValueSystem.rol}. 
    Se requiere generar una comunicación vía ${inputValueSystem.channel}${['Instagram', 'Twitter', 'Facebook'].includes(inputValueSystem.channel) && inputValueSystem.countUser ? `,los mensajes orientados al brief de la cuenta' ${inputValueSystem.countUser}` : ''}, dirigida a una audiencia con las siguientes características: ${inputValueSystem.audience}, 
    para ${inputValueSystem.typeComunication}, al o el evento ${inputValueSystem.eventName}, el mensaje tiene que tener un maximo de ${inputValueSystem.quantityWordOrCharacter} ${inputValueSystem.wordOrCharacter}. 
    No explicitar en ningún momento a qué perfiles se está comunicando. 
    Usar un tono y estilo ${inputValueSystem.toneAndStyle}, ${inputValueSystem.typeComunication === 'convocar' ? 'que el mensaje sea de marketing para captar el máximo de personas posibles.' : ''} 

    Se desea comunicar lo siguiente: ${inputValueSystem.message}.

    Al final vas a sugerir  con qué imagen se debería comunicar este mensaje.`

    const newMessage = {
      role: 'system',
      content: textToSystem,
    };
    setMessages([newMessage]);

    //mensaje para que genere
    const newMessageUser = {
      role: 'user',
      content: 'generar',
    };
    setMessages((prevMessages) => [...prevMessages, newMessageUser]);

    setIsChatGPTWriting(true);
    window.scrollTo(0, 0)
  }

  // Para chatear con chat gpt
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

  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo(0, chatContainerRef.current.scrollHeight);
    }
  }, [messages]);

  return (
    <div className="w-full  flex flex-col items-center  ">
      {/* 
      <div className='w-full  bg-slate-400  rounded-b-md'>
        <div className='text-center m-2'>
          <h2 className='text-4xl font-mono font-bold'>Chat </h2>
        </div>
      </div> */}


      <div className="flex justify-between w-full h-full">
        {/* mensaje con principal del sistema*/}

        <div className="flex flex-col w-[350px] h-full border shadow-sm shadow-black rounded-sm overflow-hidden  box-border">

          <h3 className="px-4 py-2 font-semifbold border-b border-gray-900  bg-gray-200  font-bold">
            Promp para el sistema
          </h3>

          <form
            className='flex flex-col '
            onSubmit={handleSubmitSystem}>

            <label className='flex flex-col p-2'>
              <h4 className='font-semibold font-sans'>Rol:</h4>
              <select
                className="border border-gray-300 rounded-md p-2 w-full mr-1"
                name="rol"
                defaultValue={inputValueSystem.rol}
                onChange={handleInputChangeSystem}>
                <option value='' >--Choose and option--</option>
                <option value="Horacio Rodriguez Larreta">Horacio Rodriguez Larreta</option>
                <option value="Jefe de Comunicacón de Gobierno de la Ciudad de Buenos Aires">Jefe de equipo de comunicacón</option>
              </select>
            </label>


            <label className='flex flex-col p-2'>
              <h4 className='font-semibold font-sans'>Tipo de Comunicación:</h4>
              <select
                className="border border-gray-300 rounded-md p-2 w-full mr-1"
                name="typeComunication"
                defaultValue={inputValueSystem.typeComunication}
                onChange={handleInputChangeSystem}>
                <option value='' >--Choose and option--</option>
                <option value="informar">Informar</option>
                <option value="convocar">Convocar</option>
                <option value="cancelar">Cancelar</option>
                <option value="relevar">Relevar</option>
                <option value="reconfirmar">Reconfirmar</option>
                <option value="reprogramar">Reprogramar</option>
              </select>
            </label>

            <label className='flex flex-col p-2'>
              <h4 className='font-semibold font-sans'>Canal:</h4>
              <select
                className="border border-gray-300 rounded-md p-2 w-full mr-1"
                name="channel"
                defaultValue={inputValueSystem.channel}
                onChange={handleInputChangeSystem}>
                <option value='' >--Choose and option--</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter</option>
                <option value="Whatsapp">Whatsapp</option>
                <option value="Facebook">Facebook</option>
                <option value="E-mail">E-mail</option>
                <option value="IVR">IVR</option>
              </select>
            </label>
            {['Instagram', 'Twitter', 'Facebook'].includes(inputValueSystem.channel) &&
              <label className='flex flex-col p-2'>
                <h4 className='font-semibold font-sans'>Brief de la cuenta:</h4>
                <input
                  className="border border-gray-300 rounded-md p-2  w-full mr-1"
                  name='countUser'
                  value={inputValueSystem.countUser}
                  onChange={handleInputChangeSystem}
                  type="text"
                  placeholder="Ejemplo @horaciorlarreta"
                />
              </label>
            }
            <label className='flex flex-col p-2'>
              <h4 className='font-semibold font-sans'>Nombre del Evento:</h4>
              <input
                className="border border-gray-300 rounded-md p-2  w-full mr-1"
                name='eventName'
                value={inputValueSystem.eventName}
                onChange={handleInputChangeSystem}
                type="text"
                placeholder="Escribe un mensaje..."
              />
            </label>

            <label className='flex flex-col p-2'>
              <h4 className='font-semibold font-sans'>Caracteristicas de la Audiencia:</h4>
              <input
                className="border border-gray-300 rounded-md p-2  w-full mr-1"
                name='audience'
                value={inputValueSystem.audience}
                onChange={handleInputChangeSystem}
                type="text"
                placeholder="Escribe un mensaje..."
              />
            </label>


            <label className='flex flex-col p-2'>
              <h4 className='font-semibold font-sans'>Tono y Estilo:</h4>
              <input
                className="border border-gray-300 rounded-md p-2  w-full mr-1"
                name='toneAndStyle'
                value={inputValueSystem.toneAndStyle}
                onChange={handleInputChangeSystem}
                type="text"
                placeholder="Escribe un mensaje..."
              />
            </label>


            <label className='flex flex-col  p-2'>
              <h4 className='font-semibold font-sans'>Cantidad de Palabras o Caracteres:</h4>
              <div className='flex flex-row justify-between m-2'>
                <div className='mx-2'>
                  <input
                    name='quantityWordOrCharacter'
                    min={0}
                    max={300}
                    className='border border-gray-300 rounded-md p-2  w-full mr-1'
                    type="number"
                    onChange={handleInputChangeSystem} />
                </div>

                <div className='mx-2'>
                  <select
                    className='border border-gray-300 rounded-md p-2  w-full mr-1'
                    name="wordOrCharacter"
                    defaultValue={inputValueSystem.wordOrCharacter}
                    onChange={handleInputChangeSystem}>
                    <option value=''  >--Choose and option--</option>
                    <option value="Palabras">Palabras</option>
                    <option value="Caracteres">Caracteres</option>
                  </select>
                </div>
              </div>
            </label>

            <label className='flex flex-col p-2'>
              <h4 className='font-semibold font-sans'>Alternativas de respuestas:</h4>
              <div className='flex flex-row justify-around m-2'>
                <label className='flex flex-row'>
                  <span className='font-bold text-lg'>1</span>
                </label>
                <input
                  name='quantityAnswer'
                  value={1}
                  onChange={() => handleInputRadioParams(1)}
                  className='border border-gray-300 rounded-md w-20 cursor-pointer'
                  type="radio"
                  checked={inputValueParams.quantityAnswer === 1}
                />

                <label className='flex flex-row'>
                  <span className='font-bold text-lg'>2</span>
                </label>
                <input
                  name='quantityAnswer'
                  value={2}
                  onChange={() => handleInputRadioParams(2)}
                  className='border border-gray-300 rounded-md w-20 cursor-pointer'
                  type="radio"
                  checked={inputValueParams.quantityAnswer === 2}
                />

                <label className='flex flex-row'>
                  <span className='font-bold text-lg'>3</span>
                </label>
                <input
                  name='quantityAnswer'
                  value={3}
                  onChange={() => handleInputRadioParams(3)}
                  className='border border-gray-300 rounded-md w-20 cursor-pointer'
                  type="radio"
                  checked={inputValueParams.quantityAnswer === 3}
                />
              </div>
            </label>


            <label className='flex flex-col p-2'>
              <h4 className='font-semibold font-sans'>Mensaje:</h4>
              <textarea
                name='message'
                type="text"
                className="border border-gray-300 rounded-md p-2  w-full mr-1"
                autoComplete='off'
                value={inputValueSystem.message}
                onChange={handleInputChangeSystem}
                rows="3"
                cols="50"
                placeholder="Escribe un mensaje..."
              />
            </label>

            <div className='flex flex-row justify-center'>
              <button
                type="submit"
                className={`bg-blue-700 text-white rounded-md px-4 py-2 m-6`}>
                Setear Parametros y Generar
              </button>


            </div>

          </form>

        </div>


        {/* mensaje con GPT */}
        <div className="w-[700px] h-[600px] border-2 border-black rounded-xl overflow-hidden flex flex-col m-2 mr-10">

          <h3 className="px-4 py-2 font-semifbold border-b border-gray-900  bg-gray-200  font-bold">
            Chat con GPT
          </h3>

          <div className=" flex-grow overflow-auto p-2 bg-slate-50" ref={chatContainerRef}>
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
              <div className="flex justify-end mb-4">
                <div className="bg-gray-400 text-white rounded-lg p-2">
                  <span className="text-[12px]  text-gray-900">GPT</span>
                  <p className="">Escribiendo ...</p>
                </div>
              </div>
            )}
          </div>

          <form
            className='flex p-2 py-4 bg-slate-800 '
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


    </div >
  );
}

export default App
