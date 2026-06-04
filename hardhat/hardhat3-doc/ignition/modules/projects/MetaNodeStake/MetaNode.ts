import {buildModule} from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('MetaNodeModule', m => {
    const metaNode =  m.contract('MetaNode', [
        'MetaNodeToken',
        'MNT'
    ])
    return {metaNode}
})
