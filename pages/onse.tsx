import React, {useState} from 'react'
//var parser = require('ua-parser-js');

const Voice = () => {

  //const ua = parser(navigator.userAgent.toLowerCase());
  const [isVoiceReceive,setIsVoiceReceive] = useState(false)
  const [message,setMessage] = useState([])

  const SppechView = () =>{

    const speech = new webkitSpeechRecognition();
    speech.lang = 'ja-JP';


    speech.onresult = (event) => {
      setIsVoiceReceive(false)
      speech.stop();
      if(event.results[0].isFinal){
          var autotext =  event.results[0][0].transcript
          const createMessage = message
          createMessage.push(`${autotext}<br />`)
          setMessage(createMessage)
      }
    }

    speech.onend = () => {
      setIsVoiceReceive(true)
      speech.start() 
    };

    const startSpeech = ('click' , ()=> {
      speech.start();
    });

    return (
      <>
        <button id="btn" onClick={startSpeech}>音声認識開始</button>
        {isVoiceReceive ? '話してください' : '話さないでください'}<br/>
        メッセージ件数:{message.length}<br/>
        <div
          dangerouslySetInnerHTML={{
            __html: message
          }}
        />      
      </>
    )
  }


  return(
    <>
      <h2>音声認識</h2>
      <SppechView />
      
    </>
  )
}

export default Voice
