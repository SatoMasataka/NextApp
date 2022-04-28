import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { dataContext } from '../components/DataContext'
import { useState } from "react"

function MyApp({ Component, pageProps }: AppProps) {
  //const [ctx, setCtx] = useState({ con1: "aaa" })
  const [theme, setTheme] = useState<string>('light')
  return <div>
    {/* <button onClick={() => { setCtx({ con1: "ccc" }) }}></button> */}
    <dataContext.Provider value={{ theme, setTheme }}>
      <Component {...pageProps} />
    </dataContext.Provider></div>
}

export default MyApp

