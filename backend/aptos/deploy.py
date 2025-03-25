import os
import time
import asyncio
from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient, FaucetClient
from aptos_sdk.bcs import Serializer
from aptos_sdk.transactions import (
    EntryFunction,
    TransactionArgument,
    TransactionPayload
)
from aptos_sdk.type_tag import TypeTag, StructTag
from dotenv import load_dotenv
from aptos import generate_account
from aptos_sdk.transactions import ed25519
# Load environment variables (you'll need to create a .env file with PRIVATE_KEY)
load_dotenv()

# Constants
DEVNET_URL = "https://fullnode.devnet.aptoslabs.com/v1"
FAUCET_URL = "https://faucet.devnet.aptoslabs.com"
CONTRACT_PATH = "dynamic_token.move"
PACKAGE_DIR = "bonding_curve_token"
BUILD_DIR = "build"

async def register_account(private_key_hex: str, account_address: str):
    private_key = ed25519.PrivateKey.from_hex(private_key_hex)
    account = Account(account_address, private_key)
    sender = Account.load_key(private_key_hex)

    client = RestClient(DEVNET_URL)
    faucet_client = FaucetClient(FAUCET_URL, client)

    print("Funding account...")
    await faucet_client.fund_account(account.address(), 100000000)  # 1 APT

    print("Registering account on-chain...")
    print("Account address: ", account.address())
    print("Account address: ", account_address)
    payload = EntryFunction.natural(
        "0x1::coin",
        "transfer",
        [TypeTag(StructTag.from_str("0x1::aptos_coin::AptosCoin"))],
        [
            TransactionArgument(bytes.fromhex(account_address), Serializer.fixed_bytes),
            TransactionArgument(int(100000000), Serializer.u64)
        ]
    )
    print("Payload prepared")
    signed_transaction = await client.create_bcs_signed_transaction(sender, TransactionPayload(payload))
    print("Signed transaction created")
    txn = await client.submit_bcs_transaction(signed_transaction)
    print("Transaction submitted")
    await client.wait_for_transaction(txn)
    print("Transaction confirmed")

    print(f"Account {account_address} registered successfully!")

async def main():
    # Create REST client for devnet
    rest_client = RestClient(DEVNET_URL)
    private_key, public_key, account_address = generate_account()
    print("Generating account...")
    print(f"Private key: {private_key}")
    print(f"Public key: {public_key}")
    print(f"Account address: {account_address}")
    print("--------------------------------"*4)
    print("Registering account...")
    await register_account(private_key, account_address)
    print("--------------------------------"*4)
    # Create or load account from private key
    try:
        if private_key:
            account = Account.load_key(private_key)
            print(f"Loaded account: {account.address()}")
        else:
            # Create new account if no private key is provided
            account = Account.generate()
            print(f"Generated new account: {account.address()}")
            print(f"Private key: {account.private_key.hex()}")
    except Exception as e:
        print(f"Error creating account: {e}")
        return
    
    # Fund account using faucet
    try:
        print("Funding account from faucet...")
        rest_client.fund_account(account.address(), amount=100_000_000)  # 1 APT
        print("Account funded successfully")
    except Exception as e:
        print(f"Error funding account: {e}")
        print("Continuing anyway as the account might already have funds...")
    
    # Create directories for package
    os.makedirs(f"{PACKAGE_DIR}/sources", exist_ok=True)
    
    # Copy contract file to package directory
    with open(CONTRACT_PATH, "r") as source_file:
        contract_content = source_file.read()
    
    # Write to package directory
    with open(f"{PACKAGE_DIR}/sources/dynamic_token.move", "w") as dest_file:
        dest_file.write(contract_content)
    
    # Create Move.toml file
    with open(f"{PACKAGE_DIR}/Move.toml", "w") as toml_file:
        toml_file.write(f"""[package]
name = "bonding_curve_token"
version = "1.0.0"
authors = []

[addresses]
bonding_curve_token = "{account.address()}"

[dev-addresses]

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "devnet"
subdir = "aptos-move/framework/aptos-framework"
""")

    # Compile the contract
    try:
        print("Compiling contract...")
        os.system(f"aptos move compile --package-dir {PACKAGE_DIR} --save-metadata")
        print("Contract compiled successfully")
    except Exception as e:
        print(f"Error compiling contract: {e}")
        return
    
    # Publish the contract
    try:
        print("Publishing contract...")
        os.system(f"aptos move publish --package-dir {PACKAGE_DIR} --private-key {account.private_key.hex()} --url {DEVNET_URL}")
        print("Contract published successfully")
    except Exception as e:
        print(f"Error publishing contract: {e}")
        return
    
    # Initialize the token
    print("Initializing token...")
    try:
        # Wait a bit for the module to be available
        time.sleep(3)
        
        # Token parameters
        name = "DynamicToken"
        symbol = "DTK"
        decimals = 8
        base_price = 1000000  # 0.01 APT (Aptos has 8 decimals)
        price_increase_factor = 200000000  # 2x price increase at max supply
        max_supply = 1000000000000  # 10,000 tokens with 8 decimals
        
        # Create transaction payload for initialize function
        payload = EntryFunction.natural(
            f"{account.address()}::dynamic_token",
            "initialize",
            [],
            [
                TransactionArgument(name, Serializer.str),
                TransactionArgument(symbol, Serializer.str),
                TransactionArgument(decimals, Serializer.u8),
                TransactionArgument(base_price, Serializer.u64),
                TransactionArgument(price_increase_factor, Serializer.u64),
                TransactionArgument(max_supply, Serializer.u64),
            ]
        )
        
        # Send transaction
        signed_transaction = await rest_client.create_bcs_signed_transaction(
            account, TransactionPayload(payload)
        )
        tx_hash = await rest_client.submit_bcs_transaction(signed_transaction)
        await rest_client.wait_for_transaction(tx_hash)
        
        print(f"Token initialized successfully. Transaction hash: {tx_hash}")
        print(f"Contract deployed at address: {account.address()}")
        print(f"Resource account will be created during initialization")
        print("You can now interact with your bonding curve token!")
        
    except Exception as e:
        print(f"Error initializing token: {e}")
        return

if __name__ == "__main__":
    asyncio.run(main())