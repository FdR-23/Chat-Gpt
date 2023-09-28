import axios from 'axios';

const Request = async (messages, inputValueParams) => {
    console.log("import",import.meta.env.VITE_OPENAI_API_KEY_MAX_NEW)
    try {
        const params = {
            messages: messages,
            model: "gpt-3.5-turbo",
            temperature: 0.6, //Controla la aleatoriedad de las respuestas generadas por el modelo. Valores más altos, como 0.8, generarán respuestas más aleatorias, mientras que valores más bajos, como 0.2, generarán respuestas más determinísticas y coherentes.
            max_tokens: 500,
            presence_penalty: 0.3,  //Controla la probabilidad de que el modelo genere una respuesta que mencione o haga referencia a los mensajes previos del asistente. Un valor más alto (por ejemplo, 0.6) aumentará la probabilidad de respuestas autoconsistentes, mientras que un valor más bajo (por ejemplo, 0.2) permitirá respuestas más creativas y divergentes.
            frequency_penalty: 0.4,//Permite controlar la diversidad de las respuestas generadas por el modelo. Un valor más alto (por ejemplo, 0.6) favorecerá respuestas más diversas y originales, mientras que un valor más bajo (por ejemplo, 0.2) producirá respuestas más comunes y seguras.
            n: inputValueParams.quantityAnswer, // cuántas respuestas alternativas genera el modelo         
        };
        const response = await axios.post('https://api.openai.com/v1/chat/completions', params, {
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY_MAX_NEW}`,
                'content-type': "application/json",
            },
        }).then(response => response.data)

        return response

    } catch (error) {
        return error
    }
};


export default Request