import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import ManagerABI from '../foundry/out/Manager.sol/Manager.json';
import AgencyABI from '../foundry/out/Agency.sol/Agency.json';
import CoproABI from '../foundry/out/Copro.sol/Copro.json';

export default defineConfig({
  out: 'src/contracts/generatedContracts.ts',
  contracts: [
    { name: 'Manager', abi: ManagerABI.abi },
    { name: 'Agency', abi: AgencyABI.abi },
    { name: 'Copro', abi: CoproABI.abi },
  ],
  plugins: [react()],
})
