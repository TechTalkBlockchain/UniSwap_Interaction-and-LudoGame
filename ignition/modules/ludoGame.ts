import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ludoGameModule = buildModule("ludoGameModule", (m) => {

    const ludo = m.contract("ludoGame");

    return { ludo };
});

export default ludoGameModule;
