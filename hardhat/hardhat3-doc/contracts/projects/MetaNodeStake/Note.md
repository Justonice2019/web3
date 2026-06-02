# MetaNodeStake.sol

## function updatePool(uint256 _pid)

当前池子总奖励 = 区块高度差 * 每个区块的奖励数 * 当前池子权重 / 总权重

totalMetaNode =  (block.number - pool_.lastRewardBlock ) * MetaNodePerBlock * pool_.poolWeight / totalPoolWeight
````
(bool success1, uint256 totalMetaNode) = getMultiplier( // 获取到 经过的区块数量
            pool_.lastRewardBlock,
            block.number
        ).tryMul(pool_.poolWeight);
(success1, totalMetaNode) = totalMetaNode.tryDiv(totalPoolWeight);
````

等同于 totalMetaNode / 10^18, 这是 Solidity 中的一个单位字面量，编译器会自动将它转换为 uint256 类型的整数 10^18。
````
(bool success2, uint256 totalMetaNode_) = totalMetaNode.tryMul(
                1 ether
            );
````

每个单位质押代币应得的奖励 = 当前池子总奖励 * 10^18 / 当前池子总代币质押量
totalMetaNode_ = totalMetaNode * 10^18 / pool_.stTokenAmount

````
   (success2, totalMetaNode_) = totalMetaNode_.tryDiv(stSupply);
            require(success2, "overflow");

            (bool success3, uint256 accMetaNodePerST) = pool_
                .accMetaNodePerST
                .tryAdd(totalMetaNode_);
            require(success3, "overflow");
            pool_.accMetaNodePerST = accMetaNodePerST;
````
