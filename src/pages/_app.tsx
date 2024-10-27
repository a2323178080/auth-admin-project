import "@/styles/globals.css";
import "@/components/agent/delete-agent.scss"
import "@/components/license/delete-license.scss"
import "@/components/license/license-table.scss"
import Head from "next/head";
import {Header} from "@/components/layout/header";
import {SideMenu} from "@/components/layout/side-menu"
import {ContentWrapper} from "@/components/layout/content-wrapper"
import axios from "axios";
import {useEffect} from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: any) {
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('hexToken='))
            ?.split('=')[1];
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
        }
    }, []);

  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />)
  }

  return (
      <>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
              <div className="bg-gray-200 min-w-full min-h-screen flex flex-col">
                  <Header />
                  <div className="flex flex-1">
                      <SideMenu />
                      <div className="flex-1 flex flex-col ">
                          <div className="flex-1">
                              <ContentWrapper>
                                  <div>
                                      <Component {...pageProps} />
                                  </div>
                              </ContentWrapper>
                          </div>
                      </div>
                  </div>
              </div>
      </>
  )
}
