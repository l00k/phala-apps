import AtomsDevtools from '@/components/AtomsDevtools'
import GlobalStyles from '@/components/GlobalStyles'
import GtagScript from '@/components/GtagScript'
import Layout from '@/components/Layout'
import MuiThemeProvider from '@/components/MuiThemeProvider'
import {createEmotionCache} from '@/lib/createEmotionCache'
import {CacheProvider, EmotionCache} from '@emotion/react'
import {CssBaseline} from '@mui/material'
import {Provider as JotaiProvider} from 'jotai'
import {AppProps} from 'next/app'
import Head from 'next/head'
import {SnackbarProvider} from 'notistack'
import {SWRConfig} from 'swr'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>SubBridge</title>
        <meta
          name="description"
          content="Cross-chain Router, Bridging Parachain, EVM, and other chains."
        />
      </Head>

      <GtagScript />

      <SWRConfig
        value={{
          onError: (error, key) => {
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.error(key, error)
            }
          },
        }}
      >
        <JotaiProvider>
          <AtomsDevtools>
            <CacheProvider value={emotionCache}>
              <MuiThemeProvider>
                <SnackbarProvider
                  preventDuplicate
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >
                  <CssBaseline enableColorScheme />
                  <GlobalStyles />
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </SnackbarProvider>
              </MuiThemeProvider>
            </CacheProvider>
          </AtomsDevtools>
        </JotaiProvider>
      </SWRConfig>
    </>
  )
}
