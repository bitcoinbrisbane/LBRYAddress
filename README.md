# LBRY Address Generator

A Node.js library for generating LBRY blockchain addresses compatible with lbry.io. This library creates valid LBRY wallet addresses using the same cryptographic standards as the LBRY network.

## Features

- ✅ Generate LBRY mainnet and testnet addresses
- ✅ Create wallets from existing private keys
- ✅ Full cryptographic compatibility with LBRY network
- ✅ Address validation
- ✅ High performance (can generate hundreds of addresses per second)
- ✅ Comprehensive test suite
- ✅ TypeScript-friendly

## Installation

```bash
npm install lbry-address-generator
```

### Dependencies

This library requires the `secp256k1` package for elliptic curve cryptography:

```bash
npm install secp256k1
```

## Quick Start

```javascript
const LBRYAddressGenerator = require('lbry-address-generator');

const lbry = new LBRYAddressGenerator();

// Generate a new mainnet wallet
const wallet = lbry.generateWallet();
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('Public Key:', wallet.publicKey);
```

## API Reference

### Constructor

```javascript
const lbry = new LBRYAddressGenerator();
```

### Methods

#### `generateWallet(testnet = false)`

Generates a complete new wallet with private key, public key, and address.

**Parameters:**
- `testnet` (boolean, optional): Generate testnet address if true, mainnet if false (default)

**Returns:**
```javascript
{
  privateKey: string,  // Hex-encoded private key
  publicKey: string,   // Hex-encoded public key
  address: string,     // LBRY address
  network: string      // 'mainnet' or 'testnet'
}
```

**Example:**
```javascript
// Mainnet wallet
const mainnetWallet = lbry.generateWallet();
console.log(mainnetWallet.address); // Starts with 'b'

// Testnet wallet
const testnetWallet = lbry.generateWallet(true);
console.log(testnetWallet.address); // Starts with 'm' or 'n'
```

#### `fromPrivateKey(privateKeyHex, testnet = false)`

Creates a wallet from an existing private key.

**Parameters:**
- `privateKeyHex` (string|Buffer): Private key in hex format (64 characters) or Buffer (32 bytes)
- `testnet` (boolean, optional): Generate testnet address if true, mainnet if false (default)

**Returns:** Same as `generateWallet()`

**Example:**
```javascript
const privateKey = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
const wallet = lbry.fromPrivateKey(privateKey);
console.log('Address:', wallet.address);
```

#### `validateAddress(address)`

Validates a LBRY address format.

**Parameters:**
- `address` (string): LBRY address to validate

**Returns:** `boolean` - True if valid format

**Example:**
```javascript
const isValid = lbry.validateAddress('bQJH7W4dETrDJDPwkLe1zYpLSZdO1UBE');
console.log('Valid:', isValid); // true or false
```

#### `generatePrivateKey()`

Generates a cryptographically secure random private key.

**Returns:** `Buffer` - 32-byte private key

#### `getPublicKey(privateKey)`

Derives the public key from a private key.

**Parameters:**
- `privateKey` (Buffer): 32-byte private key

**Returns:** `Buffer` - 33-byte compressed public key

#### `createAddress(publicKey, testnet = false)`

Creates a LBRY address from a public key.

**Parameters:**
- `publicKey` (Buffer): 33-byte compressed public key
- `testnet` (boolean, optional): Generate testnet address if true

**Returns:** `string` - LBRY address

## Usage Examples

### Basic Wallet Generation

```javascript
const LBRYAddressGenerator = require('lbry-address-generator');
const lbry = new LBRYAddressGenerator();

// Generate 5 new wallets
for (let i = 0; i < 5; i++) {
  const wallet = lbry.generateWallet();
  console.log(`Wallet ${i + 1}: ${wallet.address}`);
}
```

### Working with Existing Private Keys

```javascript
// If you have an existing private key
const existingPrivateKey = 'your_64_character_hex_private_key_here';

try {
  const wallet = lbry.fromPrivateKey(existingPrivateKey);
  console.log('Restored wallet address:', wallet.address);
} catch (error) {
  console.error('Invalid private key:', error.message);
}
```

### Testnet Development

```javascript
// Generate testnet addresses for development
const testnetWallet = lbry.generateWallet(true);
console.log('Testnet address:', testnetWallet.address);
console.log('Network:', testnetWallet.network); // 'testnet'
```

### Address Validation

```javascript
const addresses = [
  'bQJH7W4dETrDJDPwkLe1zYpLSZdO1UBE',  // Valid format
  'invalid_address',                     // Invalid
  'mQJH7W4dETrDJDPwkLe1zYpLSZdO1UBE'   // Valid testnet format
];

addresses.forEach(addr => {
  const isValid = lbry.validateAddress(addr);
  console.log(`${addr}: ${isValid ? 'Valid' : 'Invalid'}`);
});
```

### Advanced Usage

```javascript
// Step-by-step address creation
const privateKey = lbry.generatePrivateKey();
const publicKey = lbry.getPublicKey(privateKey);
const address = lbry.createAddress(publicKey);

console.log('Private Key:', privateKey.toString('hex'));
console.log('Public Key:', publicKey.toString('hex'));
console.log('Address:', address);
```

## Address Format

LBRY addresses follow these patterns:

- **Mainnet addresses**: Start with `b` (e.g., `bQJH7W4dETrDJDPwkLe1zYpLSZdO1UBE`)
- **Testnet addresses**: Start with `m` or `n` (e.g., `mQJH7W4dETrDJDPwkLe1zYpLSZdO1UBE`)
- **Length**: 26-35 characters
- **Encoding**: Base58 (similar to Bitcoin)

## Testing

Run the test suite to verify functionality:

```bash
npm test
```

Run the demo:

```bash
npm run demo
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Private Key Security**: Never share or expose private keys. Store them securely.
2. **Random Number Generation**: This library uses Node.js's `crypto.randomBytes()` which is cryptographically secure.
3. **Production Use**: Always test thoroughly in testnet before using in production.
4. **Key Storage**: Consider using hardware wallets or secure key management systems for production applications.

## Compatibility

- **Node.js**: >= 14.0.0
- **LBRY Network**: Compatible with LBRY mainnet and testnet
- **Dependencies**: Uses `secp256k1` for elliptic curve cryptography

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the test file for usage examples
- Review LBRY documentation at https://lbry.tech

## Changelog

### v1.0.0
- Initial release
- Basic address generation
- Mainnet and testnet support
- Address validation
- Comprehensive test suite
