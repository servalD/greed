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
    inputs: [],
    name: 'clients',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
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
      { name: 'imageURL', internalType: 'string', type: 'string' },
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
    inputs: [{ name: '_client', internalType: 'address', type: 'address' }],
    name: 'revokeClient',
    outputs: [],
    stateMutability: 'nonpayable',
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

export const agencyAddress =
  '0xb93bc5dca936373D689B43E69531dc146B85e465' as const

export const agencyConfig = { address: agencyAddress, abi: agencyAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Copro
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const coproAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_manager',
        internalType: 'contract AccessManager',
        type: 'address',
      },
      { name: '_promoter', internalType: 'address', type: 'address' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: '_flatCount', internalType: 'uint96', type: 'uint96' },
      { name: '_SAFE', internalType: 'address payable', type: 'address' },
      { name: '_baseImageUrl', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'additionalCount', internalType: 'uint96', type: 'uint96' },
    ],
    name: 'addApartments',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'additionalFlats',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'baseImageUrl',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
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
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'fractionalTokenForNFT',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'ftName', internalType: 'string', type: 'string' },
      { name: 'ftSymbol', internalType: 'string', type: 'string' },
      { name: 'coOwners', internalType: 'address[]', type: 'address[]' },
      { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fractionalize',
    outputs: [
      { name: '', internalType: 'contract FractionalToken', type: 'address' },
    ],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'initialFlats',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'promoter',
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
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenImages',
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
        name: 'startTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'additionalCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ApartmentsAdded',
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
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'fractionalTokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Fractionalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'imageUrl',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ImageSet',
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
  { type: 'error', inputs: [], name: 'AlreadyFractionalized' },
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
  { type: 'error', inputs: [], name: 'MustBeGreaterThan0' },
  { type: 'error', inputs: [], name: 'NotAuthorized' },
  { type: 'error', inputs: [], name: 'NotFlatOwner' },
  { type: 'error', inputs: [], name: 'SoldOutError' },
] as const

export const coproAddress =
  '0xbb8714eEA41A93b5690a40083b0F69449Eb5C503' as const

export const coproConfig = { address: coproAddress, abi: coproAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fractional
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fractionalAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'coOwners', internalType: 'address[]', type: 'address[]' },
      { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelSaleOrder',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'pricePerTokenInEther',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'listAllTokensForSale',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'seller', internalType: 'address', type: 'address' }],
    name: 'purchaseAllTokensFromSeller',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'saleOrders',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricePerToken', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'supply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
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
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'from',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ReceivedNFT',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SaleOrderCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'pricePerToken',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensListed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensPurchasedFromSeller',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [], name: 'InsufficientFunds' },
  { type: 'error', inputs: [], name: 'NoSaleActive' },
  { type: 'error', inputs: [], name: 'NoTokenToList' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
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
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getRole',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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

export const managerAddress =
  '0x204bc79b54180af9355ef09AC4851F814Dd4eE3e' as const

export const managerConfig = {
  address: managerAddress,
  abi: managerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__
 */
export const useReadAgency = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  address: agencyAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"authority"`
 */
export const useReadAgencyAuthority = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'authority',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"clients"`
 */
export const useReadAgencyClients = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'clients',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"copros"`
 */
export const useReadAgencyCopros = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'copros',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"getCoproById"`
 */
export const useReadAgencyGetCoproById = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'getCoproById',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"getCoproByName"`
 */
export const useReadAgencyGetCoproByName = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'getCoproByName',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"getCopros"`
 */
export const useReadAgencyGetCopros = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'getCopros',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"guests"`
 */
export const useReadAgencyGuests = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'guests',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadAgencyIsConsumingScheduledOp =
  /*#__PURE__*/ createUseReadContract({
    abi: agencyAbi,
    address: agencyAddress,
    functionName: 'isConsumingScheduledOp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"nbListedCopro"`
 */
export const useReadAgencyNbListedCopro = /*#__PURE__*/ createUseReadContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'nbListedCopro',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__
 */
export const useWriteAgency = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  address: agencyAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"GuestEntrance"`
 */
export const useWriteAgencyGuestEntrance = /*#__PURE__*/ createUseWriteContract(
  { abi: agencyAbi, address: agencyAddress, functionName: 'GuestEntrance' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"acceptClient"`
 */
export const useWriteAgencyAcceptClient = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'acceptClient',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"createCopro"`
 */
export const useWriteAgencyCreateCopro = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'createCopro',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"hireAgent"`
 */
export const useWriteAgencyHireAgent = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'hireAgent',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"revokeClient"`
 */
export const useWriteAgencyRevokeClient = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'revokeClient',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteAgencySetAuthority = /*#__PURE__*/ createUseWriteContract({
  abi: agencyAbi,
  address: agencyAddress,
  functionName: 'setAuthority',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__
 */
export const useSimulateAgency = /*#__PURE__*/ createUseSimulateContract({
  abi: agencyAbi,
  address: agencyAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"GuestEntrance"`
 */
export const useSimulateAgencyGuestEntrance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    address: agencyAddress,
    functionName: 'GuestEntrance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"acceptClient"`
 */
export const useSimulateAgencyAcceptClient =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    address: agencyAddress,
    functionName: 'acceptClient',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"createCopro"`
 */
export const useSimulateAgencyCreateCopro =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    address: agencyAddress,
    functionName: 'createCopro',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"hireAgent"`
 */
export const useSimulateAgencyHireAgent =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    address: agencyAddress,
    functionName: 'hireAgent',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"revokeClient"`
 */
export const useSimulateAgencyRevokeClient =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    address: agencyAddress,
    functionName: 'revokeClient',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agencyAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateAgencySetAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agencyAbi,
    address: agencyAddress,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agencyAbi}__
 */
export const useWatchAgencyEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: agencyAbi,
  address: agencyAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agencyAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchAgencyAuthorityUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agencyAbi,
    address: agencyAddress,
    eventName: 'AuthorityUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agencyAbi}__ and `eventName` set to `"ClientAccepted"`
 */
export const useWatchAgencyClientAcceptedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agencyAbi,
    address: agencyAddress,
    eventName: 'ClientAccepted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__
 */
export const useReadCopro = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"additionalFlats"`
 */
export const useReadCoproAdditionalFlats = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'additionalFlats',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"approve"`
 */
export const useReadCoproApprove = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"authority"`
 */
export const useReadCoproAuthority = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'authority',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadCoproBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"baseImageUrl"`
 */
export const useReadCoproBaseImageUrl = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'baseImageUrl',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"fractionalTokenForNFT"`
 */
export const useReadCoproFractionalTokenForNft =
  /*#__PURE__*/ createUseReadContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'fractionalTokenForNFT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadCoproGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"history"`
 */
export const useReadCoproHistory = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'history',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"initialFlats"`
 */
export const useReadCoproInitialFlats = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'initialFlats',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadCoproIsApprovedForAll = /*#__PURE__*/ createUseReadContract(
  { abi: coproAbi, address: coproAddress, functionName: 'isApprovedForAll' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadCoproIsConsumingScheduledOp =
  /*#__PURE__*/ createUseReadContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'isConsumingScheduledOp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"market"`
 */
export const useReadCoproMarket = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'market',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"name"`
 */
export const useReadCoproName = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadCoproOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"promoter"`
 */
export const useReadCoproPromoter = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'promoter',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"proposals"`
 */
export const useReadCoproProposals = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'proposals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useReadCoproSafeTransferFrom = /*#__PURE__*/ createUseReadContract(
  { abi: coproAbi, address: coproAddress, functionName: 'safeTransferFrom' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useReadCoproSetApprovalForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadCoproSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadCoproSymbol = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"tokenImages"`
 */
export const useReadCoproTokenImages = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'tokenImages',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadCoproTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useReadCoproTransferFrom = /*#__PURE__*/ createUseReadContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__
 */
export const useWriteCopro = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  address: coproAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"addApartments"`
 */
export const useWriteCoproAddApartments = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'addApartments',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"buy"`
 */
export const useWriteCoproBuy = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'buy',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"cancelSale"`
 */
export const useWriteCoproCancelSale = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'cancelSale',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"fractionalize"`
 */
export const useWriteCoproFractionalize = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'fractionalize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteCoproSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"sell"`
 */
export const useWriteCoproSell = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'sell',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteCoproSetAuthority = /*#__PURE__*/ createUseWriteContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'setAuthority',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__
 */
export const useSimulateCopro = /*#__PURE__*/ createUseSimulateContract({
  abi: coproAbi,
  address: coproAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"addApartments"`
 */
export const useSimulateCoproAddApartments =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'addApartments',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"buy"`
 */
export const useSimulateCoproBuy = /*#__PURE__*/ createUseSimulateContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'buy',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"cancelSale"`
 */
export const useSimulateCoproCancelSale =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'cancelSale',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"fractionalize"`
 */
export const useSimulateCoproFractionalize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'fractionalize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateCoproSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"sell"`
 */
export const useSimulateCoproSell = /*#__PURE__*/ createUseSimulateContract({
  abi: coproAbi,
  address: coproAddress,
  functionName: 'sell',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coproAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateCoproSetAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coproAbi,
    address: coproAddress,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__
 */
export const useWatchCoproEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: coproAbi,
  address: coproAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"ApartmentsAdded"`
 */
export const useWatchCoproApartmentsAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'ApartmentsAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchCoproApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchCoproApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchCoproAuthorityUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'AuthorityUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"ConsecutiveTransfer"`
 */
export const useWatchCoproConsecutiveTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'ConsecutiveTransfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"FlatMinted"`
 */
export const useWatchCoproFlatMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'FlatMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"FlatRecovered"`
 */
export const useWatchCoproFlatRecoveredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'FlatRecovered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"Fractionalized"`
 */
export const useWatchCoproFractionalizedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'Fractionalized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"ImageSet"`
 */
export const useWatchCoproImageSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'ImageSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coproAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchCoproTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coproAbi,
    address: coproAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__
 */
export const useReadFractional = /*#__PURE__*/ createUseReadContract({
  abi: fractionalAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadFractionalAllowance = /*#__PURE__*/ createUseReadContract({
  abi: fractionalAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadFractionalBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: fractionalAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadFractionalDecimals = /*#__PURE__*/ createUseReadContract({
  abi: fractionalAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"name"`
 */
export const useReadFractionalName = /*#__PURE__*/ createUseReadContract({
  abi: fractionalAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"owner"`
 */
export const useReadFractionalOwner = /*#__PURE__*/ createUseReadContract({
  abi: fractionalAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"saleOrders"`
 */
export const useReadFractionalSaleOrders = /*#__PURE__*/ createUseReadContract({
  abi: fractionalAbi,
  functionName: 'saleOrders',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"supply"`
 */
export const useReadFractionalSupply = /*#__PURE__*/ createUseReadContract({
  abi: fractionalAbi,
  functionName: 'supply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadFractionalSymbol = /*#__PURE__*/ createUseReadContract({
  abi: fractionalAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadFractionalTotalSupply = /*#__PURE__*/ createUseReadContract(
  { abi: fractionalAbi, functionName: 'totalSupply' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__
 */
export const useWriteFractional = /*#__PURE__*/ createUseWriteContract({
  abi: fractionalAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteFractionalApprove = /*#__PURE__*/ createUseWriteContract({
  abi: fractionalAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"cancelSaleOrder"`
 */
export const useWriteFractionalCancelSaleOrder =
  /*#__PURE__*/ createUseWriteContract({
    abi: fractionalAbi,
    functionName: 'cancelSaleOrder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"listAllTokensForSale"`
 */
export const useWriteFractionalListAllTokensForSale =
  /*#__PURE__*/ createUseWriteContract({
    abi: fractionalAbi,
    functionName: 'listAllTokensForSale',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteFractionalMint = /*#__PURE__*/ createUseWriteContract({
  abi: fractionalAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useWriteFractionalOnErc721Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: fractionalAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"purchaseAllTokensFromSeller"`
 */
export const useWriteFractionalPurchaseAllTokensFromSeller =
  /*#__PURE__*/ createUseWriteContract({
    abi: fractionalAbi,
    functionName: 'purchaseAllTokensFromSeller',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteFractionalRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: fractionalAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteFractionalTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: fractionalAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteFractionalTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: fractionalAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteFractionalTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: fractionalAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__
 */
export const useSimulateFractional = /*#__PURE__*/ createUseSimulateContract({
  abi: fractionalAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateFractionalApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"cancelSaleOrder"`
 */
export const useSimulateFractionalCancelSaleOrder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'cancelSaleOrder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"listAllTokensForSale"`
 */
export const useSimulateFractionalListAllTokensForSale =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'listAllTokensForSale',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateFractionalMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useSimulateFractionalOnErc721Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"purchaseAllTokensFromSeller"`
 */
export const useSimulateFractionalPurchaseAllTokensFromSeller =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'purchaseAllTokensFromSeller',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateFractionalRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateFractionalTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateFractionalTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link fractionalAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateFractionalTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: fractionalAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fractionalAbi}__
 */
export const useWatchFractionalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: fractionalAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fractionalAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchFractionalApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fractionalAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fractionalAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchFractionalOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fractionalAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fractionalAbi}__ and `eventName` set to `"ReceivedNFT"`
 */
export const useWatchFractionalReceivedNftEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fractionalAbi,
    eventName: 'ReceivedNFT',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fractionalAbi}__ and `eventName` set to `"SaleOrderCanceled"`
 */
export const useWatchFractionalSaleOrderCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fractionalAbi,
    eventName: 'SaleOrderCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fractionalAbi}__ and `eventName` set to `"TokensListed"`
 */
export const useWatchFractionalTokensListedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fractionalAbi,
    eventName: 'TokensListed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fractionalAbi}__ and `eventName` set to `"TokensPurchasedFromSeller"`
 */
export const useWatchFractionalTokensPurchasedFromSellerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fractionalAbi,
    eventName: 'TokensPurchasedFromSeller',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link fractionalAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchFractionalTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: fractionalAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__
 */
export const useReadManager = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"ADMIN_ROLE"`
 */
export const useReadManagerAdminRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"PUBLIC_ROLE"`
 */
export const useReadManagerPublicRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'PUBLIC_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"canCall"`
 */
export const useReadManagerCanCall = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'canCall',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"expiration"`
 */
export const useReadManagerExpiration = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'expiration',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getAccess"`
 */
export const useReadManagerGetAccess = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'getAccess',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getNonce"`
 */
export const useReadManagerGetNonce = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'getNonce',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getRole"`
 */
export const useReadManagerGetRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'getRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadManagerGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getRoleGrantDelay"`
 */
export const useReadManagerGetRoleGrantDelay =
  /*#__PURE__*/ createUseReadContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'getRoleGrantDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getRoleGuardian"`
 */
export const useReadManagerGetRoleGuardian =
  /*#__PURE__*/ createUseReadContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'getRoleGuardian',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getSchedule"`
 */
export const useReadManagerGetSchedule = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'getSchedule',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getTargetAdminDelay"`
 */
export const useReadManagerGetTargetAdminDelay =
  /*#__PURE__*/ createUseReadContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'getTargetAdminDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"getTargetFunctionRole"`
 */
export const useReadManagerGetTargetFunctionRole =
  /*#__PURE__*/ createUseReadContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'getTargetFunctionRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadManagerHasRole = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"hashOperation"`
 */
export const useReadManagerHashOperation = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'hashOperation',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"isTargetClosed"`
 */
export const useReadManagerIsTargetClosed = /*#__PURE__*/ createUseReadContract(
  { abi: managerAbi, address: managerAddress, functionName: 'isTargetClosed' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"minSetback"`
 */
export const useReadManagerMinSetback = /*#__PURE__*/ createUseReadContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'minSetback',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__
 */
export const useWriteManager = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addAgency"`
 */
export const useWriteManagerAddAgency = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'addAgency',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addAgent"`
 */
export const useWriteManagerAddAgent = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'addAgent',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addCopro"`
 */
export const useWriteManagerAddCopro = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'addCopro',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"cancel"`
 */
export const useWriteManagerCancel = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'cancel',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"consumeScheduledOp"`
 */
export const useWriteManagerConsumeScheduledOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'consumeScheduledOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteManagerExecute = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'execute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteManagerGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"labelRole"`
 */
export const useWriteManagerLabelRole = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'labelRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteManagerMulticall = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'multicall',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteManagerRenounceRole = /*#__PURE__*/ createUseWriteContract(
  { abi: managerAbi, address: managerAddress, functionName: 'renounceRole' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteManagerRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"schedule"`
 */
export const useWriteManagerSchedule = /*#__PURE__*/ createUseWriteContract({
  abi: managerAbi,
  address: managerAddress,
  functionName: 'schedule',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setGrantDelay"`
 */
export const useWriteManagerSetGrantDelay =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setGrantDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setRoleAdmin"`
 */
export const useWriteManagerSetRoleAdmin = /*#__PURE__*/ createUseWriteContract(
  { abi: managerAbi, address: managerAddress, functionName: 'setRoleAdmin' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setRoleGuardian"`
 */
export const useWriteManagerSetRoleGuardian =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setRoleGuardian',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetAdminDelay"`
 */
export const useWriteManagerSetTargetAdminDelay =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setTargetAdminDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetClosed"`
 */
export const useWriteManagerSetTargetClosed =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setTargetClosed',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetFunctionRole"`
 */
export const useWriteManagerSetTargetFunctionRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setTargetFunctionRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"updateAuthority"`
 */
export const useWriteManagerUpdateAuthority =
  /*#__PURE__*/ createUseWriteContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'updateAuthority',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__
 */
export const useSimulateManager = /*#__PURE__*/ createUseSimulateContract({
  abi: managerAbi,
  address: managerAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addAgency"`
 */
export const useSimulateManagerAddAgency =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'addAgency',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addAgent"`
 */
export const useSimulateManagerAddAgent =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'addAgent',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"addCopro"`
 */
export const useSimulateManagerAddCopro =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'addCopro',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"cancel"`
 */
export const useSimulateManagerCancel = /*#__PURE__*/ createUseSimulateContract(
  { abi: managerAbi, address: managerAddress, functionName: 'cancel' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"consumeScheduledOp"`
 */
export const useSimulateManagerConsumeScheduledOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'consumeScheduledOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateManagerExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateManagerGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"labelRole"`
 */
export const useSimulateManagerLabelRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'labelRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateManagerMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateManagerRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateManagerRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"schedule"`
 */
export const useSimulateManagerSchedule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'schedule',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setGrantDelay"`
 */
export const useSimulateManagerSetGrantDelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setGrantDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setRoleAdmin"`
 */
export const useSimulateManagerSetRoleAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setRoleAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setRoleGuardian"`
 */
export const useSimulateManagerSetRoleGuardian =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setRoleGuardian',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetAdminDelay"`
 */
export const useSimulateManagerSetTargetAdminDelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setTargetAdminDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetClosed"`
 */
export const useSimulateManagerSetTargetClosed =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setTargetClosed',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"setTargetFunctionRole"`
 */
export const useSimulateManagerSetTargetFunctionRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'setTargetFunctionRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link managerAbi}__ and `functionName` set to `"updateAuthority"`
 */
export const useSimulateManagerUpdateAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: managerAbi,
    address: managerAddress,
    functionName: 'updateAuthority',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__
 */
export const useWatchManagerEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: managerAbi,
  address: managerAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"OperationCanceled"`
 */
export const useWatchManagerOperationCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'OperationCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"OperationExecuted"`
 */
export const useWatchManagerOperationExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'OperationExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"OperationScheduled"`
 */
export const useWatchManagerOperationScheduledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'OperationScheduled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchManagerRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleGrantDelayChanged"`
 */
export const useWatchManagerRoleGrantDelayChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'RoleGrantDelayChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchManagerRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleGuardianChanged"`
 */
export const useWatchManagerRoleGuardianChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'RoleGuardianChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleLabel"`
 */
export const useWatchManagerRoleLabelEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'RoleLabel',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchManagerRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"TargetAdminDelayUpdated"`
 */
export const useWatchManagerTargetAdminDelayUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'TargetAdminDelayUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"TargetClosed"`
 */
export const useWatchManagerTargetClosedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'TargetClosed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link managerAbi}__ and `eventName` set to `"TargetFunctionRoleUpdated"`
 */
export const useWatchManagerTargetFunctionRoleUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: managerAbi,
    address: managerAddress,
    eventName: 'TargetFunctionRoleUpdated',
  })
