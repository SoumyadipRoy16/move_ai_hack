module my_address::meme_coin {
    use std::error;
    use std::signer;
    use std::string;
    use aptos_framework::coin::{Self, BurnCapability, FreezeCapability, MintCapability};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::math64;
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_std::fixed_point32;


    // Error codes
    const ERROR_NOT_OWNER: u64 = 1;
    const ERROR_INSUFFICIENT_PAYMENT: u64 = 2;
    const ERROR_INSUFFICIENT_SUPPLY: u64 = 3;

    /// Curve parameters for the bonding curve
    struct CurveParameters has key {
        initial_price: u64,  // Initial price in APT (scaled by PRICE_SCALE)
        price_factor: u64,   // Factor for logarithmic curve steepness
    }

    /// Represents the bonding curve coin we're creating
    struct MemeCoin {}

    /// Stores capabilities and metadata about the coin
    struct CoinCapabilities has key {
        mint_cap: MintCapability<MemeCoin>,
        burn_cap: BurnCapability<MemeCoin>,
        freeze_cap: FreezeCapability<MemeCoin>,
        supply: u64,
    }

    /// Events emitted by the contract
    struct BondingCurveEvents has key {
        mint_events: EventHandle<MintEvent>,
        burn_events: EventHandle<BurnEvent>,
    }

    /// Event emitted when tokens are minted
    struct MintEvent has drop, store {
        buyer: address,
        apt_paid: u64,
        tokens_received: u64,
        new_price: u64,
    }

    /// Event emitted when tokens are burned
    struct BurnEvent has drop, store {
        seller: address,
        tokens_burned: u64,
        apt_received: u64,
        new_price: u64,
    }

    // Constants
    const PRICE_SCALE: u64 = 1000000; // To handle decimal values (6 decimal places)
    const INITIAL_SUPPLY: u64 = 0;    // Start with 0 supply

    /// Initialize the bonding curve coin
    public entry fun initialize(
        account: &signer,
        name: string::String,
        symbol: string::String,
        initial_price: u64,
        price_factor: u64
    ) {
        let _account_addr = signer::address_of(account);
        
        // Register the coin with the account
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<MemeCoin>(
            account,
            name,
            symbol,
            8, // Decimals
            true // Configurable account registration
        );

        // Store capabilities
        move_to(account, CoinCapabilities {
            mint_cap,
            burn_cap,
            freeze_cap,
            supply: INITIAL_SUPPLY,
        });

        // Store bonding curve parameters
        move_to(account, CurveParameters {
            initial_price: initial_price * PRICE_SCALE, // Scale the price
            price_factor: price_factor,
        });

        // Initialize events
        move_to(account, BondingCurveEvents {
            mint_events: account::new_event_handle<MintEvent>(account),
            burn_events: account::new_event_handle<BurnEvent>(account),
        });
        
        // Register the coin in the account
        coin::register<MemeCoin>(account);
    }

    /// Calculate the current price based on the logarithmic bonding curve
    fun calculate_price(supply: u64, params: &CurveParameters): u64 {
        // For logarithmic bonding curve: P(s) = P0 * (1 + ln(1 + s/F))
        // Where:
        // - P0 is the initial price
        // - F is the price factor (steepness of the curve)
        // - s is the current supply
        
        let s_over_f = if (params.price_factor == 0) {
            0
        } else {
            (supply * PRICE_SCALE) / params.price_factor
        };

        // We add 1 inside log to avoid ln(0) and to ensure price always starts at initial_price
        let log_term = ln(PRICE_SCALE + s_over_f) / ln(10 * PRICE_SCALE); // Convert to base 10 for easier math
        
        // Calculate price: P0 * (1 + log_term)
        params.initial_price + ((params.initial_price * log_term) / PRICE_SCALE)
    }
    // Convert log2 to ln using the change of base formula
    // ln(x) = log2(x) / log2(e)
    // log2(e) ~ 1.4426950408889634
    fun ln(x: u64): u64 {
        let log2_e = 1442695; // log2(e) * 1,000,000 (scaled for fixed-point math)
        let log2_x = math64::log2(x); // This returns a FixedPoint32 value

        // Convert FixedPoint32 to u64 by multiplying with PRICE_SCALE and then dividing by 2^32
        let log2_x_scaled = (fixed_point32::get_raw_value(log2_x) * PRICE_SCALE) / 4294967296; // 2^32

        (log2_x_scaled * PRICE_SCALE) / log2_e
    }
    /// Calculate how many tokens a user will receive for a given payment
    fun calculate_tokens_to_mint(
        payment_amount: u64,
        current_supply: u64,
        params: &CurveParameters
    ): u64 {
        let current_price = calculate_price(current_supply, params);
        
        // Simple calculation to approximate tokens:
        // tokens = payment / price
        // This is simplified and not perfect for bonding curves, but works
        // as an approximation for reasonably small buys.
        (payment_amount * PRICE_SCALE) / current_price
    }

    /// Calculate how much APT a user will receive for burning tokens
    fun calculate_payment_for_burn(
        token_amount: u64,
        current_supply: u64,
        params: &CurveParameters
    ): u64 {
        let current_price = calculate_price(current_supply - token_amount, params);
        
        // Simple calculation to approximate payment:
        // payment = tokens * price
        (token_amount * current_price) / PRICE_SCALE
    }

    /// Mint new tokens by paying APT according to the bonding curve
    public entry fun mint_tokens(
        account: &signer,
        payment_amount: u64
    ) acquires CoinCapabilities, CurveParameters, BondingCurveEvents {
        let _account_addr = signer::address_of(account);
        let owner_addr = @my_address;
        
        // Ensure account is registered to receive tokens
        if (!coin::is_account_registered<MemeCoin>(_account_addr)) {
            coin::register<MemeCoin>(account);
        };
        
        // Get capabilities and parameters
        let cap = borrow_global_mut<CoinCapabilities>(owner_addr);
        let params = borrow_global<CurveParameters>(owner_addr);
        
        // Calculate tokens to mint based on payment
        let tokens_to_mint = calculate_tokens_to_mint(payment_amount, cap.supply, params);
        assert!(tokens_to_mint > 0, error::invalid_argument(ERROR_INSUFFICIENT_PAYMENT));
        
        // Transfer payment
        coin::transfer<AptosCoin>(account, owner_addr, payment_amount);
        
        // Mint tokens to buyer
        let minted_coins = coin::mint(tokens_to_mint, &cap.mint_cap);
        coin::deposit(_account_addr, minted_coins);
        
        // Update supply
        cap.supply = cap.supply + tokens_to_mint;
        
        // Calculate new price and emit event
        let new_price = calculate_price(cap.supply, params);
        let events = borrow_global_mut<BondingCurveEvents>(owner_addr);
        event::emit_event(&mut events.mint_events, MintEvent {
            buyer: _account_addr,
            apt_paid: payment_amount,
            tokens_received: tokens_to_mint,
            new_price: new_price,
        });
    }

    /// Burn tokens to receive APT according to the bonding curve
    public entry fun burn_tokens(
        account: &signer,
        token_amount: u64
    ) acquires CoinCapabilities, CurveParameters, BondingCurveEvents {
        let _account_addr = signer::address_of(account);
        let owner_addr = @my_address;
        
        // Get capabilities and parameters
        let cap = borrow_global_mut<CoinCapabilities>(owner_addr);
        let params = borrow_global<CurveParameters>(owner_addr);
        
        // Ensure there's enough supply
        assert!(token_amount <= cap.supply, error::invalid_argument(ERROR_INSUFFICIENT_SUPPLY));
        
        // Calculate payment based on tokens
        let payment = calculate_payment_for_burn(token_amount, cap.supply, params);
        
        // Withdraw and burn tokens from seller
        let coins_to_burn = coin::withdraw<MemeCoin>(account, token_amount);
        coin::burn(coins_to_burn, &cap.burn_cap);
        
        // Transfer APT to seller
        coin::transfer<AptosCoin>(account, _account_addr, payment);
        
        // Update supply
        cap.supply = cap.supply - token_amount;
        
        // Calculate new price and emit event
        let new_price = calculate_price(cap.supply, params);
        let events = borrow_global_mut<BondingCurveEvents>(owner_addr);
        event::emit_event(&mut events.burn_events, BurnEvent {
            seller: _account_addr,
            tokens_burned: token_amount,
            apt_received: payment,
            new_price: new_price,
        });
    }

    /// Get the current token price
    public fun get_current_price(): u64 acquires CoinCapabilities, CurveParameters {
        let owner_addr = @my_address;
        let cap = borrow_global<CoinCapabilities>(owner_addr);
        let params = borrow_global<CurveParameters>(owner_addr);
        
        calculate_price(cap.supply, params) / PRICE_SCALE
    }

    /// Get the current token supply
    public fun get_supply(): u64 acquires CoinCapabilities {
        let cap = borrow_global<CoinCapabilities>(@my_address);
        cap.supply
    }
}