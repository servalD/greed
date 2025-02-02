import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'

import { config as dotenvConf } from "dotenv";
dotenvConf();

import ManagerABI from '../foundry/out/Manager.sol/Manager.json';
import AgencyABI from '../foundry/out/Agency.sol/Agency.json';
import CoproABI from '../foundry/out/Copro.sol/Copro.json';

export default defineConfig({
  out: 'src/contracts/generatedContracts.ts',
  contracts: [
    { name: 'Manager', abi: ManagerABI.abi, address: process.env.NEXT_PUBLIC_MANAGER},
    { name: 'Agency', abi: AgencyABI.abi, address: process.env.NEXT_PUBLIC_AGENCY },
    { name: 'Copro', abi: CoproABI.abi, address: process.env.NEXT_PUBLIC_COPRO },
  ],
  plugins: [react()],
})
