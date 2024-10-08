import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    
    const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const ETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621"; 

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const amountOutETH = ethers.parseUnits("1", 18); 
    const amountInMaxUSDC = ethers.parseUnits("4000", 6); 

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC_ADDRESS, impersonatedSigner);
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    // Approve the router to spend USDC_ADDRESS
    await USDC_Contract.approve(ROUTER_ADDRESS, amountInMaxUSDC);

    const usdcBalBefore = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const ethBalBefore = await ethers.provider.getBalance(impersonatedSigner.address); 

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10); // 10 minutes from now

    console.log("USDC_ADDRESS balance before swap:", ethers.formatUnits(usdcBalBefore, 6));
    console.log("ETH_ADDRESS balance before swap:", ethers.formatUnits(ethBalBefore, 18));

    await ROUTER.swapTokensForExactETH(
        amountOutETH,         
        amountInMaxUSDC,     
        [USDC_ADDRESS, ETH_ADDRESS], 
        impersonatedSigner.address, 
        deadline              
    );

    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const ethBalAfter = await ethers.provider.getBalance(impersonatedSigner.address);

    console.log("=========================================================");

    console.log("USDC_ADDRESS balance after swap:", ethers.formatUnits(usdcBalAfter, 6));
    console.log("ETH_ADDRESS balance after swap:", ethers.formatUnits(ethBalAfter, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});