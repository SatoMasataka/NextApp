//import type { NextPage } from 'next'
// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
// import { Dispatch, useState } from 'react'
import Link from 'next/link'


import { useContext } from 'react'
import { dataContext } from '../components/DataContext'
const Page1 = () => {
  let { theme, setTheme } = useContext(dataContext)


  const clk = async () => {
    setTheme("ccc")
  }

  return <div>
    page2
    <button onClick={clk}>CCCCCCC</button>
    <Link href="/">
      <a>About Us</a>
    </Link>
    <div>
      <div>{theme}</div>
    </div>
  </div >

}

export default Page1
