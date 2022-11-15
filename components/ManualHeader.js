import { useMoralis } from "react-moralis" //从react-moralis里导入React钩子useMoralis
import { useEffect } from "react" //导入React核心钩子useEffect
//钩子让你“挂钩”React 状态和生命周期特性
export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis() //从useMoralis拉取enableWeb3这个函数
    //这是一种在我们的程序中跟踪状态的方法
    //为了这个钩子,我们整个程序都要在_app.js中被打包到Moralesprovider
    //enableWeb3这个函数让我们连接到Web3钱包
    //isWeb3Enabled这个函数是我们钩子里的一个可变部分,用来跟综我们是否已经连接Web3钱包
    //account这个函数用来检查是否有账户连接,这个更加完善,因为可能Web3钱包是连接状态,但是钱包未连接到账户
    //deactivateWeb3这个函数断开Web3钱包连接

    //useEffect这个函数它有两个参数,它接受一个函数作为它的第一个参数,第二个参数它可选地接受一个依赖数组。
    //useEffect将会检查依赖数组中的值,如果这个依赖率有任何变化,它就会调用前面的函数然后重新渲染前端。
    useEffect(() => {
        //如果我们连接到Web3的话,我们什么也不用干
        if (isWeb3Enabled) return
        //如果我们没有连接到Web3的话,如果我们的本地存储中有connectd的关键字,说明刷新前网页连接过钱包 我们将继续调用Web3进行连接
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])
    //由于React.Strict 模式开启,StrictMode渲染组件两次(在开发而不是生产上),以检测代码的任何问题并警告您(这可能非常有用)
    //如果不添加依赖数组的话,它每时每刻都会进行渲染,最终达到循环渲染的效果
    //如果给它添加空白数组的话,它仍会由于React.Strict 模式开启,StrictMode渲染组件两次,但是它在连接上Web3钱包后不会进行渲染

    useEffect(() => {
        //更换Web3钱包账户时所作的自动渲染
        Moralis.onAccountChanged((account) => {
            console.log(`Account change to ${account}`)
            //我们可以检查账户是否为空,如果账户为空则假设他们已经断开连接
            if (account == null) {
                window.localStorage.removeItem("connected") //断开连接时,我们会看到local sorage中的键值对也跟着消失
                deactivateWeb3()
                console.log("账户为空")
            }
        })
    }, [])

    //let connected = false
    //连接我们并改变连接的按钮是真的,但这些按钮不会重新渲染我们的应用程序（但是hooks可以让我们在发生变化时自动重新渲染）

    //我们想要的效果是我们的网站根据我们是否连接而改变

    return (
        <div>
            {/* 我们可以通过这些花括号来粘贴JavaScript */}
            {/* 检查是否有账户 */}
            {/* 有账户的话就展示连接状态,没有账户的话就连接钱包账户 */}
            {account ? (
                <div>
                    Conected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected") //在local storage的应用中设置了一个新的键值,以后我们想切换其他的Web3钱包就在这里切换
                        }
                    }}
                    disabled={isWeb3EnableLoading} //当Metamask正在加载的时候禁用Connected按钮
                >
                    Connect
                </button>
            )}
            {/* onClick后跟的那简单的一行代码就可以连接到Web3钱包 */}
        </div>
    ) //返回一些HTML
}
