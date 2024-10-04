import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const prayerAddress = ['0x2Bb1d6dc9c6Bda9e4135b505Fce8c9448Bad6545','0x377857Ac4E256f7D5f986Fac4b4Dd7F9fEb55a41','0x98fD8eF355F6957b29d04369bA2F12EF9646d0f0','0xE6A3Aa7Ba51aa6D8013cb9f6CF837E4AFB475892'];
const ludoGameModule = buildModule("ludoGameModule", (m) => {

    const ludo = m.contract("LudoGame", [prayerAddress]);

    return { ludo };
});

export default ludoGameModule;
