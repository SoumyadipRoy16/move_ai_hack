import asyncio
import os
import time
from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient
from aptos_sdk.transactions import (
    EntryFunction,
    TransactionArgument,
    TransactionPayload,
)
from aptos_sdk.type_tag import TypeTag, StructTag
from aptos_sdk.bcs import Serializer

# Configuration
NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1"  # Use testnet for testing
FAUCET_URL = "https://faucet.testnet.aptoslabs.com"  # Only used in testnet

# Contract configuration
CONTRACT_PATH = "coin.move"
MODULE_NAME = "meme_coin"
PACKAGE_NAME = "MemeCoin"  # Used for the built package metadata

# Coin parameters
COIN_NAME = "My Bonding Coin"
COIN_SYMBOL = "MBC"
INITIAL_PRICE = 10  # In APT (adjust as needed)
PRICE_FACTOR = 1000  # Adjust for curve steepness

class ContractDeployer:
    def __init__(self, node_url):
        self.client = RestClient(node_url)
        
        # Load or create account
        if os.path.exists("deployer_key.txt"):
            with open("deployer_key.txt", "r") as f:
                private_key_hex = f.read().strip()
                self.account = Account.load_key(private_key_hex)
        else:
            self.account = Account.generate()
            with open("deployer_key.txt", "w") as f:
                f.write(self.account.private_key.hex())
        
        print(f"Using account: {self.account.address()}")
        
    async def fund_account_if_needed(self, faucet_url=None):
        """Fund the account on testnet if needed"""
        if faucet_url:
            balance = await self.client.account_balance(self.account.address())
            if balance < 100_000_000:  # Less than 1 APT
                
                print("Funding account from faucet...")
                import requests
                
                # Serialize address for faucet
                serializer = Serializer()
                self.account.address().serialize(serializer)
                address = serializer.output().hex()
                
                # Request funds
                response = requests.post(
                    f"{faucet_url}/mint?address={address}&amount=100000000"
                )
                print(f"Faucet response: {response.status_code}")
                # print(f"Faucet response: {response.json()}")
                print(f"Faucet response: {response.text}")
                time.sleep(3)  # Wait for transaction to process
        
        balance = await self.client.account_balance(self.account.address())
        print(f"Account balance: {balance/100_000_000} APT")
        
        if balance == 0:
            raise Exception("Account has no funds. Please fund it before proceeding.")
    
    def compile_package(self):
        """Compile the Move package"""
        print("Compiling Move package...")
        
        # Create a temporary directory structure for the package
        os.makedirs("temp_package/sources", exist_ok=True)
        
        # Copy the contract file
        with open(CONTRACT_PATH, "r") as f:
            contract_code = f.read()
        
        # Replace placeholder address with actual address
        print(f"Replacing address with: {self.account.address()}")
        address = str(self.account.address())
        contract_code = contract_code.replace("my_address", address)
        # contract_code = contract_code.replace(f"@{address}", f"
        
        # Write updated contract
        with open(f"temp_package/sources/{MODULE_NAME}.move", "w") as f:
            f.write(contract_code)
        
        # Create Move.toml
        with open("temp_package/Move.toml", "w") as f:
            f.write(f"""[package]
name = "{PACKAGE_NAME}"
version = "1.0.0"

[addresses]
deployer = "{address}"

[dependencies]
AptosFramework = {{ git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework", rev = "devnet" }}
""")
        
        # Run aptos CLI to compile
        os.system(f"cd temp_package && aptos move compile --named-addresses deployer={self.account.address()} --save-metadata")
        
        if not os.path.exists("temp_package/build"):
            raise Exception("Compilation failed. Make sure 'aptos' CLI is installed and in PATH.")
        
        print("Compilation successful!")
    
    async def publish_package(self):
        """Publish the compiled package to the blockchain"""
        print("Publishing package...")
        
        # Get metadata from the built package
        metadata_path = "temp_package/build/MemeCoin/package-metadata.bcs"
        with open(metadata_path, "rb") as f:
            metadata_bytes = f.read()
        
        # Get module bytecode
        module_path = f"temp_package/build/MemeCoin/bytecode_modules/{MODULE_NAME}.mv"
        with open(module_path, "rb") as f:
            module_bytes = f.read()
        
        # Prepare code publish transaction
        
        code_publish_txn = EntryFunction.natural(
            "0x1::code",
            "publish_package_txn",
            [],
            [
                TransactionArgument(metadata_bytes, Serializer.to_bytes),
                TransactionArgument([module_bytes], Serializer.sequence_serializer(Serializer.to_bytes)),
            ],
        )
        
        # Sign and submit transaction
        signed_txn = await self.client.create_bcs_signed_transaction(
            self.account, TransactionPayload(code_publish_txn)
        )
        tx_hash = await self.client.submit_bcs_transaction(signed_txn)
        print(f"Published package. Transaction hash: {tx_hash}")
        
        # Wait for transaction
        await self.client.wait_for_transaction(tx_hash)
        print("Package published successfully!")
    
    async def initialize_coin(self, name, symbol, initial_price, price_factor):
        """Initialize the bonding curve coin with parameters"""
        print(f"Initializing coin with name: {name}, symbol: {symbol}...")
        
        # Prepare initialize transaction
        initialize_txn = EntryFunction.natural(
            f"{self.account.address()}::{MODULE_NAME}",
            "initialize",
            [],
            [
                TransactionArgument(name, Serializer.str),
                TransactionArgument(symbol, Serializer.str),
                TransactionArgument(initial_price, Serializer.u64),
                TransactionArgument(price_factor, Serializer.u64),
            ],
        )
        
        # Sign and submit transaction
        signed_txn = await self.client.create_bcs_signed_transaction(
            self.account, TransactionPayload(initialize_txn)
        )
        tx_hash = await self.client.submit_bcs_transaction(signed_txn)
        print(f"Initialized coin. Transaction hash: {tx_hash}")
        
        # Wait for transaction
        await self.client.wait_for_transaction(tx_hash)
        print("Coin initialized successfully!")
    
    async def deploy_contract(self, name, symbol, initial_price, price_factor, faucet_url=None):
        """Complete deployment process"""
        try:
            # Check account funds
            await self.fund_account_if_needed(faucet_url)
            
            # Compile and publish
            self.compile_package()
            await self.publish_package()
            
            # Initialize coin
            await self.initialize_coin(name, symbol, initial_price, price_factor)
            
            print("\n=== Deployment Complete ===")
            print(f"Contract deployed at: {self.account.address()}")
            print(f"Coin Name: {name}")
            print(f"Coin Symbol: {symbol}")
            print(f"Initial Price: {initial_price}")
            print(f"Price Factor: {price_factor}")
            print("\nTo mint tokens:")
            print(f"aptos move run --function-id {self.account.address()}::{MODULE_NAME}::mint_tokens --args u64:<amount>")
            
            # Clean up temporary files
            os.system("rm -rf temp_package")
            
            return str(self.account.address())
        
        except Exception as e:
            print(f"Deployment failed: {e}")
            raise

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Deploy Bonding Curve Coin")
    parser.add_argument("--network", choices=["mainnet", "testnet", "devnet", "local"], 
                        default="testnet", help="Network to deploy to")
    parser.add_argument("--name", default=COIN_NAME, help="Name of the coin")
    parser.add_argument("--symbol", default=COIN_SYMBOL, help="Symbol of the coin")
    parser.add_argument("--initial-price", type=int, default=INITIAL_PRICE, help="Initial price in APT")
    parser.add_argument("--price-factor", type=int, default=PRICE_FACTOR, help="Price factor for the curve")
    
    args = parser.parse_args()
    
    # Set network URLs
    if args.network == "mainnet":
        node_url = "https://fullnode.mainnet.aptoslabs.com/v1"
        faucet_url = None
    elif args.network == "testnet":
        node_url = "https://fullnode.testnet.aptoslabs.com/v1"
        faucet_url = "https://tap.testnet.adelabs.app"
    elif args.network == "devnet":
        node_url = "https://fullnode.devnet.aptoslabs.com/v1"
        faucet_url = "https://faucet.devnet.aptoslabs.com/"
    else:
        node_url = "http://localhost:8080/v1"
        faucet_url = "http://localhost:8081"
    
    # Deploy the contract
    deployer = ContractDeployer(node_url)
    asyncio.run(deployer.deploy_contract(
        args.name, 
        args.symbol, 
        args.initial_price, 
        args.price_factor,
        faucet_url
    ))