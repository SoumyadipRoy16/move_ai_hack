from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives import serialization
from hashlib import sha3_256


def generate_account():
    private_key = Ed25519PrivateKey.generate()
    private_key_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PrivateFormat.Raw,
        encryption_algorithm=serialization.NoEncryption()
    )

    public_key = private_key.public_key()
    public_key_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw
    )

    auth_key = sha3_256(public_key_bytes + b'\x00').digest()

    private_key_hex = private_key_bytes.hex()
    public_key_hex = public_key_bytes.hex()
    account_address_hex = auth_key.hex()
    return private_key_hex, public_key_hex, account_address_hex

# private_key_hex, public_key_hex, account_address_hex = generate_account()

# print("Private Key (hex):", private_key_hex)
# print("Public Key (hex):", public_key_hex)
# print("Account Address (hex):", f"0x{account_address_hex}")