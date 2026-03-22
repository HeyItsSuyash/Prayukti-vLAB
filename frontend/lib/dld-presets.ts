import { Edge, Node } from '@xyflow/react';

export interface PresetCircuit {
    nodes: Node[];
    edges: Edge[];
}

const createNode = (id: string, type: string, label: string, x: number, y: number, data: any = {}): Node => ({
    id,
    type,
    position: { x, y },
    data: { label, ...data },
});

const createEdge = (source: string, target: string, sourceHandle?: string, targetHandle?: string): Edge => ({
    id: `e-${source}-${target}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'signal',
    data: { value: 0 },
});

export const DLD_PRESETS: Record<string, PresetCircuit> = {
    // 1. Study and Verification of Logic Gates
    "dld-exp-1": {
        nodes: [
            // AND Gate
            createNode('in1', 'inputNode', 'A', 50, 50),
            createNode('in2', 'inputNode', 'B', 50, 150),
            createNode('gate1', 'and', 'AND', 250, 100),
            createNode('out1', 'outputNode', 'Q', 450, 100),

            // OR Gate
            createNode('in3', 'inputNode', 'A', 50, 300),
            createNode('in4', 'inputNode', 'B', 50, 400),
            createNode('gate2', 'or', 'OR', 250, 350),
            createNode('out2', 'outputNode', 'Q', 450, 350),

            // NOT Gate
            createNode('in5', 'inputNode', 'A', 50, 550),
            createNode('gate3', 'not', 'NOT', 250, 550),
            createNode('out3', 'outputNode', 'Q', 450, 550),
        ],
        edges: [
            // SimpleLogicGateNode uses 'a', 'b' for inputs, 'source' for output
            createEdge('in1', 'gate1', 'out', 'a'),
            createEdge('in2', 'gate1', 'out', 'b'),
            createEdge('gate1', 'out1', 'source', 'in'),

            createEdge('in3', 'gate2', 'out', 'a'),
            createEdge('in4', 'gate2', 'out', 'b'),
            createEdge('gate2', 'out2', 'source', 'in'),

            createEdge('in5', 'gate3', 'out', 'a'),
            createEdge('gate3', 'out3', 'source', 'in'),
        ]
    },

    // 2. Half Adder and Full Adder
    "dld-exp-2": {
        nodes: [
            // Half Adder Inputs
            createNode('ha_a', 'inputNode', 'A', 100, 100),
            createNode('ha_b', 'inputNode', 'B', 100, 200),

            // Half Adder Gates
            createNode('ha_xor', 'xor', 'Sum', 300, 100),
            createNode('ha_and', 'and', 'Carry', 300, 250),

            // Half Adder Outputs
            createNode('ha_sum', 'outputNode', 'Sum', 500, 100),
            createNode('ha_carry', 'outputNode', 'Carry', 500, 250),


            // Full Adder Inputs
            createNode('fa_a', 'inputNode', 'A', 100, 400),
            createNode('fa_b', 'inputNode', 'B', 100, 500),
            createNode('fa_cin', 'inputNode', 'Cin', 100, 600),

            // Full Adder Gates
            createNode('fa_xor1', 'xor', '', 300, 420),
            createNode('fa_xor2', 'xor', 'Sum', 500, 450),
            createNode('fa_and1', 'and', '', 300, 550),
            createNode('fa_and2', 'and', '', 500, 600),
            createNode('fa_or', 'or', 'Cout', 700, 580),

            // Full Adder Outputs
            createNode('fa_sum_out', 'outputNode', 'Sum', 700, 450),
            createNode('fa_carry_out', 'outputNode', 'Cout', 900, 580),
        ],
        edges: [
            // Half Adder
            createEdge('ha_a', 'ha_xor', 'out', 'a'),
            createEdge('ha_b', 'ha_xor', 'out', 'b'),
            createEdge('ha_a', 'ha_and', 'out', 'a'),
            createEdge('ha_b', 'ha_and', 'out', 'b'),
            createEdge('ha_xor', 'ha_sum', 'source', 'in'),
            createEdge('ha_and', 'ha_carry', 'source', 'in'),

            // Full Adder
            createEdge('fa_a', 'fa_xor1', 'out', 'a'),
            createEdge('fa_b', 'fa_xor1', 'out', 'b'),

            createEdge('fa_xor1', 'fa_xor2', 'source', 'a'),
            createEdge('fa_cin', 'fa_xor2', 'out', 'b'),

            createEdge('fa_xor2', 'fa_sum_out', 'source', 'in'),

            // Carry Logic
            createEdge('fa_a', 'fa_and1', 'out', 'a'),
            createEdge('fa_b', 'fa_and1', 'out', 'b'),

            createEdge('fa_xor1', 'fa_and2', 'source', 'a'),
            createEdge('fa_cin', 'fa_and2', 'out', 'b'),

            createEdge('fa_and1', 'fa_or', 'source', 'a'),
            createEdge('fa_and2', 'fa_or', 'source', 'b'),

            createEdge('fa_or', 'fa_carry_out', 'source', 'in'),
        ]
    },

    // 3. Half Subtractor and Full Subtractor
    "dld-exp-3": {
        nodes: [
            // Half Subtractor
            createNode('hs_a', 'inputNode', 'A', 100, 100),
            createNode('hs_b', 'inputNode', 'B', 100, 200),

            createNode('hs_xor', 'xor', 'Diff', 300, 100),
            createNode('hs_not', 'not', '', 200, 220),

            createNode('hs_and', 'and', 'Borrow', 400, 250),

            createNode('hs_diff', 'outputNode', 'Diff', 600, 100),
            createNode('hs_borrow', 'outputNode', 'Borrow', 600, 250),
        ],
        edges: [
            // Diff = A XOR B
            createEdge('hs_a', 'hs_xor', 'out', 'a'),
            createEdge('hs_b', 'hs_xor', 'out', 'b'),
            createEdge('hs_xor', 'hs_diff', 'source', 'in'),

            // Borrow = (~A) AND B
            createEdge('hs_a', 'hs_not', 'out', 'a'),
            createEdge('hs_not', 'hs_and', 'source', 'a'),
            createEdge('hs_b', 'hs_and', 'out', 'b'),
            createEdge('hs_and', 'hs_borrow', 'source', 'in'),
        ]
    },

    // 4. Code Conversion (Binary to Gray)
    "dld-exp-4": {
        nodes: [
            createNode('b3', 'inputNode', 'B3', 50, 50),
            createNode('b2', 'inputNode', 'B2', 50, 150),
            createNode('b1', 'inputNode', 'B1', 50, 250),
            createNode('b0', 'inputNode', 'B0', 50, 350),

            createNode('xor1', 'xor', '', 250, 150),
            createNode('xor2', 'xor', '', 250, 250),
            createNode('xor3', 'xor', '', 250, 350),

            createNode('g3', 'outputNode', 'G3', 450, 50),
            createNode('g2', 'outputNode', 'G2', 450, 150),
            createNode('g1', 'outputNode', 'G1', 450, 250),
            createNode('g0', 'outputNode', 'G0', 450, 350),
        ],
        edges: [
            createEdge('b3', 'g3', 'out', 'in'),

            createEdge('b3', 'xor1', 'out', 'a'),
            createEdge('b2', 'xor1', 'out', 'b'),
            createEdge('xor1', 'g2', 'source', 'in'),

            createEdge('b2', 'xor2', 'out', 'a'),
            createEdge('b1', 'xor2', 'out', 'b'),
            createEdge('xor2', 'g1', 'source', 'in'),

            createEdge('b1', 'xor3', 'out', 'a'),
            createEdge('b0', 'xor3', 'out', 'b'),
            createEdge('xor3', 'g0', 'source', 'in'),
        ]
    },

    // 5. Combinational Logic Design (SOP)
    "dld-exp-5": {
        nodes: [
            createNode('in_a', 'inputNode', 'A', 50, 50),
            createNode('in_b', 'inputNode', 'B', 50, 150),
            createNode('in_c', 'inputNode', 'C', 50, 250),
            createNode('in_d', 'inputNode', 'D', 50, 350),

            createNode('and1', 'and', '', 200, 100),
            createNode('and2', 'and', '', 200, 300),

            createNode('or1', 'or', '', 400, 200),

            createNode('out_y', 'outputNode', 'Y', 600, 200),
        ],
        edges: [
            createEdge('in_a', 'and1', 'out', 'a'),
            createEdge('in_b', 'and1', 'out', 'b'),
            createEdge('in_c', 'and2', 'out', 'a'),
            createEdge('in_d', 'and2', 'out', 'b'),

            createEdge('and1', 'or1', 'source', 'a'),
            createEdge('and2', 'or1', 'source', 'b'),

            createEdge('or1', 'out_y', 'source', 'in'),
        ]
    },

    // 6. Decoder and Encoder Circuits
    "dld-exp-6": {
        nodes: [
            // 2:4 Decoder
            createNode('dec_in0', 'inputNode', 'A', 50, 100),
            createNode('dec_in1', 'inputNode', 'B', 50, 200),
            createNode('dec_en', 'inputNode', 'EN', 50, 300, { value: 1 }), // Default Enable High

            createNode('decoder', 'decoderNode', '2:4 Dec', 300, 150),

            createNode('d0', 'outputNode', 'D0', 550, 50),
            createNode('d1', 'outputNode', 'D1', 550, 150),
            createNode('d2', 'outputNode', 'D2', 550, 250),
            createNode('d3', 'outputNode', 'D3', 550, 350),
        ],
        edges: [
            // DecoderNode handles: a, b, en
            createEdge('dec_in0', 'decoder', 'out', 'a'),
            createEdge('dec_in1', 'decoder', 'out', 'b'),
            createEdge('dec_en', 'decoder', 'out', 'en'),

            // DecoderNode outputs: y0, y1, y2, y3
            createEdge('decoder', 'd0', 'y0', 'in'),
            createEdge('decoder', 'd1', 'y1', 'in'),
            createEdge('decoder', 'd2', 'y2', 'in'),
            createEdge('decoder', 'd3', 'y3', 'in'),
        ]
    },

    // 7. Multiplexer and Demultiplexer
    "dld-exp-7": {
        nodes: [
            // 4:1 Mux
            createNode('mux_i0', 'inputNode', 'I0', 50, 50),
            createNode('mux_i1', 'inputNode', 'I1', 50, 120),
            createNode('mux_i2', 'inputNode', 'I2', 50, 190),
            createNode('mux_i3', 'inputNode', 'I3', 50, 260),

            createNode('sel0', 'inputNode', 'S0', 50, 350),
            createNode('sel1', 'inputNode', 'S1', 50, 420),

            createNode('mux', 'muxNode', '4:1 Mux', 300, 200, { muxType: '4:1' }),

            createNode('mux_out', 'outputNode', 'Y', 500, 200),
        ],
        edges: [
            // MuxNode handles: i0, i1, i2, i3, s0, s1, out
            createEdge('mux_i0', 'mux', 'out', 'i0'),
            createEdge('mux_i1', 'mux', 'out', 'i1'),
            createEdge('mux_i2', 'mux', 'out', 'i2'),
            createEdge('mux_i3', 'mux', 'out', 'i3'),

            createEdge('sel0', 'mux', 'out', 's0'),
            createEdge('sel1', 'mux', 'out', 's1'),

            createEdge('mux', 'mux_out', 'out', 'in'),
        ]
    },

    // 8. Comparators (1-bit & 4-bit)
    "dld-exp-8": {
        nodes: [
            createNode('comp_a', 'inputNode', 'A0', 50, 100),
            createNode('comp_b', 'inputNode', 'B0', 50, 200),

            //  ComparatorNode handles: a0-a3, b0-b3, gt, eq, lt
            createNode('comp', 'comparatorNode', '4-Bit Comp', 300, 150),

            createNode('eq', 'outputNode', 'A=B', 500, 50),
            createNode('gt', 'outputNode', 'A>B', 500, 150),
            createNode('lt', 'outputNode', 'A<B', 500, 250),
        ],
        edges: [
            // Drive LSBs just for demo, assume others 0
            createEdge('comp_a', 'comp', 'out', 'a0'),
            createEdge('comp_b', 'comp', 'out', 'b0'),

            createEdge('comp', 'eq', 'eq', 'in'),
            createEdge('comp', 'gt', 'gt', 'in'),
            createEdge('comp', 'lt', 'lt', 'in'),
        ]
    },

    // 9. Flip-Flops
    "dld-exp-9": {
        nodes: [
            createNode('clk', 'inputNode', 'CLK', 50, 50),
            createNode('d_in', 'inputNode', 'D', 50, 150),

            // FlipFlopNode handles: clk, j (maps to D), k (unused for D), q, qbar
            createNode('dff', 'flipflopNode', 'D-FF', 250, 100, { ffType: 'D' }),

            createNode('q', 'outputNode', 'Q', 450, 50),
            createNode('qbar', 'outputNode', 'Q\'', 450, 150),
        ],
        edges: [
            createEdge('clk', 'dff', 'out', 'clk'),
            createEdge('d_in', 'dff', 'out', 'j'),

            createEdge('dff', 'q', 'q', 'in'),
            createEdge('dff', 'qbar', 'qbar', 'in'),
        ]
    },

    // 10. Synchronous and Asynchronous Counters
    "dld-exp-10": {
        nodes: [
            createNode('clk_main', 'inputNode', 'CLK', 50, 150),
            createNode('high', 'inputNode', 'HIGH', 50, 50, { value: 1 }),

            createNode('ff1', 'flipflopNode', 'FF0', 250, 150, { ffType: 'JK' }),
            createNode('ff2', 'flipflopNode', 'FF1', 450, 150, { ffType: 'JK' }),

            createNode('out0', 'outputNode', 'Q0', 250, 300),
            createNode('out1', 'outputNode', 'Q1', 450, 300),
        ],
        edges: [
            // Set J,K to 1 for toggle mode
            createEdge('high', 'ff1', 'out', 'j'),
            createEdge('high', 'ff1', 'out', 'k'),
            createEdge('high', 'ff2', 'out', 'j'),
            createEdge('high', 'ff2', 'out', 'k'),

            // Clock to first FF
            createEdge('clk_main', 'ff1', 'out', 'clk'),

            // Q0 to Clock of FF2 (Asynchronous/Ripple)
            createEdge('ff1', 'ff2', 'q', 'clk'),

            // Outputs
            createEdge('ff1', 'out0', 'q', 'in'),
            createEdge('ff2', 'out1', 'q', 'in'),
        ]
    }
};
