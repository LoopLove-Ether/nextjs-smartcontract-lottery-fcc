//imports与我们的前端一起工作
//nodeJS != JavaScript
//后端的JS与前端的JS有着一些不同
import Head from "next/head"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader" //导入
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Our Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* 添加 */}
            <Header />
            <LotteryEntrance />
            {/* <ManualHeader /> */}
            {/*创建一个标题/连接按钮/导航栏(说白了就是页眉) */}
        </div>
    )
}
