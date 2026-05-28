import {ethers} from 'ethers'

export const toBytes = (val: any) => {
    const bytes = ethers.toUtf8Bytes(val)
    return ethers.hexlify(bytes)
}

export const strToBytes = (val: string) => {
    return '0x' + Array.from(val)
        .map((c: any) => c.charCodeAt(0).toString(16))
        .join('')
}