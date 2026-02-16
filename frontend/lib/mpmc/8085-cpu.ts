export interface CPUFlags {
    S: boolean;  // Sign
    Z: boolean;  // Zero
    AC: boolean; // Auxiliary Carry
    P: boolean;  // Parity
    CY: boolean; // Carry
}

export interface CPURegisters {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    H: number;
    L: number;
    PC: number;
    SP: number;
}

export class Intel8085 {
    registers: CPURegisters;
    flags: CPUFlags;
    memory: Uint8Array;
    isHalted: boolean = false;
    interruptEnabled: boolean = false;
    interruptMask: number = 0; // Bits for 7.5, 6.5, 5.5 etc.

    constructor() {
        this.registers = {
            A: 0, B: 0, C: 0, D: 0, E: 0, H: 0, L: 0, PC: 0, SP: 0xFFFF
        };
        this.flags = {
            S: false, Z: false, AC: false, P: false, CY: false
        };
        this.memory = new Uint8Array(65536); // 64KB
    }

    reset() {
        this.registers = {
            A: 0, B: 0, C: 0, D: 0, E: 0, H: 0, L: 0, PC: 0, SP: 0xFFFF
        };
        this.flags = {
            S: false, Z: false, AC: false, P: false, CY: false
        };
        this.isHalted = false;
    }

    // Helper functions for flag updates
    updateFlags(value: number, is8Bit: boolean = true) {
        const mask = is8Bit ? 0xFF : 0xFFFF;
        const res = value & mask;

        this.flags.Z = res === 0;
        this.flags.S = is8Bit ? (res & 0x80) !== 0 : (res & 0x8000) !== 0;
        this.flags.P = this.calculateParity(res);
    }

    calculateParity(n: number): boolean {
        let count = 0;
        let temp = n & 0xFF;
        while (temp > 0) {
            if (temp & 1) count++;
            temp >>= 1;
        }
        return count % 2 === 0;
    }

    // Memory operations
    readByte(address: number): number {
        return this.memory[address & 0xFFFF] || 0;
    }

    writeByte(address: number, value: number) {
        this.memory[address & 0xFFFF] = value & 0xFF;
    }

    readWord(address: number): number {
        const low = this.readByte(address);
        const high = this.readByte(address + 1);
        return (high << 8) | low;
    }

    writeWord(address: number, value: number) {
        this.writeByte(address, value & 0xFF);
        this.writeByte(address + 1, (value >> 8) & 0xFF);
    }

    // Stack operations
    push(value: number) {
        this.registers.SP -= 2;
        this.writeWord(this.registers.SP, value);
    }

    pop(): number {
        const value = this.readWord(this.registers.SP);
        this.registers.SP += 2;
        return value;
    }

    // Register Pair helpers
    getBC(): number { return (this.registers.B << 8) | this.registers.C; }
    setBC(val: number) { this.registers.B = (val >> 8) & 0xFF; this.registers.C = val & 0xFF; }

    getDE(): number { return (this.registers.D << 8) | this.registers.E; }
    setDE(val: number) { this.registers.D = (val >> 8) & 0xFF; this.registers.E = val & 0xFF; }

    getHL(): number { return (this.registers.H << 8) | this.registers.L; }
    setHL(val: number) { this.registers.H = (val >> 8) & 0xFF; this.registers.L = val & 0xFF; }

    // Execute one instruction
    step(): { opcode: number, mnemonic: string, bytes: number, pc: number, error?: string } {
        if (this.isHalted) return { opcode: 0, mnemonic: "HLT", bytes: 1, pc: this.registers.PC };

        const pc = this.registers.PC;
        const opcode = this.readByte(pc);
        this.registers.PC++;

        const result = this.executeOpcode(opcode);
        if (result.mnemonic === "UNKNOWN") {
            this.isHalted = true;
            return { ...result, pc, error: `Unknown opcode: ${opcode.toString(16).toUpperCase()}H` };
        }
        return { ...result, pc };
    }

    private updateZSP(res: number) {
        this.flags.Z = (res & 0xFF) === 0;
        this.flags.S = (res & 0x80) !== 0;
        this.flags.P = this.calculateParity(res & 0xFF);
    }

    private executeOpcode(opcode: number): { opcode: number, mnemonic: string, bytes: number } {
        switch (opcode) {
            case 0x00: return { opcode, mnemonic: "NOP", bytes: 1 };
            case 0x76: this.isHalted = true; return { opcode, mnemonic: "HLT", bytes: 1 };

            // LXI
            case 0x01: this.setBC(this.readWord(this.registers.PC)); this.registers.PC += 2; return { opcode, mnemonic: "LXI B", bytes: 3 };
            case 0x11: this.setDE(this.readWord(this.registers.PC)); this.registers.PC += 2; return { opcode, mnemonic: "LXI D", bytes: 3 };
            case 0x21: this.setHL(this.readWord(this.registers.PC)); this.registers.PC += 2; return { opcode, mnemonic: "LXI H", bytes: 3 };
            case 0x31: this.registers.SP = this.readWord(this.registers.PC); this.registers.PC += 2; return { opcode, mnemonic: "LXI SP", bytes: 3 };

            // MVI
            case 0x06: this.registers.B = this.readByte(this.registers.PC++); return { opcode, mnemonic: "MVI B", bytes: 2 };
            case 0x0E: this.registers.C = this.readByte(this.registers.PC++); return { opcode, mnemonic: "MVI C", bytes: 2 };
            case 0x16: this.registers.D = this.readByte(this.registers.PC++); return { opcode, mnemonic: "MVI D", bytes: 2 };
            case 0x1E: this.registers.E = this.readByte(this.registers.PC++); return { opcode, mnemonic: "MVI E", bytes: 2 };
            case 0x26: this.registers.H = this.readByte(this.registers.PC++); return { opcode, mnemonic: "MVI H", bytes: 2 };
            case 0x2E: this.registers.L = this.readByte(this.registers.PC++); return { opcode, mnemonic: "MVI L", bytes: 2 };
            case 0x36: this.writeByte(this.getHL(), this.readByte(this.registers.PC++)); return { opcode, mnemonic: "MVI M", bytes: 2 };
            case 0x3E: this.registers.A = this.readByte(this.registers.PC++); return { opcode, mnemonic: "MVI A", bytes: 2 };

            // MOV
            case 0x47: this.registers.B = this.registers.A; return { opcode, mnemonic: "MOV B,A", bytes: 1 };
            case 0x40: this.registers.B = this.registers.B; return { opcode, mnemonic: "MOV B,B", bytes: 1 };
            case 0x41: this.registers.B = this.registers.C; return { opcode, mnemonic: "MOV B,C", bytes: 1 };
            case 0x42: this.registers.B = this.registers.D; return { opcode, mnemonic: "MOV B,D", bytes: 1 };
            case 0x43: this.registers.B = this.registers.E; return { opcode, mnemonic: "MOV B,E", bytes: 1 };
            case 0x44: this.registers.B = this.registers.H; return { opcode, mnemonic: "MOV B,H", bytes: 1 };
            case 0x45: this.registers.B = this.registers.L; return { opcode, mnemonic: "MOV B,L", bytes: 1 };
            case 0x46: this.registers.B = this.readByte(this.getHL()); return { opcode, mnemonic: "MOV B,M", bytes: 1 };

            case 0x4F: this.registers.C = this.registers.A; return { opcode, mnemonic: "MOV C,A", bytes: 1 };
            case 0x48: this.registers.C = this.registers.B; return { opcode, mnemonic: "MOV C,B", bytes: 1 };
            case 0x49: this.registers.C = this.registers.C; return { opcode, mnemonic: "MOV C,C", bytes: 1 };
            case 0x4A: this.registers.C = this.registers.D; return { opcode, mnemonic: "MOV C,D", bytes: 1 };
            case 0x4B: this.registers.C = this.registers.E; return { opcode, mnemonic: "MOV C,E", bytes: 1 };
            case 0x4C: this.registers.C = this.registers.H; return { opcode, mnemonic: "MOV C,H", bytes: 1 };
            case 0x4D: this.registers.C = this.registers.L; return { opcode, mnemonic: "MOV C,L", bytes: 1 };
            case 0x4E: this.registers.C = this.readByte(this.getHL()); return { opcode, mnemonic: "MOV C,M", bytes: 1 };

            case 0x57: this.registers.D = this.registers.A; return { opcode, mnemonic: "MOV D,A", bytes: 1 };
            case 0x50: this.registers.D = this.registers.B; return { opcode, mnemonic: "MOV D,B", bytes: 1 };
            case 0x51: this.registers.D = this.registers.C; return { opcode, mnemonic: "MOV D,C", bytes: 1 };
            case 0x52: this.registers.D = this.registers.D; return { opcode, mnemonic: "MOV D,D", bytes: 1 };
            case 0x53: this.registers.D = this.registers.E; return { opcode, mnemonic: "MOV D,E", bytes: 1 };
            case 0x54: this.registers.D = this.registers.H; return { opcode, mnemonic: "MOV D,H", bytes: 1 };
            case 0x55: this.registers.D = this.registers.L; return { opcode, mnemonic: "MOV D,L", bytes: 1 };
            case 0x56: this.registers.D = this.readByte(this.getHL()); return { opcode, mnemonic: "MOV D,M", bytes: 1 };

            case 0x5F: this.registers.E = this.registers.A; return { opcode, mnemonic: "MOV E,A", bytes: 1 };
            case 0x58: this.registers.E = this.registers.B; return { opcode, mnemonic: "MOV E,B", bytes: 1 };
            case 0x59: this.registers.E = this.registers.C; return { opcode, mnemonic: "MOV E,C", bytes: 1 };
            case 0x5A: this.registers.E = this.registers.D; return { opcode, mnemonic: "MOV E,D", bytes: 1 };
            case 0x5B: this.registers.E = this.registers.E; return { opcode, mnemonic: "MOV E,E", bytes: 1 };
            case 0x5C: this.registers.E = this.registers.H; return { opcode, mnemonic: "MOV E,H", bytes: 1 };
            case 0x5D: this.registers.E = this.registers.L; return { opcode, mnemonic: "MOV E,L", bytes: 1 };
            case 0x5E: this.registers.E = this.readByte(this.getHL()); return { opcode, mnemonic: "MOV E,M", bytes: 1 };

            case 0x67: this.registers.H = this.registers.A; return { opcode, mnemonic: "MOV H,A", bytes: 1 };
            case 0x60: this.registers.H = this.registers.B; return { opcode, mnemonic: "MOV H,B", bytes: 1 };
            case 0x61: this.registers.H = this.registers.C; return { opcode, mnemonic: "MOV H,C", bytes: 1 };
            case 0x62: this.registers.H = this.registers.D; return { opcode, mnemonic: "MOV H,D", bytes: 1 };
            case 0x63: this.registers.H = this.registers.E; return { opcode, mnemonic: "MOV H,E", bytes: 1 };
            case 0x64: this.registers.H = this.registers.H; return { opcode, mnemonic: "MOV H,H", bytes: 1 };
            case 0x65: this.registers.H = this.registers.L; return { opcode, mnemonic: "MOV H,L", bytes: 1 };
            case 0x66: this.registers.H = this.readByte(this.getHL()); return { opcode, mnemonic: "MOV H,M", bytes: 1 };

            case 0x6F: this.registers.L = this.registers.A; return { opcode, mnemonic: "MOV L,A", bytes: 1 };
            case 0x68: this.registers.L = this.registers.B; return { opcode, mnemonic: "MOV L,B", bytes: 1 };
            case 0x69: this.registers.L = this.registers.C; return { opcode, mnemonic: "MOV L,C", bytes: 1 };
            case 0x6A: this.registers.L = this.registers.D; return { opcode, mnemonic: "MOV L,D", bytes: 1 };
            case 0x6B: this.registers.L = this.registers.E; return { opcode, mnemonic: "MOV L,E", bytes: 1 };
            case 0x6C: this.registers.L = this.registers.H; return { opcode, mnemonic: "MOV L,H", bytes: 1 };
            case 0x6D: this.registers.L = this.registers.L; return { opcode, mnemonic: "MOV L,L", bytes: 1 };
            case 0x6E: this.registers.L = this.readByte(this.getHL()); return { opcode, mnemonic: "MOV L,M", bytes: 1 };

            case 0x7F: this.registers.A = this.registers.A; return { opcode, mnemonic: "MOV A,A", bytes: 1 };
            case 0x78: this.registers.A = this.registers.B; return { opcode, mnemonic: "MOV A,B", bytes: 1 };
            case 0x79: this.registers.A = this.registers.C; return { opcode, mnemonic: "MOV A,C", bytes: 1 };
            case 0x7A: this.registers.A = this.registers.D; return { opcode, mnemonic: "MOV A,D", bytes: 1 };
            case 0x7B: this.registers.A = this.registers.E; return { opcode, mnemonic: "MOV A,E", bytes: 1 };
            case 0x7C: this.registers.A = this.registers.H; return { opcode, mnemonic: "MOV A,H", bytes: 1 };
            case 0x7D: this.registers.A = this.registers.L; return { opcode, mnemonic: "MOV A,L", bytes: 1 };
            case 0x7E: this.registers.A = this.readByte(this.getHL()); return { opcode, mnemonic: "MOV A,M", bytes: 1 };

            case 0x77: this.writeByte(this.getHL(), this.registers.A); return { opcode, mnemonic: "MOV M,A", bytes: 1 };
            case 0x70: this.writeByte(this.getHL(), this.registers.B); return { opcode, mnemonic: "MOV M,B", bytes: 1 };
            case 0x71: this.writeByte(this.getHL(), this.registers.C); return { opcode, mnemonic: "MOV M,C", bytes: 1 };
            case 0x72: this.writeByte(this.getHL(), this.registers.D); return { opcode, mnemonic: "MOV M,D", bytes: 1 };
            case 0x73: this.writeByte(this.getHL(), this.registers.E); return { opcode, mnemonic: "MOV M,E", bytes: 1 };
            case 0x74: this.writeByte(this.getHL(), this.registers.H); return { opcode, mnemonic: "MOV M,H", bytes: 1 };
            case 0x75: this.writeByte(this.getHL(), this.registers.L); return { opcode, mnemonic: "MOV M,L", bytes: 1 };

            // LDAX / STAX
            case 0x0A: this.registers.A = this.readByte(this.getBC()); return { opcode, mnemonic: "LDAX B", bytes: 1 };
            case 0x1A: this.registers.A = this.readByte(this.getDE()); return { opcode, mnemonic: "LDAX D", bytes: 1 };
            case 0x02: this.writeByte(this.getBC(), this.registers.A); return { opcode, mnemonic: "STAX B", bytes: 1 };
            case 0x12: this.writeByte(this.getDE(), this.registers.A); return { opcode, mnemonic: "STAX D", bytes: 1 };

            // LDA / STA / LHLD / SHLD
            case 0x3A: this.registers.A = this.readByte(this.readWord(this.registers.PC)); this.registers.PC += 2; return { opcode, mnemonic: "LDA", bytes: 3 };
            case 0x32: this.writeByte(this.readWord(this.registers.PC), this.registers.A); this.registers.PC += 2; return { opcode, mnemonic: "STA", bytes: 3 };
            case 0x2A: this.setHL(this.readWord(this.readWord(this.registers.PC))); this.registers.PC += 2; return { opcode, mnemonic: "LHLD", bytes: 3 };
            case 0x22: this.writeWord(this.readWord(this.registers.PC), this.getHL()); this.registers.PC += 2; return { opcode, mnemonic: "SHLD", bytes: 3 };

            // XCHG
            case 0xEB: {
                const hl = this.getHL();
                const de = this.getDE();
                this.setHL(de);
                this.setDE(hl);
                return { opcode, mnemonic: "XCHG", bytes: 1 };
            }

            // IN / OUT
            case 0xD3: this.registers.PC++; return { opcode, mnemonic: "OUT", bytes: 2 }; // Stub
            case 0xDB: this.registers.PC++; return { opcode, mnemonic: "IN", bytes: 2 };  // Stub

            // ADD
            case 0x80: this.add(this.registers.B); return { opcode, mnemonic: "ADD B", bytes: 1 };
            case 0x81: this.add(this.registers.C); return { opcode, mnemonic: "ADD C", bytes: 1 };
            case 0x82: this.add(this.registers.D); return { opcode, mnemonic: "ADD D", bytes: 1 };
            case 0x83: this.add(this.registers.E); return { opcode, mnemonic: "ADD E", bytes: 1 };
            case 0x84: this.add(this.registers.H); return { opcode, mnemonic: "ADD H", bytes: 1 };
            case 0x85: this.add(this.registers.L); return { opcode, mnemonic: "ADD L", bytes: 1 };
            case 0x86: this.add(this.readByte(this.getHL())); return { opcode, mnemonic: "ADD M", bytes: 1 };
            case 0x87: this.add(this.registers.A); return { opcode, mnemonic: "ADD A", bytes: 1 };
            case 0xC6: this.add(this.readByte(this.registers.PC++)); return { opcode, mnemonic: "ADI", bytes: 2 };

            // ADC
            case 0x88: this.adc(this.registers.B); return { opcode, mnemonic: "ADC B", bytes: 1 };
            case 0x89: this.adc(this.registers.C); return { opcode, mnemonic: "ADC C", bytes: 1 };
            case 0x8A: this.adc(this.registers.D); return { opcode, mnemonic: "ADC D", bytes: 1 };
            case 0x8B: this.adc(this.registers.E); return { opcode, mnemonic: "ADC E", bytes: 1 };
            case 0x8C: this.adc(this.registers.H); return { opcode, mnemonic: "ADC H", bytes: 1 };
            case 0x8D: this.adc(this.registers.L); return { opcode, mnemonic: "ADC L", bytes: 1 };
            case 0x8E: this.adc(this.readByte(this.getHL())); return { opcode, mnemonic: "ADC M", bytes: 1 };
            case 0x8F: this.adc(this.registers.A); return { opcode, mnemonic: "ADC A", bytes: 1 };
            case 0xCE: this.adc(this.readByte(this.registers.PC++)); return { opcode, mnemonic: "ACI", bytes: 2 };

            // SUB
            case 0x90: this.sub(this.registers.B); return { opcode, mnemonic: "SUB B", bytes: 1 };
            case 0x91: this.sub(this.registers.C); return { opcode, mnemonic: "SUB C", bytes: 1 };
            case 0x92: this.sub(this.registers.D); return { opcode, mnemonic: "SUB D", bytes: 1 };
            case 0x93: this.sub(this.registers.E); return { opcode, mnemonic: "SUB E", bytes: 1 };
            case 0x94: this.sub(this.registers.H); return { opcode, mnemonic: "SUB H", bytes: 1 };
            case 0x95: this.sub(this.registers.L); return { opcode, mnemonic: "SUB L", bytes: 1 };
            case 0x96: this.sub(this.readByte(this.getHL())); return { opcode, mnemonic: "SUB M", bytes: 1 };
            case 0x97: this.sub(this.registers.A); return { opcode, mnemonic: "SUB A", bytes: 1 };
            case 0xD6: this.sub(this.readByte(this.registers.PC++)); return { opcode, mnemonic: "SUI", bytes: 2 };

            // SBB
            case 0x98: this.sbb(this.registers.B); return { opcode, mnemonic: "SBB B", bytes: 1 };
            case 0x99: this.sbb(this.registers.C); return { opcode, mnemonic: "SBB C", bytes: 1 };
            case 0x9A: this.sbb(this.registers.D); return { opcode, mnemonic: "SBB D", bytes: 1 };
            case 0x9B: this.sbb(this.registers.E); return { opcode, mnemonic: "SBB E", bytes: 1 };
            case 0x9C: this.sbb(this.registers.H); return { opcode, mnemonic: "SBB H", bytes: 1 };
            case 0x9D: this.sbb(this.registers.L); return { opcode, mnemonic: "SBB L", bytes: 1 };
            case 0x9E: this.sbb(this.readByte(this.getHL())); return { opcode, mnemonic: "SBB M", bytes: 1 };
            case 0x9F: this.sbb(this.registers.A); return { opcode, mnemonic: "SBB A", bytes: 1 };
            case 0xDE: this.sbb(this.readByte(this.registers.PC++)); return { opcode, mnemonic: "SBI", bytes: 2 };

            // INR
            case 0x04: this.registers.B = this.inr(this.registers.B); return { opcode, mnemonic: "INR B", bytes: 1 };
            case 0x0C: this.registers.C = this.inr(this.registers.C); return { opcode, mnemonic: "INR C", bytes: 1 };
            case 0x14: this.registers.D = this.inr(this.registers.D); return { opcode, mnemonic: "INR D", bytes: 1 };
            case 0x1C: this.registers.E = this.inr(this.registers.E); return { opcode, mnemonic: "INR E", bytes: 1 };
            case 0x24: this.registers.H = this.inr(this.registers.H); return { opcode, mnemonic: "INR H", bytes: 1 };
            case 0x2C: this.registers.L = this.inr(this.registers.L); return { opcode, mnemonic: "INR L", bytes: 1 };
            case 0x34: this.writeByte(this.getHL(), this.inr(this.readByte(this.getHL()))); return { opcode, mnemonic: "INR M", bytes: 1 };
            case 0x3C: this.registers.A = this.inr(this.registers.A); return { opcode, mnemonic: "INR A", bytes: 1 };

            // DCR
            case 0x05: this.registers.B = this.dcr(this.registers.B); return { opcode, mnemonic: "DCR B", bytes: 1 };
            case 0x0D: this.registers.C = this.dcr(this.registers.C); return { opcode, mnemonic: "DCR C", bytes: 1 };
            case 0x15: this.registers.D = this.dcr(this.registers.D); return { opcode, mnemonic: "DCR D", bytes: 1 };
            case 0x1D: this.registers.E = this.dcr(this.registers.E); return { opcode, mnemonic: "DCR E", bytes: 1 };
            case 0x25: this.registers.H = this.dcr(this.registers.H); return { opcode, mnemonic: "DCR H", bytes: 1 };
            case 0x2D: this.registers.L = this.dcr(this.registers.L); return { opcode, mnemonic: "DCR L", bytes: 1 };
            case 0x35: this.writeByte(this.getHL(), this.dcr(this.readByte(this.getHL()))); return { opcode, mnemonic: "DCR M", bytes: 1 };
            case 0x3D: this.registers.A = this.dcr(this.registers.A); return { opcode, mnemonic: "DCR A", bytes: 1 };

            // INX
            case 0x03: this.setBC((this.getBC() + 1) & 0xFFFF); return { opcode, mnemonic: "INX B", bytes: 1 };
            case 0x13: this.setDE((this.getDE() + 1) & 0xFFFF); return { opcode, mnemonic: "INX D", bytes: 1 };
            case 0x23: this.setHL((this.getHL() + 1) & 0xFFFF); return { opcode, mnemonic: "INX H", bytes: 1 };
            case 0x33: this.registers.SP = (this.registers.SP + 1) & 0xFFFF; return { opcode, mnemonic: "INX SP", bytes: 1 };

            // DCX
            case 0x0B: this.setBC((this.getBC() - 1) & 0xFFFF); return { opcode, mnemonic: "DCX B", bytes: 1 };
            case 0x1B: this.setDE((this.getDE() - 1) & 0xFFFF); return { opcode, mnemonic: "DCX D", bytes: 1 };
            case 0x2B: this.setHL((this.getHL() - 1) & 0xFFFF); return { opcode, mnemonic: "DCX H", bytes: 1 };
            case 0x3B: this.registers.SP = (this.registers.SP - 1) & 0xFFFF; return { opcode, mnemonic: "DCX SP", bytes: 1 };

            // DAD
            case 0x09: this.dad(this.getBC()); return { opcode, mnemonic: "DAD B", bytes: 1 };
            case 0x19: this.dad(this.getDE()); return { opcode, mnemonic: "DAD D", bytes: 1 };
            case 0x29: this.dad(this.getHL()); return { opcode, mnemonic: "DAD H", bytes: 1 };
            case 0x39: this.dad(this.registers.SP); return { opcode, mnemonic: "DAD SP", bytes: 1 };

            // DAA
            case 0x27: {
                let res = this.registers.A;
                if ((res & 0x0F) > 9 || this.flags.AC) {
                    res += 6;
                    this.flags.AC = true;
                }
                if ((res >> 4) > 9 || this.flags.CY) {
                    res += 0x60;
                    this.flags.CY = true;
                }
                this.registers.A = res & 0xFF;
                this.updateZSP(this.registers.A);
                return { opcode, mnemonic: "DAA", bytes: 1 };
            }

            // ANA
            case 0xA0: this.ana(this.registers.B); return { opcode, mnemonic: "ANA B", bytes: 1 };
            case 0xA1: this.ana(this.registers.C); return { opcode, mnemonic: "ANA C", bytes: 1 };
            case 0xA2: this.ana(this.registers.D); return { opcode, mnemonic: "ANA D", bytes: 1 };
            case 0xA3: this.ana(this.registers.E); return { opcode, mnemonic: "ANA E", bytes: 1 };
            case 0xA4: this.ana(this.registers.H); return { opcode, mnemonic: "ANA H", bytes: 1 };
            case 0xA5: this.ana(this.registers.L); return { opcode, mnemonic: "ANA L", bytes: 1 };
            case 0xA6: this.ana(this.readByte(this.getHL())); return { opcode, mnemonic: "ANA M", bytes: 1 };
            case 0xA7: this.ana(this.registers.A); return { opcode, mnemonic: "ANA A", bytes: 1 };
            case 0xE6: this.ana(this.readByte(this.registers.PC++)); return { opcode, mnemonic: "ANI", bytes: 2 };

            // ORA
            case 0xB0: this.ora(this.registers.B); return { opcode, mnemonic: "ORA B", bytes: 1 };
            case 0xB1: this.ora(this.registers.C); return { opcode, mnemonic: "ORA C", bytes: 1 };
            case 0xB2: this.ora(this.registers.D); return { opcode, mnemonic: "ORA D", bytes: 1 };
            case 0xB3: this.ora(this.registers.E); return { opcode, mnemonic: "ORA E", bytes: 1 };
            case 0xB4: this.ora(this.registers.H); return { opcode, mnemonic: "ORA H", bytes: 1 };
            case 0xB5: this.ora(this.registers.L); return { opcode, mnemonic: "ORA L", bytes: 1 };
            case 0xB6: this.ora(this.readByte(this.getHL())); return { opcode, mnemonic: "ORA M", bytes: 1 };
            case 0xB7: this.ora(this.registers.A); return { opcode, mnemonic: "ORA A", bytes: 1 };
            case 0xF6: this.ora(this.readByte(this.registers.PC++)); return { opcode, mnemonic: "ORI", bytes: 2 };

            // XRA
            case 0xA8: this.xra(this.registers.B); return { opcode, mnemonic: "XRA B", bytes: 1 };
            case 0xA9: this.xra(this.registers.C); return { opcode, mnemonic: "XRA C", bytes: 1 };
            case 0xAA: this.xra(this.registers.D); return { opcode, mnemonic: "XRA D", bytes: 1 };
            case 0xAB: this.xra(this.registers.E); return { opcode, mnemonic: "XRA E", bytes: 1 };
            case 0xAC: this.xra(this.registers.H); return { opcode, mnemonic: "XRA H", bytes: 1 };
            case 0xAD: this.xra(this.registers.L); return { opcode, mnemonic: "XRA L", bytes: 1 };
            case 0xAE: this.xra(this.readByte(this.getHL())); return { opcode, mnemonic: "XRA M", bytes: 1 };
            case 0xAF: this.xra(this.registers.A); return { opcode, mnemonic: "XRA A", bytes: 1 };
            case 0xEE: this.xra(this.readByte(this.registers.PC++)); return { opcode, mnemonic: "XRI", bytes: 2 };

            // CMP
            case 0xB8: this.cmp(this.registers.B); return { opcode, mnemonic: "CMP B", bytes: 1 };
            case 0xB9: this.cmp(this.registers.C); return { opcode, mnemonic: "CMP C", bytes: 1 };
            case 0xBA: this.cmp(this.registers.D); return { opcode, mnemonic: "CMP D", bytes: 1 };
            case 0xBB: this.cmp(this.registers.E); return { opcode, mnemonic: "CMP E", bytes: 1 };
            case 0xBC: this.cmp(this.registers.H); return { opcode, mnemonic: "CMP H", bytes: 1 };
            case 0xBD: this.cmp(this.registers.L); return { opcode, mnemonic: "CMP L", bytes: 1 };
            case 0xBE: this.cmp(this.readByte(this.getHL())); return { opcode, mnemonic: "CMP M", bytes: 1 };
            case 0xBF: this.cmp(this.registers.A); return { opcode, mnemonic: "CMP A", bytes: 1 };
            case 0xFE: this.cmp(this.readByte(this.registers.PC++)); return { opcode, mnemonic: "CPI", bytes: 2 };

            // CMA / CMC / STC
            case 0x2F: this.registers.A = (~this.registers.A) & 0xFF; return { opcode, mnemonic: "CMA", bytes: 1 };
            case 0x3F: this.flags.CY = !this.flags.CY; return { opcode, mnemonic: "CMC", bytes: 1 };
            case 0x37: this.flags.CY = true; return { opcode, mnemonic: "STC", bytes: 1 };

            // JMP
            case 0xC3: this.registers.PC = this.readWord(this.registers.PC); return { opcode, mnemonic: "JMP", bytes: 3 };
            case 0xC2: this.jumpIf(!this.flags.Z); return { opcode, mnemonic: "JNZ", bytes: 3 };
            case 0xCA: this.jumpIf(this.flags.Z); return { opcode, mnemonic: "JZ", bytes: 3 };
            case 0xD2: this.jumpIf(!this.flags.CY); return { opcode, mnemonic: "JNC", bytes: 3 };
            case 0xDA: this.jumpIf(this.flags.CY); return { opcode, mnemonic: "JC", bytes: 3 };
            case 0xE2: this.jumpIf(!this.flags.P); return { opcode, mnemonic: "JPO", bytes: 3 };
            case 0xEA: this.jumpIf(this.flags.P); return { opcode, mnemonic: "JPE", bytes: 3 };
            case 0xF2: this.jumpIf(!this.flags.S); return { opcode, mnemonic: "JP", bytes: 3 };
            case 0xFA: this.jumpIf(this.flags.S); return { opcode, mnemonic: "JM", bytes: 3 };

            // CALL
            case 0xCD: this.call(); return { opcode, mnemonic: "CALL", bytes: 3 };
            case 0xC4: this.callIf(!this.flags.Z); return { opcode, mnemonic: "CNZ", bytes: 3 };
            case 0xCC: this.callIf(this.flags.Z); return { opcode, mnemonic: "CZ", bytes: 3 };
            case 0xD4: this.callIf(!this.flags.CY); return { opcode, mnemonic: "CNC", bytes: 3 };
            case 0xDC: this.callIf(this.flags.CY); return { opcode, mnemonic: "CC", bytes: 3 };
            case 0xE4: this.callIf(!this.flags.P); return { opcode, mnemonic: "CPO", bytes: 3 };
            case 0xEC: this.callIf(this.flags.P); return { opcode, mnemonic: "CPE", bytes: 3 };
            case 0xF4: this.callIf(!this.flags.S); return { opcode, mnemonic: "CP", bytes: 3 };
            case 0xFC: this.callIf(this.flags.S); return { opcode, mnemonic: "CM", bytes: 3 };

            // RET
            case 0xC9: this.registers.PC = this.pop(); return { opcode, mnemonic: "RET", bytes: 1 };
            case 0xC0: this.retIf(!this.flags.Z); return { opcode, mnemonic: "RNZ", bytes: 1 };
            case 0xC8: this.retIf(this.flags.Z); return { opcode, mnemonic: "RZ", bytes: 1 };
            case 0xD0: this.retIf(!this.flags.CY); return { opcode, mnemonic: "RNC", bytes: 1 };
            case 0xD8: this.retIf(this.flags.CY); return { opcode, mnemonic: "RC", bytes: 1 };
            case 0xE0: this.retIf(!this.flags.P); return { opcode, mnemonic: "RPO", bytes: 1 };
            case 0xE8: this.retIf(this.flags.P); return { opcode, mnemonic: "RPE", bytes: 1 };
            case 0xF0: this.retIf(!this.flags.S); return { opcode, mnemonic: "RP", bytes: 1 };
            case 0xF8: this.retIf(this.flags.S); return { opcode, mnemonic: "RM", bytes: 1 };

            // PUSH
            case 0xC5: this.push(this.getBC()); return { opcode, mnemonic: "PUSH B", bytes: 1 };
            case 0xD5: this.push(this.getDE()); return { opcode, mnemonic: "PUSH D", bytes: 1 };
            case 0xE5: this.push(this.getHL()); return { opcode, mnemonic: "PUSH H", bytes: 1 };
            case 0xF5: this.push(this.getPSW()); return { opcode, mnemonic: "PUSH PSW", bytes: 1 };

            // POP
            case 0xC1: this.setBC(this.pop()); return { opcode, mnemonic: "POP B", bytes: 1 };
            case 0xD1: this.setDE(this.pop()); return { opcode, mnemonic: "POP D", bytes: 1 };
            case 0xE1: this.setHL(this.pop()); return { opcode, mnemonic: "POP H", bytes: 1 };
            case 0xF1: this.setPSW(this.pop()); return { opcode, mnemonic: "POP PSW", bytes: 1 };

            // XTHL / SPHL / PCHL
            case 0xE3: {
                const val = this.readWord(this.registers.SP);
                this.writeWord(this.registers.SP, this.getHL());
                this.setHL(val);
                return { opcode, mnemonic: "XTHL", bytes: 1 };
            }
            case 0xF9: this.registers.SP = this.getHL(); return { opcode, mnemonic: "SPHL", bytes: 1 };
            case 0xE9: this.registers.PC = this.getHL(); return { opcode, mnemonic: "PCHL", bytes: 1 };

            // ROTATE
            case 0x07: { // RLC
                const carry = (this.registers.A & 0x80) !== 0;
                this.registers.A = ((this.registers.A << 1) | (carry ? 1 : 0)) & 0xFF;
                this.flags.CY = carry;
                return { opcode, mnemonic: "RLC", bytes: 1 };
            }
            case 0x0F: { // RRC
                const carry = (this.registers.A & 0x01) !== 0;
                this.registers.A = ((this.registers.A >> 1) | (carry ? 0x80 : 0)) & 0xFF;
                this.flags.CY = carry;
                return { opcode, mnemonic: "RRC", bytes: 1 };
            }
            case 0x17: { // RAL
                const oldCarry = this.flags.CY;
                this.flags.CY = (this.registers.A & 0x80) !== 0;
                this.registers.A = ((this.registers.A << 1) | (oldCarry ? 1 : 0)) & 0xFF;
                return { opcode, mnemonic: "RAL", bytes: 1 };
            }
            case 0x1F: { // RAR
                const oldCarry = this.flags.CY;
                this.flags.CY = (this.registers.A & 0x01) !== 0;
                this.registers.A = ((this.registers.A >> 1) | (oldCarry ? 0x80 : 0)) & 0xFF;
                return { opcode, mnemonic: "RAR", bytes: 1 };
            }

            // Machine Control
            case 0xFB: this.interruptEnabled = true; return { opcode, mnemonic: "EI", bytes: 1 };
            case 0xF3: this.interruptEnabled = false; return { opcode, mnemonic: "DI", bytes: 1 };
            case 0x20: { // RIM
                let res = 0;
                if (this.interruptEnabled) res |= 0x08;
                res |= (this.interruptMask & 0x07);
                // Stub for serial input and pending interrupts
                this.registers.A = res;
                return { opcode, mnemonic: "RIM", bytes: 1 };
            }
            case 0x30: { // SIM
                const val = this.registers.A;
                if (val & 0x08) { // MSE (Mask Set Enable)
                    this.interruptMask = val & 0x07;
                }
                // Stub for SOD (Serial Output Data)
                return { opcode, mnemonic: "SIM", bytes: 1 };
            }

            default:
                this.isHalted = true;
                return { opcode, mnemonic: "UNKNOWN", bytes: 1 };
        }
    }

    // --- Core Instruction Implementations ---
    private add(val: number) {
        const res = this.registers.A + val;
        this.flags.AC = ((this.registers.A & 0x0F) + (val & 0x0F)) > 0x0F;
        this.registers.A = res & 0xFF;
        this.updateZSP(this.registers.A);
        this.flags.CY = res > 0xFF;
    }

    private adc(val: number) {
        const carry = this.flags.CY ? 1 : 0;
        const res = this.registers.A + val + carry;
        this.flags.AC = ((this.registers.A & 0x0F) + (val & 0x0F) + carry) > 0x0F;
        this.registers.A = res & 0xFF;
        this.updateZSP(this.registers.A);
        this.flags.CY = res > 0xFF;
    }

    private sub(val: number) {
        const res = this.registers.A - val;
        this.flags.AC = ((this.registers.A & 0x0F) - (val & 0x0F)) < 0;
        this.registers.A = res & 0xFF;
        this.updateZSP(this.registers.A);
        this.flags.CY = res < 0;
    }

    private sbb(val: number) {
        const carry = this.flags.CY ? 1 : 0;
        const res = this.registers.A - val - carry;
        this.flags.AC = ((this.registers.A & 0x0F) - (val & 0x0F) - carry) < 0;
        this.registers.A = res & 0xFF;
        this.updateZSP(this.registers.A);
        this.flags.CY = res < 0;
    }

    private inr(val: number): number {
        const res = (val + 1) & 0xFF;
        this.flags.AC = (val & 0x0F) === 0x0F;
        this.updateZSP(res);
        return res;
    }

    private dcr(val: number): number {
        const res = (val - 1) & 0xFF;
        this.flags.AC = (val & 0x0F) === 0x00;
        this.updateZSP(res);
        return res;
    }

    private dad(val: number) {
        const hl = this.getHL();
        const res = hl + val;
        this.setHL(res & 0xFFFF);
        this.flags.CY = res > 0xFFFF;
    }

    private ana(val: number) {
        this.registers.A &= val;
        this.updateZSP(this.registers.A);
        this.flags.CY = false;
        this.flags.AC = true; // 8085 spec: AC is set for ANA
    }

    private ora(val: number) {
        this.registers.A |= val;
        this.updateZSP(this.registers.A);
        this.flags.CY = false;
        this.flags.AC = false;
    }

    private xra(val: number) {
        this.registers.A ^= val;
        this.updateZSP(this.registers.A);
        this.flags.CY = false;
        this.flags.AC = false;
    }

    private cmp(val: number) {
        const res = this.registers.A - val;
        this.flags.Z = (res & 0xFF) === 0;
        this.flags.S = (res & 0x80) !== 0;
        this.flags.P = this.calculateParity(res & 0xFF);
        this.flags.CY = this.registers.A < val;
        this.flags.AC = ((this.registers.A & 0x0F) - (val & 0x0F)) < 0;
    }

    private jumpIf(cond: boolean) {
        const addr = this.readWord(this.registers.PC);
        if (cond) this.registers.PC = addr;
        else this.registers.PC += 2;
    }

    private call() {
        const addr = this.readWord(this.registers.PC);
        this.push(this.registers.PC + 2);
        this.registers.PC = addr;
    }

    private callIf(cond: boolean) {
        const addr = this.readWord(this.registers.PC);
        if (cond) {
            this.push(this.registers.PC + 2);
            this.registers.PC = addr;
        } else {
            this.registers.PC += 2;
        }
    }

    private retIf(cond: boolean) {
        if (cond) this.registers.PC = this.pop();
    }

    private getPSW(): number {
        let psw = 0;
        if (this.flags.S) psw |= 0x80;
        if (this.flags.Z) psw |= 0x40;
        if (this.flags.AC) psw |= 0x10;
        if (this.flags.P) psw |= 0x04;
        psw |= 0x02; // Bit 1 is always 1
        if (this.flags.CY) psw |= 0x01;
        return (this.registers.A << 8) | psw;
    }

    private setPSW(val: number) {
        this.registers.A = (val >> 8) & 0xFF;
        const psw = val & 0xFF;
        this.flags.S = (psw & 0x80) !== 0;
        this.flags.Z = (psw & 0x40) !== 0;
        this.flags.AC = (psw & 0x10) !== 0;
        this.flags.P = (psw & 0x04) !== 0;
        this.flags.CY = (psw & 0x01) !== 0;
    }
    private inPort(port: number): number {
        // Dummy I/O for now
        return 0;
    }

    private outPort(port: number, val: number) {
        // Dummy I/O for now
        console.log(`OUT Port ${port.toString(16).toUpperCase()}: ${val.toString(16).toUpperCase()}H`);
    }
}
