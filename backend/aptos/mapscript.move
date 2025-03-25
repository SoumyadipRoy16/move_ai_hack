script {
    use std::option;
    use 0x692906717ffbfc458c597613e0dd42c8f18577d28c03d2fdb768a07aa0fee713::SignerMap;

    fun main() {
        // Call the get_strings function to retrieve the pubKey and privKey
        let (pubKeyOpt, privKeyOpt) = SignerMap::get_strings(account);

        // Handle the returned Option values
        if (option::is_some(&pubKeyOpt) && option::is_some(&privKeyOpt)) {
            let pubKey = option::extract(&mut pubKeyOpt);
            let privKey = option::extract(&mut privKeyOpt);

            // Emit an event with the retrieved strings
            SignerMap::emit_strings_event(pubKey, privKey);
        } else {
            // Handle the case where the strings are not found
            abort 1;
        }
    }
}