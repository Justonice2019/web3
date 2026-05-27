import {Web3Provider} from "./components/Web3Provider";
import type {Metadata} from "next";


export const metadata: Metadata = {
  title: '众筹活动',
  description: '一个在以太坊的众筹项目',
};

export default function RootLayout({children} : {
  children: React.ReactNode;
}) {
  return (<html>
  <body>
    <Web3Provider>
      {children}
    </Web3Provider>
  </body>
  </html>)
}