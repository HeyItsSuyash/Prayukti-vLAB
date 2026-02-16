
const calculateParity = (data, type) => {
    const ones = data.split('').filter((bit) => bit === '1').length;
    let parityBit = '';
    if (type === 'even') {
        parityBit = ones % 2 === 0 ? '0' : '1';
    } else {
        parityBit = ones % 2 === 0 ? '1' : '0';
    }
    return { parityBit, count: ones };
};

const verify = (receivedData, parityType) => {
    const count = receivedData.split('').filter(b => b === '1').length;
    let isValid = false;
    if (parityType === 'even') {
        isValid = count % 2 === 0;
    } else { // odd
        isValid = count % 2 !== 0;
    }
    return { isValid, count };
};

console.log("--- Testing Case: User says 'Odd Parity' and '4 ones' (Total) ---");
// Case 1: Received Data has 4 ones. Parity Type is Odd.
const received = "1111"; // 4 ones
const result = verify(received, "odd");
console.log(`Received: ${received} (Ones: ${result.count})`);
console.log(`Parity Type: Odd`);
console.log(`Is Valid? ${result.isValid}`);
// Expect: False (4 is even, Odd parity needs odd count)

console.log("\n--- Testing Case: Data has 4 ones, generated parity ---");
const data = "1111"; // 4 ones
const type = "odd";
const calc = calculateParity(data, type);
console.log(`Data: ${data} (Ones: ${calc.count})`);
console.log(`Type: ${type}`);
console.log(`Parity Bit: ${calc.parityBit}`); // Expect 1 (Total 5)
const transmitted = data + calc.parityBit;
console.log(`Transmitted: ${transmitted} (Total Ones: ${transmitted.split('').filter(x => x == '1').length})`);

const verRes = verify(transmitted, type);
console.log(`Verify Transmitted: Valid? ${verRes.isValid}`); // Expect True

console.log("\n--- Injecting Error into '11111' ---");
// Flip 5th bit (1 -> 0) => '11110'
const corrupted = "11110";
const verCorr = verify(corrupted, type);
console.log(`Corrupted: ${corrupted} (Total Ones: ${verCorr.count})`);
console.log(`Verify Corrupted: Valid? ${verCorr.isValid}`); // Expect False (4 ones)

