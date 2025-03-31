import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'

import { config as dotenvConf } from "dotenv";
dotenvConf();

import ManagerABI from '../foundry/out/Manager.sol/Manager.json';
import AgencyABI from '../foundry/out/Agency.sol/Agency.json';
import CoproABI from '../foundry/out/Copro.sol/Copro.json';
import FractionalABI from '../foundry/out/FractionalToken.sol/FractionalToken.json';
import { type Abi } from 'viem';

export default defineConfig({
  out: 'src/contracts/generatedContracts.ts',
  contracts: [
    { name: 'Manager', abi: ManagerABI.abi as Abi, address: process.env.NEXT_PUBLIC_MANAGER as `0x${string}`},
    { name: 'Agency', abi: AgencyABI.abi as Abi, address: process.env.NEXT_PUBLIC_AGENCY as `0x${string}` },
    { name: 'Copro', abi: CoproABI.abi as Abi, address: process.env.NEXT_PUBLIC_COPRO as `0x${string}` },
    { name: 'Fractional', abi: FractionalABI.abi as Abi, address: process.env.NEXT_PUBLIC_FRACTIONAL as `0x${string}` },
  ],
  plugins: [react()],
})
