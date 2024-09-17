import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    
    const USDC_Address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
    const ETHUSDCPAIR_Address = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";

    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";


    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const amountTokenDesired = ethers.parseUnits("10", 6); // USDC_Address has 6 decimals
    const amountTokenMin = ethers.parseUnits("7", 6);
    const amountETHMin = ethers.parseEther("0.05"); // Adjust this value based on current ETH/USDC_Address rate

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC_Address, impersonatedSigner);
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);
    const LP_ETH_Contract = await ethers.getContractAt("IERC20", ETHUSDCPAIR_Address, impersonatedSigner);

    
    // Approve spending
    await USDC_Contract.approve(ROUTER_ADDRESS, amountTokenDesired);

    // Check balances before
    const usdcBalBefore = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const ethBalBefore = await ethers.provider.getBalance(impersonatedSigner.address);
    const ETHUSDCBalBefore = await LP_ETH_Contract.balanceOf(impersonatedSigner.address)


    console.log("USDC_Address balance before:", ethers.formatUnits(usdcBalBefore, 6));
    console.log("ETH balance before:", ethers.formatEther(ethBalBefore));
    console.log("LP ETH token balance before liquidity", Number(ETHUSDCBalBefore));    
    
    // Add liquidity
    const addLiqTx = await ROUTER.addLiquidityETH(
        USDC_Address,
        amountTokenDesired,
        amountTokenMin,
        1,
        impersonatedSigner.address,
        deadline,
        { value: ethers.parseEther("0.1") } // Specify the amount of ETH to send
    );
    await addLiqTx.wait();

    // Check balances after
    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const ethBalAfter = await ethers.provider.getBalance(impersonatedSigner.address);
    const ETHUSDCBalAfter = await LP_ETH_Contract.balanceOf(impersonatedSigner.address)

    console.log("USDC_Address balance after:", ethers.formatUnits(usdcBalAfter, 6));
    console.log("ETH balance after:", ethers.formatEther(ethBalAfter));
    console.log("USDC_Address used:", ethers.formatUnits(usdcBalBefore - usdcBalAfter, 6));
    console.log("ETH used:", ethers.formatEther(ethBalBefore - ethBalAfter));
    console.log("LP ETH token balance after liquidity", Number(ETHUSDCBalAfter));
    console.log("=========================================================");

    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
