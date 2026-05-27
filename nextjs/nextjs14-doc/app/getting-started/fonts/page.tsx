import { Geist, Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '800',
  subsets: ['latin'],
})

export default function Page() {
  return (<div>
    <div>默认字体</div>
    <div className={roboto.className}>Google 字体</div>
  </div>)
};