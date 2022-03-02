import { ReactElement } from 'react'
import Head from 'next/head'
import Home from '@page-components/Index'
import { Layout } from '@components/Layout'

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Gabrielle</title>
        <meta
          name="description"
          content="Gabrielle is a website which provides Blogging tips, Technology news and reviews, plus you can create your own blog to share interesting knowledge with everyone."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home />
    </>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default HomePage
