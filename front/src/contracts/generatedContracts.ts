import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Agency
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const agencyAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_manager', internalType: 'contract Manager', type: 'address' },
      { name: 'safe', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AGENCY_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AGENT_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLIENT_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CO_OWNER_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GuestEntrance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_client', internalType: 'address', type: 'address' }],
    name: 'acceptClient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'copros',
    outputs: [{ name: '', internalType: 'contract Copro', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'flatCount', internalType: 'uint96', type: 'uint96' },
      { name: 'promoter', internalType: 'address', type: 'address' },
    ],
    name: 'createCopro',
    outputs: [{ name: '', internalType: 'contract Copro', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'getCoproById',
    outputs: [{ name: '', internalType: 'contract Copro', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'getCoproByName',
    outputs: [{ name: '', internalType: 'contract Copro', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCopros',
    outputs: [
      { name: '', internalType: 'contract Copro[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'guests',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'hireAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isConsumingScheduledOp',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nbListedCopro',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newAuthority', internalType: 'address', type: 'address' },
    ],
    name: 'setAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AuthorityUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'client',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ClientAccepted',
  },
  {
    type: 'error',
    inputs: [{ name: 'authority', internalType: 'address', type: 'address' }],
    name: 'AccessManagedInvalidAuthority',
  },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'delay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'AccessManagedRequiredDelay',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'AccessManagedUnauthorized',
  },
  { type: 'error', inputs: [], name: 'AlreadyClient' },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'string', type: 'string' }],
    name: 'COLLECTION_NAME_ALREADY_EXISTS',
  },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'string', type: 'string' }],
    name: 'COLLECTION_NOT_FOUND',
  },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'string', type: 'string' }],
    name: 'COLLECTION_SYMBOL_ALREADY_EXISTS',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Copro
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const coproAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'manager',
        internalType: 'contract AccessManager',
        type: 'address',
      },
      { name: 'promoter', internalType: 'address', type: 'address' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: '_flatCount', internalType: 'uint96', type: 'uint96' },
      { name: '_SAFE', internalType: 'address payable', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AGENCY_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AGENT_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLIENT_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CO_OWNER_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelSale',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'flatCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'history',
    outputs: [
      { name: 'part', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isConsumingScheduledOp',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'market',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposals',
    outputs: [
      { name: 'part', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sell',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newAuthority', internalType: 'address', type: 'address' },
    ],
    name: 'setAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AuthorityUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'fromTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'toTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'fromAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ConsecutiveTransfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FlatMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'FlatRecovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [{ name: 'authority', internalType: 'address', type: 'address' }],
    name: 'AccessManagedInvalidAuthority',
  },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'delay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'AccessManagedRequiredDelay',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'AccessManagedUnauthorized',
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  {
    type: 'error',
    inputs: [
      { name: 'batchSize', internalType: 'uint256', type: 'uint256' },
      { name: 'maxBatch', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721ExceededMaxBatchMint',
  },
  { type: 'error', inputs: [], name: 'ERC721ForbiddenBatchBurn' },
  { type: 'error', inputs: [], name: 'ERC721ForbiddenBatchMint' },
  { type: 'error', inputs: [], name: 'ERC721ForbiddenMint' },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
  { type: 'error', inputs: [], name: 'ExceedsMaxBatchSize' },
  { type: 'error', inputs: [], name: 'FlatNotForSale' },
  { type: 'error', inputs: [], name: 'InvalidAmount' },
  { type: 'error', inputs: [], name: 'InvalidFlatCount' },
  { type: 'error', inputs: [], name: 'NotFlatOwner' },
  { type: 'error', inputs: [], name: 'SoldOutError' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Manager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const managerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'initialAdmin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AGENCY_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AGENT_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLIENT_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CO_OWNER_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PUBLIC_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'agency', internalType: 'address', type: 'address' }],
    name: 'addAgency',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'agent', internalType: 'address', type: 'address' }],
    name: 'addAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'copro', internalType: 'address', type: 'address' }],
    name: 'addCopro',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'canCall',
    outputs: [
      { name: 'immediate', internalType: 'bool', type: 'bool' },
      { name: 'delay', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'consumeScheduledOp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'expiration',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'getAccess',
    outputs: [
      { name: 'since', internalType: 'uint48', type: 'uint48' },
      { name: 'currentDelay', internalType: 'uint32', type: 'uint32' },
      { name: 'pendingDelay', internalType: 'uint32', type: 'uint32' },
      { name: 'effect', internalType: 'uint48', type: 'uint48' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getNonce',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'roleId', internalType: 'uint64', type: 'uint64' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'roleId', internalType: 'uint64', type: 'uint64' }],
    name: 'getRoleGrantDelay',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'roleId', internalType: 'uint64', type: 'uint64' }],
    name: 'getRoleGuardian',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getSchedule',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'getTargetAdminDelay',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'getTargetFunctionRole',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'executionDelay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [
      { name: 'isMember', internalType: 'bool', type: 'bool' },
      { name: 'executionDelay', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'hashOperation',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'isTargetClosed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'label', internalType: 'string', type: 'string' },
    ],
    name: 'labelRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minSetback',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'when', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'schedule',
    outputs: [
      { name: 'operationId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'nonce', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'newDelay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setGrantDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'admin', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setRoleAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'guardian', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setRoleGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'newDelay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setTargetAdminDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'closed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setTargetClosed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setTargetFunctionRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'newAuthority', internalType: 'address', type: 'address' },
    ],
    name: 'updateAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operationId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'nonce', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'OperationCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operationId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'nonce', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'OperationExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operationId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'nonce', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'schedule',
        internalType: 'uint48',
        type: 'uint48',
        indexed: false,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'OperationScheduled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'admin', internalType: 'uint64', type: 'uint64', indexed: true },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'delay', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'since', internalType: 'uint48', type: 'uint48', indexed: false },
    ],
    name: 'RoleGrantDelayChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'delay', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'since', internalType: 'uint48', type: 'uint48', indexed: false },
      { name: 'newMember', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      {
        name: 'guardian',
        internalType: 'uint64',
        type: 'uint64',
        indexed: true,
      },
    ],
    name: 'RoleGuardianChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'label', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'RoleLabel',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'delay', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'since', internalType: 'uint48', type: 'uint48', indexed: false },
    ],
    name: 'TargetAdminDelayUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'closed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'TargetClosed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
    ],
    name: 'TargetFunctionRoleUpdated',
  },
  {
    type: 'error',
    inputs: [{ name: 'operationId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'AccessManagerAlreadyScheduled',
  },
  { type: 'error', inputs: [], name: 'AccessManagerBadConfirmation' },
  {
    type: 'error',
    inputs: [{ name: 'operationId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'AccessManagerExpired',
  },
  {
    type: 'error',
    inputs: [
      { name: 'initialAdmin', internalType: 'address', type: 'address' },
    ],
    name: 'AccessManagerInvalidInitialAdmin',
  },
  {
    type: 'error',
    inputs: [{ name: 'roleId', internalType: 'uint64', type: 'uint64' }],
    name: 'AccessManagerLockedRole',
  },
  {
    type: 'error',
    inputs: [{ name: 'operationId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'AccessManagerNotReady',
  },
  {
    type: 'error',
    inputs: [{ name: 'operationId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'AccessManagerNotScheduled',
  },
  {
    type: 'error',
    inputs: [
      { name: 'msgsender', internalType: 'address', type: 'address' },
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'AccessManagerUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'AccessManagerUnauthorizedCall',
  },
  {
    type: 'error',
    inputs: [
      { name: 'msgsender', internalType: 'address', type: 'address' },
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'AccessManagerUnauthorizedCancel',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AccessManagerUnauthorizedConsume',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__
 */
export const useReadAgency = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"AGENCY_ROLE"`
 */
export const useReadAgencyAgencyRole = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'AGENCY_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"AGENT_ROLE"`
 */
export const useReadAgencyAgentRole = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'AGENT_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"CLIENT_ROLE"`
 */
export const useReadAgencyClientRole = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'CLIENT_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"CO_OWNER_ROLE"`
 */
export const useReadAgencyCoOwnerRole = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'CO_OWNER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"authority"`
 */
export const useReadAgencyAuthority = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'authority',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"copros"`
 */
export const useReadAgencyCopros = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'copros',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"getCoproById"`
 */
export const useReadAgencyGetCoproById = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'getCoproById',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"getCoproByName"`
 */
export const useReadAgencyGetCoproByName = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'getCoproByName',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"getCopros"`
 */
export const useReadAgencyGetCopros = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'getCopros',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"guests"`
 */
export const useReadAgencyGuests = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'guests',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadAgencyIsConsumingScheduledOp =
  /*#__PURE__*/ createUseReadContract({
    abi: agencyAbi,
    functionName: 'isConsumingScheduledOp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"nbListedCopro"`
 */
export const useReadAgencyNbListedCopro = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  functionName: 'nbListedCopro',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__
 */
export const useWriteAgency = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"GuestEntrance"`
 */
export const useWriteAgencyGuestEntrance = /*#__PURE__*/ createUseWriteContract(
  { abi: agencyAbi, functionName: 'GuestEntrance' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"acceptClient"`
 */
export const useWriteAgencyAcceptClient = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  functionName: 'acceptClient',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"createCopro"`
 */
export const useWriteAgencyCreateCopro = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  functionName: 'createCopro',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"hireAgent"`
 */
export const useWriteAgencyHireAgent = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  functionName: 'hireAgent',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteAgencySetAuthority = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  functionName: 'setAuthority',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__
 */
export const useSimulateAgency = /*#__PURE__*/ createUseSimulateContract({
  abi: agencyAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"GuestEntrance"`
 */
export const useSimulateAgencyGuestEntrance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    functionName: 'GuestEntrance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"acceptClient"`
 */
export const useSimulateAgencyAcceptClient =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    functionName: 'acceptClient',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"createCopro"`
 */
export const useSimulateAgencyCreateCopro =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    functionName: 'createCopro',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"hireAgent"`
 */
export const useSimulateAgencyHireAgent =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    functionName: 'hireAgent',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateAgencySetAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agencyAbi}__
 */
export const useWatchAgencyEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: agencyAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agencyAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchAgencyAuthorityUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agencyAbi,
    eventName: 'AuthorityUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agencyAbi}__ and `eventName` set to `"ClientAccepted"`
 */
export const useWatchAgencyClientAcceptedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agencyAbi,
    eventName: 'ClientAccepted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__
 */
export const useReadCopro = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"AGENCY_ROLE"`
 */
export const useReadCoproAgencyRole = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'AGENCY_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"AGENT_ROLE"`
 */
export const useReadCoproAgentRole = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'AGENT_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"CLIENT_ROLE"`
 */
export const useReadCoproClientRole = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'CLIENT_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"CO_OWNER_ROLE"`
 */
export const useReadCoproCoOwnerRole = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'CO_OWNER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"approve"`
 */
export const useReadCoproApprove = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"authority"`
 */
export const useReadCoproAuthority = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'authority',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadCoproBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"flatCount"`
 */
export const useReadCoproFlatCount = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'flatCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadCoproGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"history"`
 */
export const useReadCoproHistory = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'history',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadCoproIsApprovedForAll = /*#__PURE__*/ createUseReadContract(
  { abi: coproAbi, functionName: 'isApprovedForAll' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadCoproIsConsumingScheduledOp =
  /*#__PURE__*/ createUseReadContract({
    abi: coproAbi,
    functionName: 'isConsumingScheduledOp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"market"`
 */
export const useReadCoproMarket = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'market',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"name"`
 */
export const useReadCoproName = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadCoproOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"proposals"`
 */
export const useReadCoproProposals = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'proposals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useReadCoproSafeTransferFrom = /*#__PURE__*/ createUseReadContract(
  { abi: coproAbi, functionName: 'safeTransferFrom' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useReadCoproSetApprovalForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: coproAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadCoproSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: coproAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadCoproSymbol = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadCoproTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useReadCoproTransferFrom = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__
 */
export const useWriteCopro = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"buy"`
 */
export const useWriteCoproBuy = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  functionName: 'buy',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"cancelSale"`
 */
export const useWriteCoproCancelSale = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  functionName: 'cancelSale',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteCoproSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: coproAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"sell"`
 */
export const useWriteCoproSell = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  functionName: 'sell',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteCoproSetAuthority = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  functionName: 'setAuthority',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__
 */
export const useSimulateCopro = /*#__PURE__*/ createUseSimulateContract({
  abi: coproAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"buy"`
 */
export const useSimulateCoproBuy = /*#__PURE__*/ createUseSimulateContract({
  abi: coproAbi,
  functionName: 'buy',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"cancelSale"`
 */
export const useSimulateCoproCancelSale =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coproAbi,
    functionName: 'cancelSale',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateCoproSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coproAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"sell"`
 */
export const useSimulateCoproSell = /*#__PURE__*/ createUseSimulateContract({
  abi: coproAbi,
  functionName: 'sell',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateCoproSetAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coproAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__
 */
export const useWatchCoproEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: coproAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchCoproApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchCoproApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchCoproAuthorityUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    eventName: 'AuthorityUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"ConsecutiveTransfer"`
 */
export const useWatchCoproConsecutiveTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    eventName: 'ConsecutiveTransfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"FlatMinted"`
 */
export const useWatchCoproFlatMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    eventName: 'FlatMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"FlatRecovered"`
 */
export const useWatchCoproFlatRecoveredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    eventName: 'FlatRecovered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchCoproTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__
 */
export const useReadManager = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"ADMIN_ROLE"`
 */
export const useReadManagerAdminRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"AGENCY_ROLE"`
 */
export const useReadManagerAgencyRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'AGENCY_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"AGENT_ROLE"`
 */
export const useReadManagerAgentRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'AGENT_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"CLIENT_ROLE"`
 */
export const useReadManagerClientRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'CLIENT_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"CO_OWNER_ROLE"`
 */
export const useReadManagerCoOwnerRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'CO_OWNER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"PUBLIC_ROLE"`
 */
export const useReadManagerPublicRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'PUBLIC_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"canCall"`
 */
export const useReadManagerCanCall = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'canCall',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"expiration"`
 */
export const useReadManagerExpiration = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'expiration',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getAccess"`
 */
export const useReadManagerGetAccess = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'getAccess',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getNonce"`
 */
export const useReadManagerGetNonce = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'getNonce',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadManagerGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getRoleGrantDelay"`
 */
export const useReadManagerGetRoleGrantDelay =
  /*#__PURE__*/ createUseReadContract({
    abi: managerAbi,
    functionName: 'getRoleGrantDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getRoleGuardian"`
 */
export const useReadManagerGetRoleGuardian =
  /*#__PURE__*/ createUseReadContract({
    abi: managerAbi,
    functionName: 'getRoleGuardian',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getSchedule"`
 */
export const useReadManagerGetSchedule = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'getSchedule',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getTargetAdminDelay"`
 */
export const useReadManagerGetTargetAdminDelay =
  /*#__PURE__*/ createUseReadContract({
    abi: managerAbi,
    functionName: 'getTargetAdminDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getTargetFunctionRole"`
 */
export const useReadManagerGetTargetFunctionRole =
  /*#__PURE__*/ createUseReadContract({
    abi: managerAbi,
    functionName: 'getTargetFunctionRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadManagerHasRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"hashOperation"`
 */
export const useReadManagerHashOperation = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'hashOperation',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"isTargetClosed"`
 */
export const useReadManagerIsTargetClosed = /*#__PURE__*/ createUseReadContract(
  { abi: managerAbi, functionName: 'isTargetClosed' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"minSetback"`
 */
export const useReadManagerMinSetback = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  functionName: 'minSetback',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__
 */
export const useWriteManager = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addAgency"`
 */
export const useWriteManagerAddAgency = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'addAgency',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addAgent"`
 */
export const useWriteManagerAddAgent = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'addAgent',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addCopro"`
 */
export const useWriteManagerAddCopro = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'addCopro',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"cancel"`
 */
export const useWriteManagerCancel = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"consumeScheduledOp"`
 */
export const useWriteManagerConsumeScheduledOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    functionName: 'consumeScheduledOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteManagerExecute = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteManagerGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"labelRole"`
 */
export const useWriteManagerLabelRole = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'labelRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteManagerMulticall = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'multicall',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteManagerRenounceRole = /*#__PURE__*/ createUseWriteContract(
  { abi: managerAbi, functionName: 'renounceRole' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteManagerRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"schedule"`
 */
export const useWriteManagerSchedule = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  functionName: 'schedule',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setGrantDelay"`
 */
export const useWriteManagerSetGrantDelay =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    functionName: 'setGrantDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setRoleAdmin"`
 */
export const useWriteManagerSetRoleAdmin = /*#__PURE__*/ createUseWriteContract(
  { abi: managerAbi, functionName: 'setRoleAdmin' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setRoleGuardian"`
 */
export const useWriteManagerSetRoleGuardian =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    functionName: 'setRoleGuardian',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetAdminDelay"`
 */
export const useWriteManagerSetTargetAdminDelay =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    functionName: 'setTargetAdminDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetClosed"`
 */
export const useWriteManagerSetTargetClosed =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    functionName: 'setTargetClosed',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetFunctionRole"`
 */
export const useWriteManagerSetTargetFunctionRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    functionName: 'setTargetFunctionRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"updateAuthority"`
 */
export const useWriteManagerUpdateAuthority =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    functionName: 'updateAuthority',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__
 */
export const useSimulateManager = /*#__PURE__*/ createUseSimulateContract({
  abi: managerAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addAgency"`
 */
export const useSimulateManagerAddAgency =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'addAgency',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addAgent"`
 */
export const useSimulateManagerAddAgent =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'addAgent',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addCopro"`
 */
export const useSimulateManagerAddCopro =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'addCopro',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"cancel"`
 */
export const useSimulateManagerCancel = /*#__PURE__*/ createUseSimulateContract(
  { abi: managerAbi, functionName: 'cancel' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"consumeScheduledOp"`
 */
export const useSimulateManagerConsumeScheduledOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'consumeScheduledOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateManagerExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateManagerGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"labelRole"`
 */
export const useSimulateManagerLabelRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'labelRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateManagerMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateManagerRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateManagerRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"schedule"`
 */
export const useSimulateManagerSchedule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'schedule',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setGrantDelay"`
 */
export const useSimulateManagerSetGrantDelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'setGrantDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setRoleAdmin"`
 */
export const useSimulateManagerSetRoleAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'setRoleAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setRoleGuardian"`
 */
export const useSimulateManagerSetRoleGuardian =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'setRoleGuardian',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetAdminDelay"`
 */
export const useSimulateManagerSetTargetAdminDelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'setTargetAdminDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetClosed"`
 */
export const useSimulateManagerSetTargetClosed =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'setTargetClosed',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetFunctionRole"`
 */
export const useSimulateManagerSetTargetFunctionRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'setTargetFunctionRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"updateAuthority"`
 */
export const useSimulateManagerUpdateAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    functionName: 'updateAuthority',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__
 */
export const useWatchManagerEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: managerAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"OperationCanceled"`
 */
export const useWatchManagerOperationCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'OperationCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"OperationExecuted"`
 */
export const useWatchManagerOperationExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'OperationExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"OperationScheduled"`
 */
export const useWatchManagerOperationScheduledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'OperationScheduled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchManagerRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleGrantDelayChanged"`
 */
export const useWatchManagerRoleGrantDelayChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'RoleGrantDelayChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchManagerRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleGuardianChanged"`
 */
export const useWatchManagerRoleGuardianChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'RoleGuardianChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleLabel"`
 */
export const useWatchManagerRoleLabelEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'RoleLabel',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchManagerRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"TargetAdminDelayUpdated"`
 */
export const useWatchManagerTargetAdminDelayUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'TargetAdminDelayUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"TargetClosed"`
 */
export const useWatchManagerTargetClosedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'TargetClosed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"TargetFunctionRoleUpdated"`
 */
export const useWatchManagerTargetFunctionRoleUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    eventName: 'TargetFunctionRoleUpdated',
  })
