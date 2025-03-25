module bonding_curve_token::dynamic_token {
    use std::error;
    use std::signer;
    use std::string;
    use aptos_framework::account;
    use aptos_framework::coin::{Self, BurnCapability, MintCapability};
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::aptos_coin::AptosCoin;

    const ERROR_NOT_INITIALIZED: u64 = 1;
    const ERROR_ZERO_AMOUNT: u64 = 2;
    const ERROR_INSUFFICIENT_BALANCE: u64 = 3;
    const ERROR_MAX_SUPPLY_REACHED: u64 = 4;
    const ERROR_INVALID_PARAMETER: u64 = 5;

    struct DynamicToken {}

    struct TokenConfig has key {
        mint_cap: MintCapability<DynamicToken>,
        burn_cap: BurnCapability<DynamicToken>,
        base_price: u64,
        price_increase_factor: u64,
        max_supply: u64,
        total_supply: u64,
        collected_apt: u64,
        purchase_events: EventHandle<PurchaseEvent>,
        sale_events: EventHandle<SaleEvent>,
        signer_cap: account::SignerCapability,
    }

    struct PurchaseEvent has drop, store {
        buyer: address,
        apt_amount: u64,
        tokens_minted: u64,
        price_per_token: u64,
    }

    struct SaleEvent has drop, store {
        seller: address,
        tokens_sold: u64,
        apt_returned: u64,
        price_per_token: u64,
    }

    public entry fun initialize(
        admin: &signer,
        name: string::String,
        symbol: string::String,
        decimals: u8,
        base_price: u64,
        price_increase_factor: u64,
        max_supply: u64,
    ) {
        // Validate parameters
        assert!(base_price > 0, error::invalid_argument(ERROR_INVALID_PARAMETER));
        assert!(price_increase_factor > 0, error::invalid_argument(ERROR_INVALID_PARAMETER));
        assert!(max_supply > 0, error::invalid_argument(ERROR_INVALID_PARAMETER));

        // Create resource account
        let (resource_signer, signer_cap) = account::create_resource_account(
            admin,
            b"bonding_curve_seed"
        );

        // Initialize coin from admin account
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<DynamicToken>(
            admin,
            name,
            symbol,
            decimals,
            true
        );

        // Store config in resource account
        move_to(&resource_signer, TokenConfig {
            mint_cap,
            burn_cap,
            base_price,
            price_increase_factor,
            max_supply,
            total_supply: 0,
            collected_apt: 0,
            purchase_events: account::new_event_handle<PurchaseEvent>(&resource_signer),
            sale_events: account::new_event_handle<SaleEvent>(&resource_signer),
            signer_cap: signer_cap,
        });

        // Explicitly drop freeze cap (no admin control)
        coin::destroy_freeze_cap(freeze_cap);
    }

    fun calculate_price(config: &TokenConfig): u64 {
        let supply_ratio = (config.total_supply as u128) * 100000000 / (config.max_supply as u128);
        let price_factor = 100000000 + (supply_ratio * (config.price_increase_factor as u128) / 100000000);
        ((config.base_price as u128) * price_factor / 100000000) as u64
    }

    public entry fun buy_tokens(
        buyer: &signer,
        resource_addr: address,
        apt_amount: u64
    ) acquires TokenConfig {
        assert!(apt_amount > 0, error::invalid_argument(ERROR_ZERO_AMOUNT));
        
        let config = borrow_global_mut<TokenConfig>(resource_addr);
        let current_price = calculate_price(config);
        let tokens_to_mint = ((apt_amount as u128) * 100000000 / (current_price as u128)) as u64;

        assert!(config.total_supply + tokens_to_mint <= config.max_supply, 
               error::resource_exhausted(ERROR_MAX_SUPPLY_REACHED));

        // Transfer APT to resource account
        let apt_coins = coin::withdraw<AptosCoin>(buyer, apt_amount);
        coin::deposit(resource_addr, apt_coins);

        // Mint tokens
        let tokens = coin::mint(tokens_to_mint, &config.mint_cap);
        coin::deposit(signer::address_of(buyer), tokens);

        // Update state
        config.total_supply = config.total_supply + tokens_to_mint;
        config.collected_apt = config.collected_apt + apt_amount;

        event::emit_event(&mut config.purchase_events, PurchaseEvent {
            buyer: signer::address_of(buyer),
            apt_amount,
            tokens_minted: tokens_to_mint,
            price_per_token: current_price,
        });
    }

    public entry fun sell_tokens(
        seller: &signer,
        resource_addr: address,
        token_amount: u64
    ) acquires TokenConfig {
        assert!(token_amount > 0, error::invalid_argument(ERROR_ZERO_AMOUNT));
        
        let config = borrow_global_mut<TokenConfig>(resource_addr);
        let current_price = calculate_price(config);
        let discounted_price = ((current_price as u128) * 7000 / 10000) as u64;
        let apt_to_return = ((token_amount as u128) * (discounted_price as u128) / 100000000) as u64;

        assert!(apt_to_return <= config.collected_apt, 
               error::resource_exhausted(ERROR_INSUFFICIENT_BALANCE));

        // Burn tokens
        let tokens = coin::withdraw<DynamicToken>(seller, token_amount);
        coin::burn(tokens, &config.burn_cap);

        // Create resource signer
        let resource_signer = account::create_signer_with_capability(&config.signer_cap);

        // Transfer APT back
        let apt_coins = coin::withdraw<AptosCoin>(&resource_signer, apt_to_return);
        coin::deposit(signer::address_of(seller), apt_coins);

        // Update state
        config.total_supply = config.total_supply - token_amount;
        config.collected_apt = config.collected_apt - apt_to_return;

        event::emit_event(&mut config.sale_events, SaleEvent {
            seller: signer::address_of(seller),
            tokens_sold: token_amount,
            apt_returned: apt_to_return,
            price_per_token: discounted_price,
        });
    }

    public fun get_token_config(resource_addr: address): (u64, u64, u64, u64) acquires TokenConfig {
        let config = borrow_global<TokenConfig>(resource_addr);
        (config.base_price, config.price_increase_factor, config.total_supply, config.max_supply)
    }

    public fun get_current_price(resource_addr: address): u64 acquires TokenConfig {
        let config = borrow_global<TokenConfig>(resource_addr);
        calculate_price(config)
    }
}