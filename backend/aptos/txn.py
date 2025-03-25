import asyncio
from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient
from aptos_sdk.transactions import EntryFunction, TransactionArgument, TransactionPayload
from aptos_sdk.type_tag import TypeTag, StructTag
from aptos_sdk.bcs import Serializer

async def send_apt(
    private_key_hex: str,
    recipient_address: str,
    amount: float,
    node_url: str = "https://fullnode.devnet.aptoslabs.com/v1"
):
    amount_in_octas = int(amount * 100000000)
    
    rest_client = RestClient(node_url)
    
    sender = Account.load_key(private_key_hex)
    print(f"Sender address: {sender.address()}")
    
    payload = EntryFunction.natural(
        "0x1::coin", 
        "transfer",  
        [TypeTag(StructTag.from_str("0x1::aptos_coin::AptosCoin"))],  
        [
            TransactionArgument(bytes.fromhex(recipient_address[2:]), Serializer.fixed_bytes), 
            TransactionArgument(amount_in_octas, Serializer.u64) 
        ]
    )
    
    signed_transaction = await rest_client.create_bcs_signed_transaction(
        sender, TransactionPayload(payload)
    )
    
    tx_hash = await rest_client.submit_bcs_transaction(signed_transaction)
    print(f"Transaction submitted: {tx_hash}")
    
    await rest_client.wait_for_transaction(tx_hash)
    print(f"Transaction confirmed: {tx_hash}")
    
    return tx_hash

if __name__ == "__main__":
    private_key = "0xcb106e37d31d98ee1d25179ef5f939019aff8e69af2a1f63d12802a5f0b3ed08"
    recipient = "0x5230e5671a286097e5738728171bcafa66af9c6f1a96540b0b42b089d4915157"
    apt_amount = 1.4
    
    
    tx_hash = asyncio.run(send_apt(private_key, recipient, apt_amount))
    print(f"Successfully sent {apt_amount} APT. Transaction hash: {tx_hash}")