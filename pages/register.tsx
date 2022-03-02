import React from 'react'
import Head from 'next/head'
import { Register } from '@page-components/Auth'

const RegisterPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up Gabrielle Community</title>
        <meta
          name="description"
          content="Gabrielle is a website which provides Blogging tips, Technology news and reviews, plus you can create your own blog to share interesting knowledge with everyone."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Register />
    </>
  )
}

export default RegisterPage
