import React from "react"
import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"

function MyApp({ Component, pageProps }) {
    return (
        //initializeOnMount是可选钩子,可以进入服务器以向我们的网站添加更多的功能,我们不想挂接到服务器(因为我们想要一切都是开源的)
        //下面是对组件的包装
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
