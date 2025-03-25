module my_address::KeyMap {
    use std::signer;
    use aptos_framework::account;
    use aptos_std::table::{Self, Table};
    use aptos_framework::timestamp;
    
    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_NO_ACTIVE_SESSION: u64 = 2;
    
    struct KeyStorage has key {
        owner: address,
        encrypted_keys: Table<address, vector<u8>>,
        // Temporary access tokens with expiration
        active_sessions: Table<address, u64>, // address -> expiration timestamp
    }
    
    // Initialize module storage
    public entry fun initialize(account: &signer) {
        let owner_address = signer::address_of(account);
        move_to(account, KeyStorage {
            owner: owner_address,
            encrypted_keys: table::new(),
            active_sessions: table::new(),
        });
    }
    
    // Step 1: Authenticated function to request access (requires transaction)
    public entry fun request_access(account: &signer) acquires KeyStorage {
        let storage = borrow_global_mut<KeyStorage>(@my_address);
        let requester = signer::address_of(account);
        
        // Verify the requester is the owner
        assert!(requester == storage.owner, E_NOT_AUTHORIZED);
        
        // Grant temporary access (with timestamp expiration)
        let current_time = timestamp::now_seconds();
        let expiration = current_time + 300; // 5 minutes
        table::upsert(&mut storage.active_sessions, requester, expiration);
    }
    
    // Step 2: View function to retrieve keys (no signer required)
    #[view]
    public fun get_encrypted_keys(requester: address, user_address: address): vector<u8> acquires KeyStorage {
        let storage = borrow_global<KeyStorage>(@my_address);
        
        // Verify requester has an active session
        assert!(table::contains(&storage.active_sessions, requester), E_NO_ACTIVE_SESSION);
        
        // Verify session hasn't expired
        let expiration = *table::borrow(&storage.active_sessions, requester);
        let current_time = timestamp::now_seconds();
        assert!(current_time <= expiration, E_NO_ACTIVE_SESSION);
        
        // Return the encrypted keys
        *table::borrow(&storage.encrypted_keys, user_address)
    }
    
    // Store encrypted keys for a user
    public entry fun store_keys(
        account: &signer, 
        user_address: address, 
        encrypted_key_data: vector<u8>
    ) acquires KeyStorage {
        let storage = borrow_global_mut<KeyStorage>(@my_address);
        let requester = signer::address_of(account);
        
        // Verify the requester is the owner
        assert!(requester == storage.owner, E_NOT_AUTHORIZED);
        
        // Store the encrypted keys
        table::upsert(&mut storage.encrypted_keys, user_address, encrypted_key_data);
    }
}