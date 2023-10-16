/* eslint-disable */

import "@/styles/antd-table.css"
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { createStore } from '@reduxjs/toolkit'
import { CookiesProvider } from "react-cookie";

// import MainLayout from '@/layouts/main_layout'
import rootReducer from '@/reducers'

export default function App({ Component, pageProps }: AppProps) {
  const store = createStore(rootReducer)

  return <>
  <CookiesProvider defaultSetOptions={{httpOnly: true}}>
    <Provider store={ store }>

      <Head>
        <title>CDP Demo Page</title>
        <meta name="description" content="Jobkorea CDP Demo"/>
      </Head>

      <Component {...pageProps} />

      {/* @ts-ignore
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout> */}

    </Provider>
  </CookiesProvider>
  </>
}
