const LBRYAddressGenerator = require("./index.js");

/**
 * Test suite for LBRY Address Generator
 */
function runTests() {
  console.log("🧪 Running LBRY Address Generator Tests...\n");

  const lbry = new LBRYAddressGenerator();
  let passedTests = 0;
  let totalTests = 0;

  function test(description, testFunction) {
    totalTests++;
    try {
      const result = testFunction();
      if (result) {
        console.log(`✅ ${description}`);
        passedTests++;
      } else {
        console.log(`❌ ${description} - Test returned false`);
      }
    } catch (error) {
      console.log(`❌ ${description} - Error: ${error.message}`);
    }
  }

  // Test 1: Generate private key
  test("Generate private key", () => {
    const privateKey = lbry.generatePrivateKey();
    return privateKey instanceof Buffer && privateKey.length === 32;
  });

  // Test 2: Generate public key from private key
  test("Generate public key from private key", () => {
    const privateKey = lbry.generatePrivateKey();
    const publicKey = lbry.getPublicKey(privateKey);
    return publicKey instanceof Buffer && publicKey.length === 33;
  });

  // Test 3: Generate mainnet wallet
  test("Generate mainnet wallet", () => {
    const wallet = lbry.generateWallet();
    return (
      wallet.privateKey &&
      wallet.publicKey &&
      wallet.address &&
      wallet.network === "mainnet" &&
      wallet.address.startsWith("b")
    );
  });

  // Test 4: Generate testnet wallet
  test("Generate testnet wallet", () => {
    const wallet = lbry.generateWallet(true);
    return (
      wallet.privateKey &&
      wallet.publicKey &&
      wallet.address &&
      wallet.network === "testnet" &&
      (wallet.address.startsWith("m") || wallet.address.startsWith("n"))
    );
  });

  // Test 5: Create wallet from existing private key
  test("Create wallet from existing private key", () => {
    const originalWallet = lbry.generateWallet();
    const recreatedWallet = lbry.fromPrivateKey(originalWallet.privateKey);
    return (
      recreatedWallet.privateKey === originalWallet.privateKey &&
      recreatedWallet.address === originalWallet.address
    );
  });

  // Test 6: Private key consistency
  test("Private key consistency", () => {
    const privateKeyHex =
      "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const wallet1 = lbry.fromPrivateKey(privateKeyHex);
    const wallet2 = lbry.fromPrivateKey(privateKeyHex);
    return wallet1.address === wallet2.address;
  });

  // Test 7: Address validation - valid addresses
  test("Address validation - valid mainnet address", () => {
    const wallet = lbry.generateWallet();
    return lbry.validateAddress(wallet.address);
  });

  // Test 8: Address validation - valid testnet address
  test("Address validation - valid testnet address", () => {
    const wallet = lbry.generateWallet(true);
    return lbry.validateAddress(wallet.address);
  });

  // Test 9: Address validation - invalid address
  test("Address validation - invalid address", () => {
    return !lbry.validateAddress("invalid_address_123");
  });

  // Test 10: Hash160 function
  test("Hash160 produces 20-byte output", () => {
    const testData = Buffer.from("test data");
    const hash = lbry.hash160(testData);
    return hash instanceof Buffer && hash.length === 20;
  });

  // Test 11: Double SHA256 function
  test("Double SHA256 produces 32-byte output", () => {
    const testData = Buffer.from("test data");
    const hash = lbry.doubleSha256(testData);
    return hash instanceof Buffer && hash.length === 32;
  });

  // Test 12: Different wallets generate different addresses
  test("Different wallets generate different addresses", () => {
    const wallet1 = lbry.generateWallet();
    const wallet2 = lbry.generateWallet();
    return wallet1.address !== wallet2.address;
  });

  // Test 13: Invalid private key handling
  test("Invalid private key handling", () => {
    try {
      lbry.fromPrivateKey("invalid_hex");
      return false;
    } catch (error) {
      return true;
    }
  });

  // Test 14: Private key length validation
  test("Private key length validation", () => {
    try {
      lbry.fromPrivateKey("1234"); // Too short
      return false;
    } catch (error) {
      return error.message.includes("32 bytes");
    }
  });

  // Test 15: Base58 encoding
  test("Base58 encoding works", () => {
    const testData = Buffer.from([0, 1, 2, 3, 4]);
    const encoded = lbry.base58Encode(testData);
    return typeof encoded === "string" && encoded.length > 0;
  });

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log("🎉 All tests passed!");
  } else {
    console.log(`⚠️  ${totalTests - passedTests} tests failed.`);
  }

  return passedTests === totalTests;
}

// Performance test
function performanceTest() {
  console.log("\n⚡ Performance Test: Generating 100 addresses...");
  const lbry = new LBRYAddressGenerator();
  const start = Date.now();

  for (let i = 0; i < 100; i++) {
    lbry.generateWallet();
  }

  const end = Date.now();
  const duration = end - start;
  console.log(
    `Generated 100 addresses in ${duration}ms (${(duration / 100).toFixed(2)}ms per address)`,
  );
}

// Demo with sample addresses
function demo() {
  console.log("\n🎯 Demo: Sample Addresses");
  const lbry = new LBRYAddressGenerator();

  for (let i = 0; i < 3; i++) {
    const wallet = lbry.generateWallet();
    console.log(`Address ${i + 1}: ${wallet.address}`);
  }
}

if (require.main === module) {
  const success = runTests();
  performanceTest();
  demo();

  process.exit(success ? 0 : 1);
}

module.exports = { runTests };
