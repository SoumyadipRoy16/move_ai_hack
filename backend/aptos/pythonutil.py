import subprocess
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Function to run Aptos CLI commands and parse JSON output
def run_aptos_cli(command):
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        print(f"Command output: {e.stderr}")
        return None

# Function to initialize the contract
async def initialize_contract(private_key):
    command = [
        "aptos", "move", "run",
        "--function-id", "0x84ccf8df567b9f98de8d0fa0449b2982ea9fb9641ee349be651c1219ea5e3dd3::KeyMap::initialize",
        "--private-key", private_key,
        "--url", "https://fullnode.devnet.aptoslabs.com/v1",
        "--assume-yes"
    ]
    return run_aptos_cli(command)

# Function to request access
async def request_access(private_key):
    command = [
        "aptos", "move", "run",
        "--function-id", "0x84ccf8df567b9f98de8d0fa0449b2982ea9fb9641ee349be651c1219ea5e3dd3::KeyMap::request_access",
        "--private-key", private_key,
        "--url", "https://fullnode.devnet.aptoslabs.com/v1",
        "--assume-yes"
    ]
    return run_aptos_cli(command)

# Function to store encrypted keys
async def store_keys(private_key, user_address, encrypted_key_data):
    command = [
        "aptos", "move", "run",
        "--function-id", "0x84ccf8df567b9f98de8d0fa0449b2982ea9fb9641ee349be651c1219ea5e3dd3::KeyMap::store_keys",
        "--args", f"address:{user_address}", f"hex:{encrypted_key_data}",
        "--private-key", private_key,
        "--url", "https://fullnode.devnet.aptoslabs.com/v1",
        "--assume-yes"
    ]
    return run_aptos_cli(command)

# Function to get encrypted keys
async def get_encrypted_keys(private_key, requester_address, user_address):
    command = [
        "aptos", "move", "view",
        "--function-id", "0x84ccf8df567b9f98de8d0fa0449b2982ea9fb9641ee349be651c1219ea5e3dd3::KeyMap::get_encrypted_keys",
        "--args", f"address:{requester_address}", f"address:{user_address}",
        "--private-key", private_key,
        "--url", "https://fullnode.devnet.aptoslabs.com/v1",
        "--assume-yes"
    ]
    return run_aptos_cli(command)

# Example usage
# if __name__ == "__main__":
#     # Load private key from .env file
#     private_key = os.getenv("PRIVATE_KEY")
#     if not private_key:
#         raise ValueError("PRIVATE_KEY not found in .env file")

#     # Example inputs
#     user_address = "0x692906717ffbfc458c597613e0dd42c8f18577d28c03d2fdb768a07aa0fee713"
#     encrypted_key_data = "0xcb106e37d31d98ee1d25179ef5f939019aff8e69af2a1f63d12802a5f0b3ed08"
#     requester_address = "0x84ccf8df567b9f98de8d0fa0449b2982ea9fb9641ee349be651c1219ea5e3dd3"

#     # Initialize the contract
#     # print("Initializing contract...")
#     # initialize_result = initialize_contract(private_key)
#     # print("Initialize Result:", json.dumps(initialize_result, indent=2))

#     # Request access
#     print("Requesting access...")
#     request_access_result = request_access(private_key)
#     print("Request Access Result:", json.dumps(request_access_result, indent=2))

#     # Store encrypted keys
#     print("Storing encrypted keys...")
#     store_keys_result = store_keys(private_key, user_address, encrypted_key_data)
#     print("Store Keys Result:", json.dumps(store_keys_result, indent=2))

#     # Get encrypted keys
#     print("Getting encrypted keys...")
#     get_keys_result = get_encrypted_keys(private_key, requester_address, user_address)
#     print("Get Encrypted Keys Result:", json.dumps(get_keys_result, indent=2))