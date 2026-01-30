# Aleo Contract Deployment Guide

Since the `leo` CLI is not available in the current environment, you will need to compile and deploy the contract using an environment with the Leo toolchain installed, or use a web-based IDE.

## Prerequisites

1.  **Install Leo**: [Installation Guide](https://developer.aleo.org/leo/installation)
2.  **Install SnarkOS** (optional, for local node): [Installation Guide](https://developer.aleo.org/testnet/getting_started/installation)
3.  **Aleo Wallet**: You need an Aleo account with some testnet credits.

## Step 1: Build the Program

Navigate to the `contract` directory and build the project:

```bash
cd contract
leo build
```

This will create a `build/` directory containing `main.aleo`. This file contains the compiled Aleo Virtual Machine (AVM) instructions.

## Step 2: Deploy to Aleo Testnet

You can deploy using the command line:

```bash
# Replace PRIVATE_KEY with your actual private key
leo deploy credit_score.aleo --private-key APrivateKey1... \
  --query "https://api.explorer.aleo.org/v1" \
  --priority-fee 0 \
  --broadcast "https://api.explorer.aleo.org/v1/testnet3/transaction/broadcast" \
```

**Alternative: Using [Aleo Tools](https://aleo.tools/develop)**
1.  Copy the contents of `contract/build/main.aleo` (generated after build).
2.  Go to the "Deploy" tab on Aleo Tools.
3.  Paste the program code.
4.  Connect your wallet and sign the deployment transaction.

## Step 3: Update the Project

Once deployed, note the **Program ID** (e.g., `credit_score.aleo` or if you renamed it, `credit_score_v1.aleo`).

1.  Open `lib/constants.ts` (or where your config is).
2.  Update the `SCORING_CONFIG.CONTRACT_ADDRESS` with your deployed Program ID.

## Step 4: Interact via SDK

The project is already set up to generate proofs for this specific logic.

1.  **Fetching Inputs**: The `useWalletMetrics` hook gathers the raw data.
2.  **Generating Proof**: The `ProofGenerator` class (Stage 1.4) will take these inputs and the deployed program's keys to generate a ZK proof.
3.  **Submitting**: The `BlockchainAdapter` will broadcast the transaction.

## Troubleshooting

-   **Fee Errors**: Ensure your wallet has enough credits.
-   **Name Collisions**: `credit_score.aleo` might already be taken on mainnet/testnet. You may need to rename it in `program.json` and `main.leo` to something unique like `credit_score_<your_name>.aleo`.
