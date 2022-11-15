import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        // border
        <div className="p-5 border-b-2 flex flex-row">
            {/* padding */}
            <h1 className="py-4 px-4 font-blog text-3xl">Decentralized Lottery</h1>
            {/* button */}
            <div className="ml-auto py-2 px-4">
                {/*moralisAuth是可选钩子,可以进入服务器以向我们的网站添加更多的功能,我们不想挂接到服务器(因为我们想要一切都是开源的) */}
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
