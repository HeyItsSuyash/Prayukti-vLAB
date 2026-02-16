export interface AssemblyResult {
    success: boolean;
    hex: number[];
    labels: Record<string, number>;
    error?: string;
    lineMap: Record<number, number>; // asm line index -> memory address
}

export const OPCODE_MAP: Record<string, { opcode: number, bytes: number }> = {
    // Data Transfer
    "NOP": { opcode: 0x00, bytes: 1 },
    "MOV A,A": { opcode: 0x7F, bytes: 1 }, "MOV A,B": { opcode: 0x78, bytes: 1 }, "MOV A,C": { opcode: 0x79, bytes: 1 },
    "MOV A,D": { opcode: 0x7A, bytes: 1 }, "MOV A,E": { opcode: 0x7B, bytes: 1 }, "MOV A,H": { opcode: 0x7C, bytes: 1 },
    "MOV A,L": { opcode: 0x7D, bytes: 1 }, "MOV A,M": { opcode: 0x7E, bytes: 1 },
    "MOV B,A": { opcode: 0x47, bytes: 1 }, "MOV B,B": { opcode: 0x40, bytes: 1 }, "MOV B,C": { opcode: 0x41, bytes: 1 },
    "MOV B,D": { opcode: 0x42, bytes: 1 }, "MOV B,E": { opcode: 0x43, bytes: 1 }, "MOV B,H": { opcode: 0x44, bytes: 1 },
    "MOV B,L": { opcode: 0x45, bytes: 1 }, "MOV B,M": { opcode: 0x46, bytes: 1 },
    "MOV C,A": { opcode: 0x4F, bytes: 1 }, "MOV C,B": { opcode: 0x48, bytes: 1 }, "MOV C,C": { opcode: 0x49, bytes: 1 },
    "MOV C,D": { opcode: 0x4A, bytes: 1 }, "MOV C,E": { opcode: 0x4B, bytes: 1 }, "MOV C,H": { opcode: 0x4C, bytes: 1 },
    "MOV C,L": { opcode: 0x4D, bytes: 1 }, "MOV C,M": { opcode: 0x4E, bytes: 1 },
    "MOV D,A": { opcode: 0x57, bytes: 1 }, "MOV D,B": { opcode: 0x50, bytes: 1 }, "MOV D,C": { opcode: 0x51, bytes: 1 },
    "MOV D,D": { opcode: 0x52, bytes: 1 }, "MOV D,E": { opcode: 0x53, bytes: 1 }, "MOV D,H": { opcode: 0x54, bytes: 1 },
    "MOV D,L": { opcode: 0x55, bytes: 1 }, "MOV D,M": { opcode: 0x56, bytes: 1 },
    "MOV E,A": { opcode: 0x5F, bytes: 1 }, "MOV E,B": { opcode: 0x58, bytes: 1 }, "MOV E,C": { opcode: 0x59, bytes: 1 },
    "MOV E,D": { opcode: 0x5A, bytes: 1 }, "MOV E,E": { opcode: 0x5B, bytes: 1 }, "MOV E,H": { opcode: 0x5C, bytes: 1 },
    "MOV E,L": { opcode: 0x5D, bytes: 1 }, "MOV E,M": { opcode: 0x5E, bytes: 1 },
    "MOV H,A": { opcode: 0x67, bytes: 1 }, "MOV H,B": { opcode: 0x60, bytes: 1 }, "MOV H,C": { opcode: 0x61, bytes: 1 },
    "MOV H,D": { opcode: 0x62, bytes: 1 }, "MOV H,E": { opcode: 0x63, bytes: 1 }, "MOV H,H": { opcode: 0x64, bytes: 1 },
    "MOV H,L": { opcode: 0x65, bytes: 1 }, "MOV H,M": { opcode: 0x66, bytes: 1 },
    "MOV L,A": { opcode: 0x6F, bytes: 1 }, "MOV L,B": { opcode: 0x68, bytes: 1 }, "MOV L,C": { opcode: 0x69, bytes: 1 },
    "MOV L,D": { opcode: 0x6A, bytes: 1 }, "MOV L,E": { opcode: 0x6B, bytes: 1 }, "MOV L,H": { opcode: 0x6C, bytes: 1 },
    "MOV L,L": { opcode: 0x6D, bytes: 1 }, "MOV L,M": { opcode: 0x6E, bytes: 1 },
    "MOV M,A": { opcode: 0x77, bytes: 1 }, "MOV M,B": { opcode: 0x70, bytes: 1 }, "MOV M,C": { opcode: 0x71, bytes: 1 },
    "MOV M,D": { opcode: 0x72, bytes: 1 }, "MOV M,E": { opcode: 0x73, bytes: 1 }, "MOV M,H": { opcode: 0x74, bytes: 1 },
    "MOV M,L": { opcode: 0x75, bytes: 1 },

    "MVI A": { opcode: 0x3E, bytes: 2 }, "MVI B": { opcode: 0x06, bytes: 2 }, "MVI C": { opcode: 0x0E, bytes: 2 },
    "MVI D": { opcode: 0x16, bytes: 2 }, "MVI E": { opcode: 0x1E, bytes: 2 }, "MVI H": { opcode: 0x26, bytes: 2 },
    "MVI L": { opcode: 0x2E, bytes: 2 }, "MVI M": { opcode: 0x36, bytes: 2 },

    "LXI B": { opcode: 0x01, bytes: 3 }, "LXI D": { opcode: 0x11, bytes: 3 }, "LXI H": { opcode: 0x21, bytes: 3 }, "LXI SP": { opcode: 0x31, bytes: 3 },
    "LDA": { opcode: 0x3A, bytes: 3 }, "STA": { opcode: 0x32, bytes: 3 },
    "LHLD": { opcode: 0x2A, bytes: 3 }, "SHLD": { opcode: 0x22, bytes: 3 },
    "LDAX B": { opcode: 0x0A, bytes: 1 }, "LDAX D": { opcode: 0x1A, bytes: 1 },
    "STAX B": { opcode: 0x02, bytes: 1 }, "STAX D": { opcode: 0x12, bytes: 1 },
    "XCHG": { opcode: 0xEB, bytes: 1 },

    // Arithmetic
    "ADD A": { opcode: 0x87, bytes: 1 }, "ADD B": { opcode: 0x80, bytes: 1 }, "ADD C": { opcode: 0x81, bytes: 1 },
    "ADD D": { opcode: 0x82, bytes: 1 }, "ADD E": { opcode: 0x83, bytes: 1 }, "ADD H": { opcode: 0x84, bytes: 1 },
    "ADD L": { opcode: 0x85, bytes: 1 }, "ADD M": { opcode: 0x86, bytes: 1 },
    "ADI": { opcode: 0xC6, bytes: 2 },

    "SUB A": { opcode: 0x97, bytes: 1 }, "SUB B": { opcode: 0x90, bytes: 1 }, "SUB C": { opcode: 0x91, bytes: 1 },
    "SUB D": { opcode: 0x92, bytes: 1 }, "SUB E": { opcode: 0x93, bytes: 1 }, "SUB H": { opcode: 0x94, bytes: 1 },
    "SUB L": { opcode: 0x95, bytes: 1 }, "SUB M": { opcode: 0x96, bytes: 1 },
    "SUI": { opcode: 0xD6, bytes: 2 },
    "SBB A": { opcode: 0x9F, bytes: 1 }, "SBB B": { opcode: 0x98, bytes: 1 }, "SBB C": { opcode: 0x99, bytes: 1 },
    "SBB D": { opcode: 0x9A, bytes: 1 }, "SBB E": { opcode: 0x9B, bytes: 1 }, "SBB H": { opcode: 0x9C, bytes: 1 },
    "SBB L": { opcode: 0x9D, bytes: 1 }, "SBB M": { opcode: 0x9E, bytes: 1 },
    "SBI": { opcode: 0xDE, bytes: 2 },

    "INR A": { opcode: 0x3C, bytes: 1 }, "INR B": { opcode: 0x04, bytes: 1 }, "INR C": { opcode: 0x0C, bytes: 1 },
    "INR D": { opcode: 0x14, bytes: 1 }, "INR E": { opcode: 0x1C, bytes: 1 }, "INR H": { opcode: 0x24, bytes: 1 },
    "INR L": { opcode: 0x2C, bytes: 1 }, "INR M": { opcode: 0x34, bytes: 1 },

    "DCR A": { opcode: 0x3D, bytes: 1 }, "DCR B": { opcode: 0x05, bytes: 1 }, "DCR C": { opcode: 0x0D, bytes: 1 },
    "DCR D": { opcode: 0x15, bytes: 1 }, "DCR E": { opcode: 0x1D, bytes: 1 }, "DCR H": { opcode: 0x25, bytes: 1 },
    "DCR L": { opcode: 0x2D, bytes: 1 }, "DCR M": { opcode: 0x35, bytes: 1 },

    "INX B": { opcode: 0x03, bytes: 1 }, "INX D": { opcode: 0x13, bytes: 1 }, "INX H": { opcode: 0x23, bytes: 1 }, "INX SP": { opcode: 0x33, bytes: 1 },
    "DCX B": { opcode: 0x0B, bytes: 1 }, "DCX D": { opcode: 0x1B, bytes: 1 }, "DCX H": { opcode: 0x2B, bytes: 1 }, "DCX SP": { opcode: 0x3B, bytes: 1 },
    "DAD B": { opcode: 0x09, bytes: 1 }, "DAD D": { opcode: 0x19, bytes: 1 }, "DAD H": { opcode: 0x29, bytes: 1 }, "DAD SP": { opcode: 0x39, bytes: 1 },
    "DAA": { opcode: 0x27, bytes: 1 },

    // Logical
    "ANA A": { opcode: 0xA7, bytes: 1 }, "ANA B": { opcode: 0xA0, bytes: 1 }, "ANA C": { opcode: 0xA1, bytes: 1 },
    "ANA D": { opcode: 0xA2, bytes: 1 }, "ANA E": { opcode: 0xA3, bytes: 1 }, "ANA H": { opcode: 0xA4, bytes: 1 },
    "ANA L": { opcode: 0xA5, bytes: 1 }, "ANA M": { opcode: 0xA6, bytes: 1 },
    "ANI": { opcode: 0xE6, bytes: 2 },
    "ORA A": { opcode: 0xB7, bytes: 1 }, "ORA B": { opcode: 0xB0, bytes: 1 }, "ORA C": { opcode: 0xB1, bytes: 1 },
    "ORA D": { opcode: 0xB2, bytes: 1 }, "ORA E": { opcode: 0xB3, bytes: 1 }, "ORA H": { opcode: 0xB4, bytes: 1 },
    "ORA L": { opcode: 0xB5, bytes: 1 }, "ORA M": { opcode: 0xB6, bytes: 1 },
    "ORI": { opcode: 0xF6, bytes: 2 },
    "XRA A": { opcode: 0xAF, bytes: 1 }, "XRA B": { opcode: 0xA8, bytes: 1 }, "XRA C": { opcode: 0xA9, bytes: 1 },
    "XRA D": { opcode: 0xAA, bytes: 1 }, "XRA E": { opcode: 0xAB, bytes: 1 }, "XRA H": { opcode: 0xAC, bytes: 1 },
    "XRA L": { opcode: 0xAD, bytes: 1 }, "XRA M": { opcode: 0xAE, bytes: 1 },
    "XRI": { opcode: 0xEE, bytes: 2 },
    "CMP A": { opcode: 0xBF, bytes: 1 }, "CMP B": { opcode: 0xB8, bytes: 1 }, "CMP C": { opcode: 0xB9, bytes: 1 },
    "CMP D": { opcode: 0xBA, bytes: 1 }, "CMP E": { opcode: 0xBB, bytes: 1 }, "CMP H": { opcode: 0xBC, bytes: 1 },
    "CMP L": { opcode: 0xBD, bytes: 1 }, "CMP M": { opcode: 0xBE, bytes: 1 },
    "CPI": { opcode: 0xFE, bytes: 2 },
    "CMA": { opcode: 0x2F, bytes: 1 }, "CMC": { opcode: 0x3F, bytes: 1 }, "STC": { opcode: 0x37, bytes: 1 },

    // Branching
    "JMP": { opcode: 0xC3, bytes: 3 }, "JC": { opcode: 0xDA, bytes: 3 }, "JNC": { opcode: 0xD2, bytes: 3 },
    "JZ": { opcode: 0xCA, bytes: 3 }, "JNZ": { opcode: 0xC2, bytes: 3 }, "JP": { opcode: 0xF2, bytes: 3 },
    "JM": { opcode: 0xFA, bytes: 3 }, "JPE": { opcode: 0xEA, bytes: 3 }, "JPO": { opcode: 0xE2, bytes: 3 },
    "CALL": { opcode: 0xCD, bytes: 3 },
    "CNC": { opcode: 0xD4, bytes: 3 }, "CC": { opcode: 0xDC, bytes: 3 }, "CNZ": { opcode: 0xC4, bytes: 3 }, "CZ": { opcode: 0xCC, bytes: 3 },
    "CPO": { opcode: 0xE4, bytes: 3 }, "CPE": { opcode: 0xEC, bytes: 3 }, "CP": { opcode: 0xF4, bytes: 3 }, "CM": { opcode: 0xFC, bytes: 3 },
    "RET": { opcode: 0xC9, bytes: 1 },
    "RNC": { opcode: 0xD0, bytes: 1 }, "RC": { opcode: 0xD8, bytes: 1 }, "RNZ": { opcode: 0xC0, bytes: 1 }, "RZ": { opcode: 0xC8, bytes: 1 },
    "RPO": { opcode: 0xE0, bytes: 1 }, "RPE": { opcode: 0xE8, bytes: 1 }, "RP": { opcode: 0xF0, bytes: 1 }, "RM": { opcode: 0xF8, bytes: 1 },

    // Stack
    "PUSH B": { opcode: 0xC5, bytes: 1 }, "PUSH D": { opcode: 0xD5, bytes: 1 }, "PUSH H": { opcode: 0xE5, bytes: 1 }, "PUSH PSW": { opcode: 0xF5, bytes: 1 },
    "POP B": { opcode: 0xC1, bytes: 1 }, "POP D": { opcode: 0xD1, bytes: 1 }, "POP H": { opcode: 0xE1, bytes: 1 }, "POP PSW": { opcode: 0xF1, bytes: 1 },
    "XTHL": { opcode: 0xE3, bytes: 1 }, "SPHL": { opcode: 0xF9, bytes: 1 }, "PCHL": { opcode: 0xE9, bytes: 1 },

    // Rotate
    "RLC": { opcode: 0x07, bytes: 1 }, "RRC": { opcode: 0x0F, bytes: 1 }, "RAL": { opcode: 0x17, bytes: 1 }, "RAR": { opcode: 0x1F, bytes: 1 },

    // I/O
    "IN": { opcode: 0xDB, bytes: 2 }, "OUT": { opcode: 0xD3, bytes: 2 },

    // Machine Control
    "EI": { opcode: 0xFB, bytes: 1 }, "DI": { opcode: 0xF3, bytes: 1 },
    "SIM": { opcode: 0x30, bytes: 1 }, "RIM": { opcode: 0x20, bytes: 1 },
};

export class Assembler {
    static assemble(source: string, startAddr: number = 0): AssemblyResult {
        const lines = source.split("\n");
        const hex: number[] = [];
        const labels: Record<string, number> = {};
        const lineMap: Record<number, number> = {};

        let currentAddr = startAddr;

        // Pass 1: Resolve Labels
        lines.forEach((line) => {
            const clean = (line.split(";")[0] || "").trim();
            if (!clean) return;

            const labelMatch = clean.match(/^(\w+):/);
            if (labelMatch && labelMatch[1]) {
                labels[labelMatch[1]] = currentAddr;
                const rest = clean.replace(/^(\w+):/, "").trim();
                if (!rest) return;
            }

            const instruction = clean.replace(/^(\w+):/, "").trim();
            const normalized = instruction.replace(/,\s*/g, " ").replace(/\s+/g, " ").toUpperCase();

            // Resolve bytes needed
            let found = false;
            // Check for longest matching key first to avoid partial matches (e.g., MOV A matching MOV A, B)
            const sortedKeys = Object.keys(OPCODE_MAP).sort((a, b) => b.length - a.length);
            for (const key of sortedKeys) {
                if (normalized.startsWith(key)) {
                    const mapOp = OPCODE_MAP[key];
                    if (mapOp) {
                        currentAddr += mapOp.bytes;
                        found = true;
                        break;
                    }
                }
            }
            if (!found && instruction) {
                currentAddr += 1; // Default to 1 byte for unknown or invalid
            }
        });

        // Pass 2: Generate Opcodes
        currentAddr = startAddr;
        try {
            lines.forEach((line, idx) => {
                const clean = (line.split(";")[0] || "").trim();
                if (!clean) return;

                lineMap[idx] = currentAddr;
                const instruction = clean.replace(/^(\w+):/, "").trim();
                if (!instruction) return;

                const normalized = instruction.replace(/,\s*/g, " ").replace(/\s+/g, " ").toUpperCase();

                // Match best opcode
                let match = null;
                let keyMatch = "";

                const sortedKeys = Object.keys(OPCODE_MAP).sort((a, b) => b.length - a.length);
                for (const key of sortedKeys) {
                    if (normalized.startsWith(key)) {
                        match = OPCODE_MAP[key];
                        keyMatch = key;
                        break;
                    }
                }

                if (!match) throw new Error(`Unknown instruction on line ${idx + 1}: ${instruction}`);

                hex.push(match.opcode);
                currentAddr++;

                if (match.bytes > 1) {
                    // Extract operand from the normalized string by removing the instruction key
                    let operand = normalized.substring(keyMatch.length).trim();
                    if (!operand) {
                        // Support cases where operand might be separated by comma original instruction
                        // But normalized already replaced commas with spaces
                        throw new Error(`Missing operand for ${keyMatch} on line ${idx + 1}`);
                    }

                    let val = 0;
                    if (labels[operand] !== undefined) {
                        val = labels[operand]!;
                    } else {
                        // Handle Hex (1234H), Decimal (1234), and potentially Binary?
                        const hexMatch = operand.match(/^([0-9A-F]+)H$/i);
                        if (hexMatch) {
                            val = parseInt(hexMatch[1], 16);
                        } else {
                            val = parseInt(operand);
                            // If decimal parse fails or result is NaN, try hex fallback if it looks like hex
                            if (isNaN(val)) val = parseInt(operand, 16);
                        }
                    }

                    if (isNaN(val)) throw new Error(`Invalid operand '${operand}' on line ${idx + 1}`);

                    if (match.bytes === 2) {
                        hex.push(val & 0xFF);
                        currentAddr++;
                    } else if (match.bytes === 3) {
                        hex.push(val & 0xFF);
                        hex.push((val >> 8) & 0xFF);
                        currentAddr += 2;
                    }
                }
            });
        } catch (e: any) {
            return { success: false, hex: [], labels: {}, error: e.message, lineMap: {} };
        }

        return { success: true, hex, labels, lineMap };
    }
}
