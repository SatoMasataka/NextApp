//import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { dataContext } from '../components/DataContext'
import { useState } from "react"
//import 'regenerator-runtime/runtime'

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<string>('light')
  return <div>
    <dataContext.Provider value={{ theme, setTheme }}>
      <Component {...pageProps} />
    </dataContext.Provider></div>
}

export default MyApp

