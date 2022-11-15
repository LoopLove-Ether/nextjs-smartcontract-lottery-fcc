import { useWeb3Contract } from "react-moralis" //钩子
//这个钩子给予我们从函数返回来的 数据(data)、错误(error)、一个我们可以用来调用任何函数的小函数(runContractFunction)、
//获取交易(isFetching)、加载交易(isLoading)等变量
import { abi, contractAddresses } from "../constants" //index.js基本上代表了整个文件夹
import { useMoralis } from "react-moralis" //钩子
import { useEffect, useState } from "react" //钩子
import { ethers } from "ethers"
import { useNotification } from "web3uikit" //导入负责通知窗口的钩子

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //可以通过Morales的钩子得到chainId(标题组件对钩子传递了MoralisProvider的Metamask的所有信息)
    const chainId = parseInt(chainIdHex) //chainId展示为:0x+ChainId(十六进制版本的ChainId),加了parseInt后解析为了十进制版本
    //合约必须是在本地区块链上运行
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null //我们不会更改raffleAddress,所以我们不需要把它放在一个钩子里
    //从技术上讲我们更改地址会更改网络,但我们的Header组件负责重新渲染和处理所有这些变量
    const [entranceFee, setEntranceFee] = useState("0") //将从0开始
    //entranceFee 将成为我们调用以获取 entranceFee 的变量，setEntranceFee 将成为我们调用以更新或设置 entranceFee 的函数
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification() //dispath就像一个小弹出窗口

    //想要获得当前彩票中玩家的数量
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //指定网络Id
        functionName: "getNumberOfPlayers", //函数名字
        params: {}, //该合约函数没有参数
    })

    //想要获得当前彩票中最近一次的胜利者
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //指定网络Id
        functionName: "getRecentWinner", //函数名字
        params: {}, //该合约函数没有参数
    })

    //想要调用getEntrancefee函数,当我们的彩票合约加载时,我们要运行一个函数阅读该入场费
    //运行ContractFunction 既可以发送交易也可以读取状态
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //指定网络Id
        functionName: "getEntranceFee", //函数名字
        params: {}, //该合约函数没有参数
    })
    //自动渲染更新UI
    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const resentWinnerFromCall = await getRecentWinner()
        setRecentWinner(resentWinnerFromCall)
        setNumPlayers(numPlayersFromCall)
        setEntranceFee(entranceFeeFromCall) //现在当我们设置state钩子时,将触发重新渲染,下方dev里的entranceFee会被填充
        // console.log(entranceFee) //想要让入场费的更新得到网页的重新渲染的话还需要使用state钩子
    }

    //useEffect将会检查依赖数组中的值,如果这个依赖率有任何变化,它就会调用前面的函数然后重新渲染前端。
    //在这里,刷新页面相当于让Web3钱包的连接由假变真,我们的浏览器重新渲染
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    // 建立一个进入彩票的函数
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //指定网络Id
        functionName: "enterRaffle", //函数名字
        params: {}, //彩票合约没有参数
        msgValue: entranceFee,
    })

    //处理合约运行成功后续操作的函数(把交易作为自己的参数)
    const handleSuccess = async function (tx) {
        await tx.wait(1) //等待该交易通过
        handleNewNotification(tx) //交易通过后调用处理新的通知窗口
        updateUI() //自动渲染更新数据
    }

    const handleNewNotification = function () {
        //需要对象作为参数
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            Hi from lottery entrance!
            {/* 只要确实有raffleAddress，我们就可以调用该函数 */}
            {raffleAddress ? (
                <div className="">
                    <button
                        //hover:鼠标悬停;font:字体;ml:margin left
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                //预防我们运行合约函数成功/失败的时候我们不知道,所以添加下面这两段代码自动执行成功/失败后程序要做的事情
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        desabled={isLoading || isFetching} //当交易正在获取(isFetching)或者正在加载(isLoading)的时候禁用此按钮
                    >
                        {isLoading || isFetching ? (
                            // 循环加载的样式
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>Entrance Fee:{ethers.utils.formatUnits(entranceFee, "ether")}ETH</div>
                    <div>Number Of Players:{numPlayers}</div>
                    <div>Recent Winner:{recentWinner}</div>
                    <div>WHATS UPPP</div>
                </div>
            ) : (
                <div>No Raffle Address Deteched</div>
            )}
        </div>
    )
}
