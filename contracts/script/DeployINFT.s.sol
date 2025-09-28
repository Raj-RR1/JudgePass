// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/INFT.sol";

contract DeployINFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        INFT inft = new INFT("JudgePass INFT", "JPI");
        
        console.log("INFT deployed at:", address(inft));
        console.log("Owner:", inft.owner());

        vm.stopBroadcast();
    }
}
