const crypto = require('crypto');
const secp256k1 = require('secp256k1');

/**
 * LBRY Address Generator Library
 * Generates LBRY blockchain addresses compatible with lbry.io
 */
class LBRYAddressGenerator {
  constructor() {
    // LBRY network parameters
    this.MAINNET_PREFIX = 0x55; // 85 decimal - LBRY mainnet addresses start with 'b'
    this.TESTNET_PREFIX = 0x6f; // 111 decimal - LBRY testnet addresses start with 'm' or 'n'
  }

  /**
   * Generates a random private key
   * @returns {Buffer} 32-byte private key
   */
  generatePrivateKey() {
    let privateKey;
    do {
      privateKey = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey));
    
    return privateKey;
  }

  /**
   * Derives public key from private key
   * @param {Buffer} privateKey - 32-byte private key
   * @returns {Buffer} 33-byte compressed public key
   */
  getPublicKey(privateKey) {
    if (!secp256k1.privateKeyVerify(privateKey)) {
      throw new Error('Invalid private key');
    }
    
    return secp256k1.publicKeyCreate(privateKey);
  }

  /**
   * Creates RIPEMD160 hash of SHA256 hash (Bitcoin-style hash160)
   * @param {Buffer} data - Input data to hash
   * @returns {Buffer} 20-byte hash160
   */
  hash160(data) {
    const sha256Hash = crypto.createHash('sha256').update(data).digest();
    return crypto.createHash('ripemd160').update(sha256Hash).digest();
  }

  /**
   * Creates double SHA256 hash (used for checksum)
   * @param {Buffer} data - Input data to hash
   * @returns {Buffer} 32-byte double SHA256 hash
   */
  doubleSha256(data) {
    const firstHash = crypto.createHash('sha256').update(data).digest();
    return crypto.createHash('sha256').update(firstHash).digest();
  }

  /**
   * Encodes data using Base58 (Bitcoin-style)
   * @param {Buffer} data - Data to encode
   * @returns {string} Base58 encoded string
   */
  base58Encode(data) {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    let num = BigInt('0x' + data.toString('hex'));
    
    while (num > 0) {
      const remainder = num % 58n;
      result = alphabet[Number(remainder)] + result;
      num = num / 58n;
    }
    
    // Add leading zeros
    for (let i = 0; i < data.length && data[i] === 0; i++) {
      result = '1' + result;
    }
    
    return result;
  }

  /**
   * Creates a LBRY address from public key
   * @param {Buffer} publicKey - 33-byte compressed public key
   * @param {boolean} testnet - Whether to generate testnet address
   * @returns {string} LBRY address
   */
  createAddress(publicKey, testnet = false) {
    // Step 1: Hash the public key
    const publicKeyHash = this.hash160(publicKey);
    
    // Step 2: Add network prefix
    const prefix = testnet ? this.TESTNET_PREFIX : this.MAINNET_PREFIX;
    const prefixedHash = Buffer.concat([Buffer.from([prefix]), publicKeyHash]);
    
    // Step 3: Calculate checksum (first 4 bytes of double SHA256)
    const checksum = this.doubleSha256(prefixedHash).slice(0, 4);
    
    // Step 4: Concatenate prefix + hash + checksum
    const fullAddress = Buffer.concat([prefixedHash, checksum]);
    
    // Step 5: Encode with Base58
    return this.base58Encode(fullAddress);
  }

  /**
   * Generates a complete LBRY wallet (private key, public key, address)
   * @param {boolean} testnet - Whether to generate testnet address
   * @returns {Object} Wallet object with privateKey, publicKey, and address
   */
  generateWallet(testnet = false) {
    const privateKey = this.generatePrivateKey();
    const publicKey = this.getPublicKey(privateKey);
    const address = this.createAddress(publicKey, testnet);
    
    return {
      privateKey: privateKey.toString('hex'),
      publicKey: publicKey.toString('hex'),
      address: address,
      network: testnet ? 'testnet' : 'mainnet'
    };
  }

  /**
   * Creates address from existing private key
   * @param {string|Buffer} privateKeyHex - Private key in hex format
   * @param {boolean} testnet - Whether to generate testnet address
   * @returns {Object} Wallet object
   */
  fromPrivateKey(privateKeyHex, testnet = false) {
    const privateKey = typeof privateKeyHex === 'string' 
      ? Buffer.from(privateKeyHex, 'hex') 
      : privateKeyHex;
    
    if (privateKey.length !== 32) {
      throw new Error('Private key must be 32 bytes');
    }
    
    const publicKey = this.getPublicKey(privateKey);
    const address = this.createAddress(publicKey, testnet);
    
    return {
      privateKey: privateKey.toString('hex'),
      publicKey: publicKey.toString('hex'),
      address: address,
      network: testnet ? 'testnet' : 'mainnet'
    };
  }

  /**
   * Validates a LBRY address
   * @param {string} address - LBRY address to validate
   * @returns {boolean} True if valid
   */
  validateAddress(address) {
    try {
      // Basic length check
      if (address.length < 26 || address.length > 35) {
        return false;
      }

      // Check if it starts with valid prefix characters
      if (!address.match(/^[bm1]/)) {
        return false;
      }

      // Additional validation could be added here (Base58 decode and checksum verification)
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = LBRYAddressGenerator;

// Example usage:
if (require.main === module) {
  const lbry = new LBRYAddressGenerator();
  
  console.log('=== LBRY Address Generator Demo ===\n');
  
  // Generate new mainnet wallet
  const mainnetWallet = lbry.generateWallet();
  console.log('Mainnet Wallet:');
  console.log('Private Key:', mainnetWallet.privateKey);
  console.log('Public Key:', mainnetWallet.publicKey);
  console.log('Address:', mainnetWallet.address);
  console.log('Network:', mainnetWallet.network);
  console.log();
  
  // Generate new testnet wallet
  const testnetWallet = lbry.generateWallet(true);
  console.log('Testnet Wallet:');
  console.log('Private Key:', testnetWallet.privateKey);
  console.log('Public Key:', testnetWallet.publicKey);
  console.log('Address:', testnetWallet.address);
  console.log('Network:', testnetWallet.network);
  console.log();
  
  // Create wallet from existing private key
  try {
    const existingWallet = lbry.fromPrivateKey(mainnetWallet.privateKey);
    console.log('Wallet from existing private key:');
    console.log('Address:', existingWallet.address);
    console.log('Matches original:', existingWallet.address === mainnetWallet.address);
    console.log();
  } catch (error) {
    console.error('Error creating wallet from private key:', error.message);
  }
  
  // Validate addresses
  console.log('Address validation:');
  console.log('Mainnet address valid:', lbry.validateAddress(mainnetWallet.address));
  console.log('Testnet address valid:', lbry.validateAddress(testnetWallet.address));
  console.log('Invalid address valid:', lbry.validateAddress('invalid_address'));
}
