# Puzzle Wallet SDK Integration

This document describes the integration of Puzzle Wallet SDK into the ProofScore application.

## Overview

ProofScore now supports **Puzzle Wallet** for seamless Aleo blockchain interactions. The integration provides:

- ✅ Wallet connection and disconnection
- ✅ Account management
- ✅ Transaction signing
- ✅ Record management
- ✅ Event tracking

## Installation

The Puzzle Wallet SDK is already installed:

```bash
npm i @puzzlehq/sdk
```

## Architecture

### Provider Hierarchy

The application uses a multi-layered provider architecture:

```tsx
<PuzzleWalletProvider>          // Outermost: Puzzle SDK context
  <AleoWalletProvider>           // Aleo wallet adapter (Leo, Fox, etc.)
    <WalletProvider>             // Unified wallet interface
      <App />
    </WalletProvider>
  </AleoWalletProvider>
</PuzzleWalletProvider>
```

### Key Components

1. **PuzzleWalletProvider** (`app/layout.tsx`)
   - Wraps the entire application
   - Provides Puzzle SDK context to all components
   - Configured with app metadata

2. **usePuzzleWallet Hook** (`lib/hooks/usePuzzleWallet.ts`)
   - Custom hook wrapping Puzzle SDK hooks
   - Provides unified wallet interface
   - Handles connection state management

3. **WalletProvider** (`lib/providers/WalletProvider.tsx`)
   - Integrates Puzzle Wallet with existing architecture
   - Falls back to mock mode for development
   - Syncs Puzzle Wallet state with app state

## Usage

### Connecting a Wallet

```tsx
import { usePuzzleWallet } from '@/lib/hooks/usePuzzleWallet';

function MyComponent() {
  const { address, isConnected, connect, disconnect } = usePuzzleWallet();

  return (
    <div>
      {!isConnected ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

### Using Puzzle SDK Hooks Directly

```tsx
import { useAccount, useBalance, useRecords } from '@puzzlehq/sdk';

function WalletInfo() {
  const { account } = useAccount();
  const { data: balance } = useBalance();
  const { data: records } = useRecords();

  return (
    <div>
      <p>Address: {account?.address}</p>
      <p>Network: {account?.network}</p>
      <p>Balance: {balance?.values.private} microcredits</p>
      <p>Records: {records?.length}</p>
    </div>
  );
}
```

### Requesting Signatures

```tsx
import { useRequestSignature } from '@puzzlehq/sdk';

function SignMessage() {
  const { requestSignature } = useRequestSignature();

  const handleSign = async () => {
    const signature = await requestSignature({
      message: 'Sign this message to verify ownership',
    });
    console.log('Signature:', signature);
  };

  return <button onClick={handleSign}>Sign Message</button>;
}
```

### Creating Events (Transactions)

```tsx
import { useRequestCreateEvent } from '@puzzlehq/sdk';
import { EventType } from '@puzzlehq/types';

function CreateTransaction() {
  const { requestCreateEvent } = useRequestCreateEvent();

  const handleTransaction = async () => {
    const event = await requestCreateEvent({
      type: EventType.Execute,
      programId: 'credit_score.aleo',
      functionId: 'issue_credit',
      inputs: ['750u64', 'aleo1...'],
    });
    console.log('Event created:', event);
  };

  return <button onClick={handleTransaction}>Create Transaction</button>;
}
```

## Configuration

### App Metadata

The Puzzle Wallet provider is configured with app metadata in `app/layout.tsx`:

```tsx
<PuzzleWalletProvider>
  {/* App content */}
</PuzzleWalletProvider>
```

### Program Permissions

The `usePuzzleWallet` hook requests permissions for the credit score program:

```typescript
{
  dAppInfo: {
    name: 'ProofScore',
    description: 'Privacy-first Web3 credit scoring platform on Aleo blockchain',
  },
  permissions: {
    programIds: {
      [Network.AleoTestnet]: ['credit_score.aleo'],
    },
  },
}
```

## Development Mode

The wallet provider includes a fallback to mock mode when Puzzle Wallet is not available:

```typescript
try {
  await puzzleWallet.connect();
} catch (error) {
  // Fallback to mock mode for development
  console.warn('[Wallet] Puzzle Wallet not available, using mock mode');
  // ... mock implementation
}
```

## Testing

To test with Puzzle Wallet:

1. Install [Puzzle Wallet Extension](https://chromewebstore.google.com/detail/puzzle-wallet/fdchdcpieegfofnofhgdombfckhbcokj)
2. Create or import an Aleo account
3. Connect to the testnet
4. Visit the ProofScore app and click "Connect Wallet"
5. Approve the connection in Puzzle Wallet

## Resources

- [Puzzle SDK Documentation](https://docs.puzzle.online/)
- [Puzzle Wallet Chrome Extension](https://chromewebstore.google.com/detail/puzzle-wallet/fdchdcpieegfofnofhgdombfckhbcokj)
- [Puzzle Wallet iOS App](https://apps.apple.com/us/app/puzzle-aleo-wallet/id6450268321)
- [GitHub - Sample Repos](https://github.com/puzzlehq)

## Troubleshooting

### Wallet Not Connecting

1. Ensure Puzzle Wallet extension is installed
2. Check that you're on the correct network (testnet)
3. Try refreshing the page
4. Check browser console for errors

### Transaction Failures

1. Verify you have sufficient balance
2. Check program ID is correct
3. Ensure inputs are properly formatted
4. Review transaction in Puzzle Wallet UI

### Type Errors

If you encounter TypeScript errors:

1. Ensure `@puzzlehq/sdk` and `@puzzlehq/types` are up to date
2. Check that Network enum is imported from `@puzzlehq/types`
3. Verify programIds structure matches SDK requirements

## Next Steps

- [ ] Implement transaction signing for credit score issuance
- [ ] Add record management for credit scores
- [ ] Integrate event tracking for user actions
- [ ] Add balance checking before transactions
- [ ] Implement error handling for failed transactions
