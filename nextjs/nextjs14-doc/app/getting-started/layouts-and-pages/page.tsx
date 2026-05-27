'use client'
import {useState} from 'react'

interface State {
  name: string,
  age: number,
}

export default function Page() {
  const [state] = useState<State>({
    name: "Tony",
    age: 34
  })
  return (<div>
    <div>名字: {state.name}</div>
    <div>年龄: {state.age}</div>
  </div>)
};