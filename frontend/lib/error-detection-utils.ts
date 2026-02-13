export type ParityType = 'even' | 'odd';


export const calculateParity = (data: string, type: ParityType): { parityBit: string; count: number } => {
    const ones = data.split('').filter((bit) => bit === '1').length;
    let parityBit = '';
    if (type === 'even') {
        parityBit = ones % 2 === 0 ? '0' : '1';
    } else {
        parityBit = ones % 2 === 0 ? '1' : '0';
    }
    return { parityBit, count: ones };
};

export const calculateChecksum = (data: string): { sum: string; checksum: string; segments: string[]; wrappedSum: string; initialSum: number } => {
    const segments: string[] = [];
    const k = 8;
    const remainder = data.length % k;
    const padding = remainder === 0 ? 0 : k - remainder;
    const paddedData = '0'.repeat(padding) + data;

    for (let i = 0; i < paddedData.length; i += k) {
        segments.push(paddedData.substring(i, i + k));
    }

    let sumDec = 0;
    segments.forEach(seg => {
        sumDec += parseInt(seg, 2);
    });

    const initialSum = sumDec; // Sum before wrapping

    // Wrap carry
    let wrappedSum = sumDec;
    while (wrappedSum > (2 ** k - 1)) {
        const carry = wrappedSum >> k;
        const main = wrappedSum & ((1 << k) - 1);
        wrappedSum = main + carry;
    }

    const sumBinary = wrappedSum.toString(2).padStart(k, '0');
    // Checksum = 1's complement
    const checksum = sumBinary.split('').map(b => b === '1' ? '0' : '1').join('');

    return { sum: sumBinary, checksum, segments, wrappedSum: sumBinary, initialSum };
};

export interface CRCStep {
    currentSlice: string;
    currentStartIdx: number;
    quotientBit?: string;
    xorResult?: string;
    nextSlice?: string;
}

export interface HammingStep {
    pPos: number;
    coveredBits: number[];
    parityValue: string;
}

export interface HammingResult {
    encoded: string;
    parityBits: Record<number, string>;
    r: number;
    steps: HammingStep[];
}

export interface SyndromeStep {
    pPos: number;
    count: number;
    status: string;
    checkedIndices: number[];
}

export interface HammingReceiverResult {
    errorPosition: number;
    corrected: string;
    syndromeSteps: SyndromeStep[];
}

// CRC logic restored
export const calculateCRC = (data: string, divisor: string) => {
    const appendedData = data + '0'.repeat(divisor.length - 1);
    const pick = divisor.length;
    let temp = appendedData.substring(0, pick);
    let quotient = "";
    const steps: CRCStep[] = [];

    let currentIdx = pick;

    while (currentIdx <= appendedData.length) {
        const step: CRCStep = {
            currentSlice: temp,
            currentStartIdx: currentIdx - temp.length
        };

        if (temp[0] === '1') {
            quotient += '1';
            step.quotientBit = '1';
            let xorRes = "";
            for (let i = 0; i < divisor.length; i++) {
                xorRes += (temp[i] === divisor[i] ? "0" : "1");
            }
            step.xorResult = xorRes;
            temp = xorRes.substring(1);
        } else {
            quotient += '0';
            step.quotientBit = '0';
            // XOR with 0000... is just the same
            step.xorResult = temp;
            temp = temp.substring(1);
        }

        if (currentIdx < appendedData.length) {
            temp += appendedData[currentIdx];
        }
        step.nextSlice = temp;
        steps.push(step);
        currentIdx++;
    }

    return {
        codeword: data + temp,
        remainder: temp,
        quotient,
        steps,
        appendedData
    };
};

// Receiver CRC check (divides received data directly)
export const checkCRC = (received: string, divisor: string) => {
    const pick = divisor.length;
    let temp = received.substring(0, pick);
    let currentIdx = pick;

    while (currentIdx <= received.length) {
        if (temp[0] === '1') {
            let xorRes = "";
            for (let i = 0; i < divisor.length; i++) {
                xorRes += (temp[i] === divisor[i] ? "0" : "1");
            }
            temp = xorRes.substring(1);
        } else {
            temp = temp.substring(1);
        }

        if (currentIdx < received.length) {
            temp += received[currentIdx];
        }
        currentIdx++;
    }
    return temp;
};

export const calculateHamming = (data: string) => {
    const m = data.length;
    let r = 0;
    while (Math.pow(2, r) < m + r + 1) {
        r++;
    }

    const totalLen = m + r;
    const encodedArr = new Array(totalLen).fill(null);

    // Place parity placeholders
    for (let i = 0; i < r; i++) {
        encodedArr[Math.pow(2, i) - 1] = 'P';
    }

    // Place data bits
    let dataIdx = 0;
    // Note: Standard Hamming(7,4) usually fills data from D3, D5, D6, D7.
    // Our util fills sequentially into non-P spots. This is valid for general Hamming.
    for (let i = 0; i < totalLen; i++) {
        if (encodedArr[i] === null) {
            encodedArr[i] = data[dataIdx];
            dataIdx++;
        }
    }

    const parityBits: { [key: number]: string } = {};
    const steps: { pPos: number; coveredBits: number[]; parityValue: string }[] = [];

    for (let i = 0; i < r; i++) {
        const pPos = Math.pow(2, i);
        let count = 0;
        const coveredIndices = [];

        for (let j = 1; j <= totalLen; j++) {
            // Check if j passes through this parity position (j has i-th bit set)
            if (((j >> i) & 1) === 1) {
                const val = encodedArr[j - 1];
                // Record the index if it's not the parity bit itself (or strictly, everything involved)
                // We count 1s in the data bits usually.
                if (val !== 'P' && val !== null) {
                    if (val === '1') count++;
                    coveredIndices.push(j);
                }
            }
        }
        const pVal = count % 2 === 0 ? '0' : '1';
        encodedArr[pPos - 1] = pVal;
        parityBits[pPos] = pVal;

        steps.push({
            pPos: pPos,
            coveredBits: coveredIndices,
            parityValue: pVal
        });
    }

    return {
        encoded: encodedArr.join(''),
        parityBits,
        r,
        steps
    };
};

export const checkHamming = (received: string) => {
    const n = received.length;
    let errorPos = 0;
    let r = 0;
    while (Math.pow(2, r) < n + 1) r++;

    const syndromeSteps: { pPos: number; count: number; status: string; checkedIndices: number[] }[] = [];

    for (let i = 0; i < r; i++) {
        const pPos = Math.pow(2, i);
        let count = 0;
        const checkedIndices = [];

        for (let j = 1; j <= n; j++) {
            if (((j >> i) & 1) === 1) {
                if (received[j - 1] === '1') count++;
                checkedIndices.push(j);
            }
        }

        // Even parity check: Count of 1s should be even.
        // If count is odd, then this parity check FAILED (contributes 1 to syndrome).
        // If count is even, check PASSED (contributes 0).

        const isFailure = count % 2 !== 0;
        if (isFailure) {
            errorPos += pPos;
        }

        syndromeSteps.push({
            pPos,
            count,
            status: isFailure ? "Fail" : "Pass",
            checkedIndices
        });
    }

    let corrected = received;
    if (errorPos > 0 && errorPos <= n) {
        const char = received[errorPos - 1];
        const newChar = char === '1' ? '0' : '1';
        corrected = received.substring(0, errorPos - 1) + newChar + received.substring(errorPos);
    }

    return {
        errorPosition: errorPos,
        corrected,
        syndromeSteps
    };
}
