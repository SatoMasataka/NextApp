import React from 'react';
import { useEffect ,useState} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
    const [img, changeImg] = useState("")
  const {
    finalTranscript,
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  useEffect(() => {
    const f = async () =>{
        if(!finalTranscript){return}

        const res = await fetch(`http://localhost:3000/api/image?p=${finalTranscript}`)
        const img = (await res.json()).imgs[0]
        changeImg(img)
    }
    f()
  },[finalTranscript])

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={()=>SpeechRecognition.startListening({continuous:true})}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{finalTranscript}</p>
      <img src={img}></img>
      <p>{img}</p>
    </div>
  );
};
export default Dictaphone;