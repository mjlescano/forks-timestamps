# Get Contract Timestamp

This project includes a simple Solidity contract to get the current value of `block.timestamp`. This was only necessary for a case were the forks I was using of Optimism on Tenderly had a different `timestamp` value between the last mined block and `block.timestamp`, which was returning `Date.now()`.
