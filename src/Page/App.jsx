import { useEffect, useState } from "react";
import { useMessageContext } from "../hooks/useMessageContext";
import { useValueParamsContext } from "../hooks/useValueParamsContext";
import { useMessageSystemContext } from "../hooks/useMessageSystemContext";
import Request from "../Services/Request";
import Chat from "../components/Chat";
function App() {

  const { messages, setMessages } = useMessageContext();
  const { inputValueSystem, setInputValueSystem } = useMessageSystemContext();
  const { inputValueParams, setInputValueParams } = useValueParamsContext();
  const [isChatGPTWriting, setIsChatGPTWriting] = useState(false);

  const isUserMessage = messages && messages[messages.length - 1]?.role === "user"

  useEffect(() => {
    if (isUserMessage) {
      Request(messages, inputValueParams)
        .then((data) => {
          if (data.response?.status === 401) {
            setMessages((prevMessage) => {
              const newMessage = {
                role: 'assistant',
                content: data.response.data.error.message
              }
              return [...prevMessage, newMessage]
            });
          } else {
            setMessages((prevMessage) => {
              const newMessages = data?.choices.map((choice) => {
                let chatGptMessage = choice.message.content.trim();
                return { role: "assistant", content: chatGptMessage, }
              })
              return [...prevMessage, ...newMessages]
            })
          }
        })
    }
  }, [inputValueParams, isUserMessage, messages, setMessages])

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
    let textToSystem = `Cuando te escriba 'generar', asume el rol de ${inputValueSystem.rol} y genera automáticamente un mensaje con los siguientes parámetros. Tu tarea es comunicarte en nombre de ${inputValueSystem.rol}.
    Se requiere generar una comunicación vía ${inputValueSystem.channel}${['Instagram', 'Twitter', 'Facebook'].includes(inputValueSystem.channel) && inputValueSystem.countUser ? `,orientada a los mensajes del brief de la cuenta' ${inputValueSystem.countUser}` : ''}, dirigida a una audiencia con las siguientes características: ${inputValueSystem.audience}. 
    El objetivo es ${inputValueSystem.typeComunication}, relacionado con el evento ${inputValueSystem.eventName}. El mensaje debe contener un máximo de  ${inputValueSystem.quantityWordOrCharacter} ${inputValueSystem.wordOrCharacter}. 
    En ningún momento se debe mencionar explícitamente a qué perfiles se está dirigiendo la comunicación. 
    Como ${inputValueSystem.rol}, debes utilizar un tono y estilo ${inputValueSystem.toneAndStyle}, ${inputValueSystem.typeComunication === 'convocar' ? 'asegúrate que el mensaje sea de marketing para captar el máximo de personas posibles.' : ''}. 
    El mensaje a comunicar es el siguiente: ${inputValueSystem.message}.`

    const newMessage = {
      role: 'system',
      content: textToSystem,
    };
    setMessages([newMessage]);

    //Mensaje para que genere
    const newMessageUser = {
      role: 'user',
      content: 'generar',
    };
    setMessages((prevMessages) => [...prevMessages, newMessageUser]);
    setIsChatGPTWriting(true);
    window.scrollTo(0, 0)
  }


  return (
    <div className="flex flex-col items-center w-full h-screen overflow-hidden bg-gray-100">

      <div className="flex justify-between w-full h-full my-4 overflow-hidden border border-black rounded-md shadow-sm shadow-gray-700">

        {/* mensaje con principal del sistema*/}

        <div className="flex flex-col w-[350px]  rounded-sm box-border bg-indigo-300/80 border-r-2 border-gray-900">
          <h3 className="px-4 py-2 text-lg font-bold tracking-wide text-center text-white bg-gray-700 ">
            Promp para el sistema
          </h3>

          <form
            className='flex flex-col pr-2 overflow-y-auto'
            onSubmit={handleSubmitSystem}>

            <label className='flex flex-col p-2'>
              <h4 className='font-sans font-semibold'>Nombre:</h4>
              <input
                className="w-full p-2 mr-1 border border-gray-300 rounded-md"
                name='rol'
                value={inputValueSystem.rol}
                onChange={handleInputChangeSystem}
                type="text"
                placeholder="Escribe tu nombre..."
              />
            </label>

            <label className='flex flex-col p-2'>
              <h4 className='font-sans font-semibold'>Tipo de Comunicación:</h4>
              <select
                className="w-full p-2 mr-1 border border-gray-300 rounded-md"
                name="typeComunication"
                defaultValue={inputValueSystem.typeComunication}
                onChange={handleInputChangeSystem}>
                <option value='' >--Choose and option--</option>
                <option value="informar">Informar</option>
                <option value="convocar">Convocar</option>
                <option value="cancelar">Cancelar</option>
                <option value="relevar">Publicitar</option>
              </select>
            </label>

            <label className='flex flex-col p-2'>
              <h4 className='font-sans font-semibold'>Canal:</h4>
              <select
                className="w-full p-2 mr-1 border border-gray-300 rounded-md"
                name="channel"
                defaultValue={inputValueSystem.channel}
                onChange={handleInputChangeSystem}>
                <option value='' >--Choose and option--</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter</option>
                <option value="Whatsapp">Whatsapp</option>
                <option value="Facebook">Facebook</option>
                <option value="Discord">Discord</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="E-mail">E-mail</option>
              </select>
            </label>

            {['Instagram', 'Twitter', 'Facebook'].includes(inputValueSystem.channel) &&
              <label className='flex flex-col p-2'>
                <h4 className='font-sans font-semibold'>Nombre de la cuenta: (optativo)</h4>
                <input
                  className="w-full p-2 mr-1 border border-gray-300 rounded-md"
                  name='countUser'
                  value={inputValueSystem.countUser}
                  onChange={handleInputChangeSystem}
                  type="text"
                />
              </label>
            }
            <label className='flex flex-col p-2'>
              <h4 className='font-sans font-semibold'>Nombre del Evento:</h4>
              <input
                className="w-full p-2 mr-1 border border-gray-300 rounded-md"
                name='eventName'
                value={inputValueSystem.eventName}
                onChange={handleInputChangeSystem}
                type="text"
                placeholder="Escribe un mensaje..."
              />
            </label>

            <label className='flex flex-col p-2'>
              <h4 className='font-sans font-semibold'>Caracteristicas de la Audiencia:</h4>
              <input
                className="w-full p-2 mr-1 border border-gray-300 rounded-md"
                name='audience'
                value={inputValueSystem.audience}
                onChange={handleInputChangeSystem}
                type="text"
                placeholder="Escribe un mensaje..."
              />
            </label>


            <label className='flex flex-col p-2'>
              <h4 className='font-sans font-semibold'>Tono y Estilo:</h4>
              <input
                className="w-full p-2 mr-1 border border-gray-300 rounded-md"
                name='toneAndStyle'
                value={inputValueSystem.toneAndStyle}
                onChange={handleInputChangeSystem}
                type="text"
                placeholder="Escribe un mensaje..."
              />
            </label>

            <label className='flex flex-col p-2'>
              <h4 className='font-sans font-semibold'>Cantidad de Palabras o Caracteres:</h4>
              <div className='flex flex-row justify-between m-2'>
                <div className='mx-2'>
                  <input
                    name='quantityWordOrCharacter'
                    min={0}
                    max={150}
                    className='w-full p-2 mr-1 border border-gray-300 rounded-md'
                    type="number"
                    onChange={handleInputChangeSystem} />
                </div>

                <div className='mx-2'>
                  <select
                    className='w-full p-2 mr-1 border border-gray-300 rounded-md'
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
              <h4 className='font-sans font-semibold'>Cantidad de respuestas:</h4>
              <div className='flex flex-row justify-around m-2'>
                <label className='flex flex-row'>
                  <span className='text-lg font-bold'>1</span>
                </label>
                <input
                  name='quantityAnswer'
                  value={1}
                  onChange={() => handleInputRadioParams(1)}
                  className='w-20 border border-gray-300 rounded-md cursor-pointer'
                  type="radio"
                  checked={inputValueParams.quantityAnswer === 1}
                />

                <label className='flex flex-row'>
                  <span className='text-lg font-bold'>2</span>
                </label>
                <input
                  name='quantityAnswer'
                  value={2}
                  onChange={() => handleInputRadioParams(2)}
                  className='w-20 border border-gray-300 rounded-md cursor-pointer'
                  type="radio"
                  checked={inputValueParams.quantityAnswer === 2}
                />

                <label className='flex flex-row'>
                  <span className='text-lg font-bold'>3</span>
                </label>
                <input
                  name='quantityAnswer'
                  value={3}
                  onChange={() => handleInputRadioParams(3)}
                  className='w-20 border border-gray-300 rounded-md cursor-pointer'
                  type="radio"
                  checked={inputValueParams.quantityAnswer === 3}
                />
              </div>
            </label>

            <label className='flex flex-col p-2'>
              <h4 className='font-sans font-semibold'>Mensaje:</h4>
              <textarea
                name='message'
                type="text"
                className="w-full p-2 mr-1 border border-gray-300 rounded-md"
                autoComplete='off'
                value={inputValueSystem.message}
                onChange={handleInputChangeSystem}
                rows="3"
                cols="50"
                placeholder="Escribe un mensaje..."
              />
            </label>

            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-800 transition-all duration-300 text-white rounded-md px-4 py-2 m-6`}>
              Setear Parametros y Generar
            </button>
          </form>

        </div>


        {/* mensaje con GPT */}
        <Chat
          isChatGPTWriting={isChatGPTWriting}
          setIsChatGPTWriting={setIsChatGPTWriting} />
      </div>


    </div >
  );
}

export default App
