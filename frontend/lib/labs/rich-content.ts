
export const LAB_CONTENT: Record<string, { aim: string; theory: string; procedure: string }> = {
  // --- CN Labs ---
  "cn-exp-1": {
    aim: "To study and compare the OSI (Open Systems Interconnection) reference model and the TCP/IP (Transmission Control Protocol/Internet Protocol) model.",
    theory: `
      <div class="space-y-4">
        <p><strong>The OSI Model</strong> is a conceptual framework that standardizes the functions of a communication system into seven abstraction layers. Developed by ISO in 1984, it provides a universal set of rules for networking.</p>
        <p><strong>The TCP/IP Model</strong> is a more simplified and practical model used for the modern internet. It consists of four layers that map to the OSI model's seven layers.</p>
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 class="font-bold text-blue-800 mb-2">Key Differences:</h4>
            <ul class="list-disc ml-6 space-y-1">
                <li>OSI is a generic, independent model; TCP/IP is based on standard protocols.</li>
                <li>OSI has 7 layers; TCP/IP has 4 layers.</li>
                <li>OSI provides a clear distinction between services, interfaces, and protocols.</li>
            </ul>
        </div>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Select the OSI vs TCP/IP simulation from the dashboard.</li>
        <li>Click on each layer of the OSI model to understand its functions and protocols.</li>
        <li>Observe the mapping between OSI layers and TCP/IP layers.</li>
        <li>Trigger the "Packet Flow" animation to see how data moves from the Application layer to the Physical layer.</li>
        <li>Review the comparison table and complete the quiz to verify your understanding.</li>
      </ol>
    `
  },
  "cn-exp-2": {
    aim: "To create a scenario and study the performance of CSMA/CD (Carrier Sense Multiple Access with Collision Detection) protocol through simulation.",
    theory: `
      <div class="space-y-4">
        <p><strong>CSMA/CD</strong> is a media access control method used most notably in early Ethernet technology for local area networking.</p>
        <ul class="list-disc ml-6 space-y-1">
            <li><strong>Carrier Sense:</strong> A node listens to the channel before transmitting.</li>
            <li><strong>Multiple Access:</strong> Multiple nodes share the same physical medium.</li>
            <li><strong>Collision Detection:</strong> If two nodes transmit simultaneously, a collision occurs. Nodes detect this by monitoring signal voltage levels.</li>
        </ul>
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 class="font-bold text-blue-800 mb-2">Backoff Algorithm:</h4>
            <p>After a collision, nodes wait for a random amount of time before retransmitting. The <strong>Binary Exponential Backoff</strong> algorithm is used to determine this wait time, reducing the probability of another collision.</p>
        </div>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Enter the CSMA/CD simulation workbench.</li>
        <li>Configure the number of nodes, packet size, and transmission probability.</li>
        <li>Start the simulation and observe how nodes sense the carrier.</li>
        <li>Watch for collisions when multiple nodes transmit simultaneously.</li>
        <li>Observe the jamming signal and the backoff timers.</li>
        <li>Analyze the throughput and collision statistics in the results section.</li>
      </ol>
    `
  },
  "cn-exp-3": {
    aim: "To create a scenario and study the performance of Token Bus and Token Ring protocols through simulation.",
    theory: `
      <div class="space-y-4">
        <p><strong>Token-based protocols</strong> are collision-free medium access control (MAC) methods that regulate access to a shared channel using a control frame called a <strong>Token</strong>.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <h4 class="font-bold text-indigo-800 mb-1">Token Ring (IEEE 802.5)</h4>
                <p class="text-xs">Nodes are physically connected in a ring. The token circulates in one direction. A node captures the token to transmit and releases it after the frame returns (source stripping).</p>
            </div>
            <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <h4 class="font-bold text-amber-800 mb-1">Token Bus (IEEE 802.4)</h4>
                <p class="text-xs">Nodes are on a physical bus but form a <strong>logical ring</strong>. The token is passed based on descending node addresses. It combines the physical robustness of a bus with the deterministic nature of a ring.</p>
            </div>
        </div>
        <p>These protocols provide <strong>deterministic access</strong>, meaning a node is guaranteed to get a turn to transmit within a predictable time frame, making them ideal for real-time applications.</p>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Select the protocol mode: <strong>Token Bus</strong> or <strong>Token Ring</strong> from the lab interface.</li>
        <li>Set the <strong>Number of Nodes</strong> and <strong>Packet Size</strong> for the transmission.</li>
        <li>Observe the <strong>Token Circulation</strong>:
            <ul class="list-disc ml-6 mt-1 opacity-80">
                <li>In Token Ring, see it move physically around the circle.</li>
                <li>In Token Bus, see it jump between nodes in logical order.</li>
            </ul>
        </li>
        <li>Trigger a transmission and follow the <strong>Data Frame</strong> as it travels across the network.</li>
        <li>Monitor the <strong>Throughput</strong> and <strong>Fairness</strong> metrics as multiple nodes compete for access.</li>
        <li>Complete the quiz to evaluate your understanding of predictable network delays.</li>
      </ol>
    `
  },
  "cn-exp-4": {
    aim: "To study and analyze the performance of various flow control protocols: Stop & Wait, Go-Back-N, and Selective Repeat.",
    theory: `
      <div class="space-y-4">
        <p><strong>Sliding Window Protocols</strong> are data link layer protocols used for reliable and sequential delivery of data frames. They provide <strong>Flow Control</strong> to ensure a fast sender doesn't overwhelm a slow receiver.</p>
        <div class="space-y-4">
            <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <h4 class="font-bold text-blue-800 mb-1">Stop & Wait ARQ</h4>
                <p class="text-xs">The sender sends one frame and waits for an acknowledgment (ACK) before sending the next. It is simple but inefficient due to high waiting time.</p>
            </div>
            <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <h4 class="font-bold text-indigo-800 mb-1">Go-Back-N (GBN)</h4>
                <p class="text-xs">Sender can send multiple frames (up to window size 'N') without waiting for ACKs. If a frame is lost, the sender retransmits ALL frames from the lost one onwards. Uses <strong>Cumulative ACKs</strong>.</p>
            </div>
            <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <h4 class="font-bold text-emerald-800 mb-1">Selective Repeat (SR)</h4>
                <p class="text-xs">Similar to GBN, but ONLY the lost frame is retransmitted. The receiver buffers out-of-order frames. It is more efficient but requires more complex logic at both ends.</p>
            </div>
        </div>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Select the Protocol: <strong>Stop & Wait</strong>, <strong>GBN</strong>, or <strong>Selective Repeat</strong>.</li>
        <li>Set the <strong>Window Size</strong> and <strong>Timeout</strong> values.</li>
        <li>Start the simulation and observe the sequence numbers of transmitted packets.</li>
        <li>Use the <strong>Manual Error Injection</strong> buttons to simulate a "Lost Packet" or "Lost ACK".</li>
        <li>Observe the retransmission behavior (Does it resend one packet or the whole window?).</li>
        <li>Analyze the <strong>Efficiency</strong> and <strong>Throughput</strong> graphs to compare the three methods.</li>
      </ol>
    `
  },

  // --- DLD Labs ---
  "dld-exp-1": {
    aim: "To study and verify the truth tables of basic logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR).",
    theory: `
      <p><strong>Logic Gates</strong> are the basic building blocks of any digital system. It is an electronic circuit having one or more than one input and only one output. The relationship between the input and the output is based on a certain logic.</p>
      <ul class="list-disc ml-6 mt-2 space-y-1">
        <li><strong>AND Gate:</strong> Output is high only if all inputs are high.</li>
        <li><strong>OR Gate:</strong> Output is high if at least one input is high.</li>
        <li><strong>NOT Gate:</strong> Output is the complement of the input.</li>
      </ul>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Connect the inputs to the logic gate terminals.</li>
        <li>Apply different combinations of logic 0 and 1.</li>
        <li>Observe the output LED status.</li>
        <li>Verify with the truth table.</li>
      </ol>
    `
  },
  // Placeholders for DLD 2-4
  "dld-exp-2": {
    aim: "To design and implement Half Adder and Full Adder circuits.",
    theory: "<p>Adders are digital circuits that perform addition of numbers.</p>",
    procedure: "<ol><li>Design Half Adder using XOR and AND gates.</li><li>Design Full Adder using two Half Adders.</li></ol>"
  },
  "dld-exp-3": {
    aim: "To design and implement Half Subtractor and Full Subtractor circuits.",
    theory: "<p>Subtractors are digital circuits that perform subtraction of numbers.</p>",
    procedure: "<ol><li>Design Half Subtractor using XOR, AND, NOT gates.</li><li>Design Full Subtractor.</li></ol>"
  },
  "dld-exp-4": {
    aim: "To design a 4-bit Binary to Gray Code Converter.",
    theory: "<p>Gray code is a binary numeral system where two successive values differ in only one bit.</p>",
    procedure: "<ol><li>Implement the XOR logic for conversion.</li><li>Verify the output for 4-bit inputs.</li></ol>"
  },


  // --- OOPS Labs ---
  "oops-exp-1": {
    aim: "To understand the basic concepts of classes and objects in Object-Oriented Programming.",
    theory: `
      <div class="space-y-4">
        <p><strong>Class</strong> is a blueprint or template for creating objects. It defines a set of attributes and methods that the created objects will have.</p>
        <p><strong>Object</strong> is an instance of a class. It is a real-world entity that has state and behavior.</p>
        <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 class="font-bold text-purple-800 mb-2">Key Concepts:</h4>
            <ul class="list-disc ml-6 space-y-1">
                <li>Classes provide the structure.</li>
                <li>Objects provide the data.</li>
                <li>Method define the behavior.</li>
            </ul>
        </div>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Select the Classes and Objects simulation.</li>
        <li>Define a class with properties and methods.</li>
        <li>Instantiate objects using the class.</li>
        <li>Interact with the objects to see how state changes.</li>
      </ol>
    `
  },
  "oops-exp-2": {
    aim: "To implement Inheritance in Java.",
    theory: "<p>Inheritance allows a class to acquire properties and methods of another class.</p>",
    procedure: "<ol><li>Create a Parent class.</li><li>Create a Child class extending Parent.</li></ol>"
  },
  "oops-exp-3": {
    aim: "To demonstrate Polymorphism.",
    theory: "<p>Polymorphism allows objects to be treated as instances of their parent class.</p>",
    procedure: "<ol><li>Implement method overriding.</li><li>Implement method overloading.</li></ol>"
  },
  "oops-exp-4": {
    aim: "To implement Data Encapsulation and Abstraction.",
    theory: "<p>Encapsulation hides data, Abstraction hides complexity.</p>",
    procedure: "<ol><li>Use private access modifiers.</li><li>Use abstract classes or interfaces.</li></ol>"
  },


  // --- DBMS Labs ---
  "dbms-exp-1": {
    aim: "To perform basic DDL and DML operations.",
    theory: "<p>SQL (Structured Query Language) is used to manage relational databases.</p>",
    procedure: "<ol><li>Create a table using CREATE command.</li><li>Insert data using INSERT command.</li><li>Retrieve data using SELECT.</li></ol>"
  },
  "dbms-exp-2": {
    aim: "To build a database application for Store Management.",
    theory: "<p>Database applications interface with the DBMS to perform useful tasks.</p>",
    procedure: "<ol><li>Design the schema.</li><li>Implement the application logic.</li></ol>"
  },
  "dbms-exp-3": {
    aim: "To perform advanced SQL queries using Joins, Subqueries, Triggers, and Views.",
    theory: "<p>Advanced SQL allows for complex data retrieval and manipulation.</p>",
    procedure: "<ol><li>Write specific queries to solve problems.</li><li>Create Views for simplified access.</li></ol>"
  },
  "dbms-exp-4": {
    aim: "To analyze and decompose schemas for Normalization (1NF to 5NF).",
    theory: "<p>Normalization reduces data redundancy and improves data integrity.</p>",
    procedure: "<ol><li>Analyze functional dependencies.</li><li>Decompose tables into normal forms.</li></ol>"
  },
  "dbms-exp-5": {
    aim: "To implement Host Language Interface.",
    theory: "<p>Embedding SQL in high-level programming languages.</p>",
    procedure: "<ol><li>Connect to database from Java/Python.</li><li>Execute queries appropriately.</li></ol>"
  },

  // --- MPMC Labs ---
  "mpmc-exp-1": {
    aim: "Design a virtual lab experiment using the 8085 microprocessor to perform decimal addition and subtraction of two 8-bit numbers.",
    theory: `
      <div class="space-y-4">
        <p><strong>Decimal Arithmetic in 8085:</strong> The 8085 microprocessor performs all arithmetic operations in binary. However, it provides a special instruction <strong>DAA (Decimal Adjust Accumulator)</strong> to perform BCD (Binary Coded Decimal) addition.</p>
        
        <div class="bg-green-50 p-4 rounded-lg border border-green-100">
            <h4 class="font-bold text-green-800 mb-2">Instructions for Decimal Arithmetic:</h4>
            <ul class="list-disc ml-6 space-y-1">
                <li><strong>ADD/ADC:</strong> Used for addition. Result is binary.</li>
                <li><strong>SUB/SBB:</strong> Used for subtraction. Result is binary.</li>
                <li><strong>DAA:</strong> This instruction is used AFTER an addition operation to convert the binary result in the accumulator back to BCD format. Note: There is no 'DAS' instruction for subtraction; special logic must be used.</li>
            </ul>
        </div>

        <p><strong>Flag Registers:</strong> Flag register changes are crucial in decimal arithmetic:</p>
        <ul class="list-disc ml-6 space-y-1">
            <li><strong>CY (Carry):</strong> Set if an addition results in a carry-out of the MSB.</li>
            <li><strong>AC (Auxiliary Carry):</b> Set if there is a carry from bit 3 to bit 4. Used by DAA.</li>
            <li><strong>Z (Zero):</strong> Set if the result is zero.</li>
            <li><strong>S (Sign):</strong> Set if the MSB of the result is 1.</li>
            <li><strong>P (Parity):</strong> Set if the result has an even number of 1s.</li>
        </ul>
      </div>
    `,
    procedure: `
      </ol>
      <div class="mt-8 space-y-4">
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Algorithm:</h4>
        <div class="bg-gray-50 p-4 rounded-lg font-mono text-xs border">
            <ol class="list-decimal ml-6 space-y-1">
                <li>Start the program.</li>
                <li>Load the first 8-bit BCD number into Register A.</li>
                <li>Add the second 8-bit BCD number from memory/register to Register A.</li>
                <li>Execute the DAA instruction to convert binary sum to BCD.</li>
                <li>Store the final BCD result into memory.</li>
                <li>Stop the execution.</li>
            </ol>
        </div>
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Assembly Code:</h4>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto border-2 border-green-900/30 font-mono">
LXI H, 2000H  ; Point HL to the first number
MOV A, M      ; Get first number in A
INX H         ; Point HL to second number
ADD M         ; Add second number to A
DAA           ; Decimal Adjust Accumulator
INX H         ; Point to result address
MOV M, A      ; Store result
HLT           ; Halt program</pre>
      </div>
    `
  },
  "mpmc-exp-2": {
    aim: "Design a virtual lab experiment using the 8085 microprocessor to perform hexadecimal addition and subtraction of two 8-bit numbers.",
    theory: `
      <div class="space-y-4">
        <p><strong>Hexadecimal Number System:</strong> Hexadecimal is a base-16 system using digits 0-9 and letters A-F. It is widely used in computing because it provides a more human-friendly representation of binary values (each hex digit represents 4 bits).</p>
        
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 class="font-bold text-blue-800 mb-2">Binary Arithmetic Behind Hex:</h4>
            <p>The 8085 microprocessor inherently performs arithmetic in binary/hexadecimal. Unlike BCD arithmetic, no adjustment instruction like DAA is needed for standard hex addition or subtraction.</p>
        </div>

        <p><strong>Carry and Borrow:</strong></p>
        <ul class="list-disc ml-6 space-y-1">
            <li><strong>Carry:</strong> For addition, a carry is generated if the result exceeds FFH (255 in decimal).</li>
            <li><strong>Borrow:</strong> For subtraction, a borrow (indicated by the Carry flag) is generated if the subtrahend is greater than the minuend.</li>
        </ul>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Enter two 8-bit hex numbers at memory locations 2000H and 2001H.</li>
        <li>Load the first number into the Accumulator.</li>
        <li>Add or subtract the second number from the Accumulator.</li>
        <li>Observe the updated HEX result in the Accumulator.</li>
        <li>Check the Flag Register for S, Z, AC, P, and CY status.</li>
        <li>Store the final result at 2002H.</li>
      </ol>
      <div class="mt-8 space-y-4">
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Algorithm:</h4>
        <div class="bg-gray-50 p-4 rounded-lg font-mono text-xs border">
            <ol class="list-decimal ml-6 space-y-1">
                <li>Start.</li>
                <li>Get the first number in A.</li>
                <li>Add the second number to A.</li>
                <li>Store the sum in memory.</li>
                <li>Stop.</li>
            </ol>
        </div>
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Assembly Code:</h4>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto border-2 border-green-900/30 font-mono">
LDA 2000H     ; Load first number in A
LXI H, 2001H  ; Load address of second number
ADD M         ; Add second number
STA 2002H     ; Store result
HLT           ; Halt</pre>
      </div>
    `
  },
  "mpmc-exp-3": {
    aim: "To write an assembly language program for the 8085 microprocessor to perform the addition and subtraction of two 8-bit BCD (Binary Coded Decimal) numbers.",
    theory: `
      <div class="space-y-4">
        <p><strong>BCD Arithmetic:</strong> In BCD, each decimal digit (0-9) is represented by a 4-bit binary code. When two BCD numbers are added, the result might not be a valid BCD number if the sum of any two digits exceeds 9 or if there is a carry.</p>
        
        <div class="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h4 class="font-bold text-orange-800 mb-2">The Decimal Adjust Logic:</h4>
            <p>The <strong>DAA</strong> instruction is used to correct the result of BCD addition. It checks the lower nibble and the AC flag, then the upper nibble and the CY flag, adding 6 where necessary to skip illegal codes (A-F).</p>
        </div>

        <p><strong>Subtraction via Complement:</strong> For BCD subtraction, we often use 10's complement. This involves subtracting each digit from 9 (9's complement) and then adding 1 to the result.</p>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Load the two BCD numbers into memory locations 2000H and 2001H.</li>
        <li>For Addition: Load numbers, ADD them, and apply DAA.</li>
        <li>For Subtraction: Find the 10's complement of the subtrahend and add it to the minuend, then adjust.</li>
        <li>Observe the Accumulator and Flag Register in the simulator.</li>
        <li>Verify results at memory location 2002H.</li>
      </ol>
      <div class="mt-8 space-y-4">
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Algorithm:</h4>
        <div class="bg-gray-50 p-4 rounded-lg font-mono text-xs border">
            <ol class="list-decimal ml-6 space-y-1">
                <li>Initialize HL pair for result.</li>
                <li>Get first BCD number in A.</li>
                <li>Add second BCD number.</li>
                <li>Apply DAA for adjustment.</li>
                <li>Store result and Stop.</li>
            </ol>
        </div>
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Assembly Code:</h4>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto border-2 border-green-900/30 font-mono">
LXI H, 2000H  ; First BCD Number Address
MOV A, M      ; Load first BCD
INX H         ; Second BCD Number Address
ADD M         ; BCD Addition
DAA           ; BCD Adjustment
STA 2002H     ; Store Result
HLT           ; Halt</pre>
      </div>
    `
  },
  "mpmc-exp-4": {
    aim: "To perform multiplication and division of two 8-bit numbers using repeated addition and repeated subtraction methods respectively.",
    theory: `
      <div class="space-y-4">
        <p><strong>Multiplication (Repeated Addition):</strong> Since 8085 does not have a multiplication instruction, it is performed by adding the multiplicand for 'multiplier' number of times.</p>
        <div class="bg-green-50 p-4 rounded-lg border border-green-100">
            <h4 class="font-bold text-green-800 mb-2">Concept:</h4>
            <p>Example: 5 x 3 = 5 + 5 + 5 = 15. We load 5 in A, 3 in a counter register, and add 5 to a running sum in A until the counter becomes 0.</p>
        </div>
        <p><strong>Division (Repeated Subtraction):</strong> Division is performed by subtracting the divisor from the dividend repeatedly until the remainder is less than the divisor. The number of successful subtractions is the quotient.</p>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Load dividend and divisor into registers/memory.</li>
        <li>For Multiplication: Clear A, load multiplicand in B, multiplier in C. Loop: ADD B, DCR C, JNZ Loop.</li>
        <li>For Division: Load dividend in A, divisor in B, clear C (for quotient). Loop: CMP B, JC Done, SUB B, INR C, JMP Loop.</li>
        <li>Store results in memory and observe registers.</li>
      </ol>
      <div class="mt-8 space-y-4">
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Algorithm:</h4>
        <div class="bg-gray-50 p-4 rounded-lg font-mono text-xs border">
            <ol class="list-decimal ml-6 space-y-1">
                <li>Initialize Accumulator A = 00H.</li>
                <li>Load Multiplicand in Register B.</li>
                <li>Load Multiplier in Register C (Counter).</li>
                <li>Loop: Add B to A.</li>
                <li>Decrement C. If C != 0, repeat Loop.</li>
                <li>Store result A in memory.</li>
            </ol>
        </div>
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Assembly Code:</h4>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto border-2 border-green-900/30 font-mono">
; Multiplication Example
LDA 2000H     ; Load Multiplicand
MOV B, A
LDA 2001H     ; Load Multiplier
MOV C, A
XRA A         ; Clear A (Sum = 0)
LOOP: ADD B   ; Add B to A
DCR C         ; Decrement multiplier
JNZ LOOP      ; Loop until C = 0
STA 2002H     ; Store Result
HLT           ; Halt</pre>
      </div>
    `
  },
  "mpmc-exp-5": {
    aim: "To find the largest and smallest numbers from a given array of 8-bit data stored in memory.",
    theory: `
      <div class="space-y-4">
        <p><strong>Array Processing:</strong> Array processing involve using a pointer (typically HL) and a counter (typically B or C). We iterate through the array and compare each element with the current largest/smallest found so far.</p>
        <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 class="font-bold text-purple-800 mb-2">CMP Instruction:</h4>
            <p>The <strong>CMP M</strong> instruction compares Accumulator with memory. If A < M, Carry Flag (CY) is set. This is used for branching (JC/JNC).</p>
        </div>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Load the number of elements (count) in the HL pair.</li>
        <li>Get the first element in the Accumulator as the initial 'Largest' (or Smallest).</li>
        <li>Compare the next element with the Accumulator.</li>
        <li>If the next element is larger, update the Accumulator.</li>
        <li>Decrement the counter and repeat until the counter is zero.</li>
        <li>Store the final result in memory.</li>
      </ol>
      <div class="mt-8 space-y-4">
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Algorithm:</h4>
        <div class="bg-gray-50 p-4 rounded-lg font-mono text-xs border">
            <ol class="list-decimal ml-6 space-y-1">
                <li>Set HL to array start. Load count in C.</li>
                <li>Load first element in A.</li>
                <li>LOOP: Increment HL. Compare M with A.</li>
                <li>If M > A, MOV A, M.</li>
                <li>Decrement C. If C != 0, goto LOOP.</li>
                <li>Store A (Largest) in result memory.</li>
            </ol>
        </div>
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Assembly Code:</h4>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto border-2 border-green-900/30 font-mono">
LXI H, 2000H  ; Array Count at 2000H
MOV C, M      ; Load count
INX H         ; Point to first data
MOV A, M      ; Initial Largest in A
DCR C         ; Elements remaining = C-1
LOOP: INX H   ; Next element
CMP M         ; Compare A with M
JNC SKIP      ; If A >= M, don't update
MOV A, M      ; Else, A = M (New Largest)
SKIP: DCR C   ; Decrement counter
JNZ LOOP      ; Loop until C=0
STA 2100H     ; Store Largest at 2100H
HLT           ; Halt</pre>
      </div>
    `
  },
  "mpmc-exp-6": {
    aim: "To sort an array of 8-bit numbers in ascending order using the bubble sort algorithm.",
    theory: `
      <div class="space-y-4">
        <p><strong>Bubble Sort:</strong> This is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.</p>
        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h4 class="font-bold text-yellow-800 mb-2">Sorting Logic:</h4>
            <p>For ascending order, if the current element is greater than the next element, we swap them. This process is repeated for N-1 passes where N is the number of elements.</p>
        </div>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Load the array count.</li>
        <li>Use two loops: Outer loop for passes and Inner loop for comparisons.</li>
        <li>Compare adjacent elements.</li>
        <li>Swap if element at address HL > HL+1.</li>
        <li>Continue until the entire array is sorted.</li>
      </ol>
      <div class="mt-8 space-y-4">
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Algorithm:</h4>
        <div class="bg-gray-50 p-4 rounded-lg font-mono text-xs border">
            <ol class="list-decimal ml-6 space-y-1">
                <li>Load outer loop counter (N-1).</li>
                <li>START_PASS: Load HL with array start. Load inner loop counter.</li>
                <li>COMPARE: Get M in A. INX H. Compare with M.</li>
                <li>If A > M, SWAP them.</li>
                <li>Decrement inner counter. If !=0 goto COMPARE.</li>
                <li>Decrement outer counter. If !=0 goto START_PASS.</li>
            </ol>
        </div>
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Assembly Code:</h4>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto border-2 border-green-900/30 font-mono">
LXI H, 2000H  ; Count at 2000H
MOV D, M      ; D = Outer Count
DCR D         ; Passes = N-1
OUTER: LXI H, 2001H ; Point to array start
MOV C, M      ; C = Inner Count
DCR C
PASS: MOV A, M ; Get element
INX H
CMP M         ; Compare with next
JC SKIP       ; If A < M, correct order
MOV B, M      ; SWAP Logic
MOV M, A
DCX H
MOV M, B
INX H
SKIP: DCR C
JNZ PASS      ; Repeat for one pass
DCR D
JNZ OUTER     ; Repeat till all passes done
HLT</pre>
      </div>
    `
  },
  "mpmc-exp-7": {
    aim: "To sort an array of 8-bit numbers in descending order using the bubble sort algorithm.",
    theory: `
      <div class="space-y-4">
        <p><strong>Sorting in Descending Order:</strong> Similar to ascending order, but we swap if the current element is LESS than the next element. The largest numbers 'sink' to the bottom, while larger numbers 'bubble' to the top in each pass if viewed horizontally.</p>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Load the array count from memory.</li>
        <li>Initialize outer loop and inner loop counters.</li>
        <li>Compare current element with next.</li>
        <li>Swap if element at HL < element at HL+1.</li>
        <li>Repeat until counters expire.</li>
      </ol>
      <div class="mt-8 space-y-4">
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Algorithm:</h4>
        <div class="bg-gray-50 p-4 rounded-lg font-mono text-xs border">
            <ol class="list-decimal ml-6 space-y-1">
                <li>Load Outer Counter = N-1.</li>
                <li>OUTER: Point to array. Load Inner Counter = N-1.</li>
                <li>INNER: Get M in A. Compare with next (M+1).</li>
                <li>If A < next, SWAP HL and HL+1.</li>
                <li>Loop INNER until inner counter = 0.</li>
                <li>Loop OUTER until outer counter = 0.</li>
            </ol>
        </div>
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Assembly Code:</h4>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto border-2 border-green-900/30 font-mono">
LXI H, 2000H
MOV D, M      ; Outer Counter
DCR D
OUTER: LXI H, 2001H
MOV C, M      ; Inner Counter
DCR C
INNER: MOV A, M
INX H
CMP M         ; Compare
JNC SKIP      ; If A >= M, skip swap
MOV B, M      ; SWAP
MOV M, A
DCX H
MOV M, B
INX H
SKIP: DCR C
JNZ INNER
DCR D
JNZ OUTER
HLT</pre>
      </div>
    `
  },
  "mpmc-exp-8": {
    aim: "To write a program to convert a given 8-bit hexadecimal number into its ASCII equivalent and a given ASCII digit into its hexadecimal equivalent.",
    theory: `
      <div class="space-y-4">
        <p><strong>ASCII Conversion:</strong></p>
        <ul class="list-disc ml-6 space-y-1">
            <li>Hex (0-9): ASCII = Hex + 30H.</li>
            <li>Hex (A-F): ASCII = Hex + 37H.</li>
            <li>ASCII (0-9): Hex = ASCII - 30H.</li>
            <li>ASCII (A-F): Hex = ASCII - 37H.</li>
        </ul>
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 class="font-bold text-blue-800 mb-2">Pedagogical Note:</h4>
            <p>The program checks if a digit is > 9 by comparing with 0AH or by checking if the value exceeds 39H when converting from ASCII.</p>
        </div>
      </div>
    `,
    procedure: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Load hexadecimal number (nibble) in Accumulator.</li>
        <li>Compare with 0AH.</li>
        <li>If < 0AH, add 30H. If >= 0AH, add 37H.</li>
        <li>Store the ASCII result.</li>
        <li>Repeat reverse process for ASCII to Hex.</li>
      </ol>
      <div class="mt-8 space-y-4">
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Algorithm:</h4>
        <div class="bg-gray-50 p-4 rounded-lg font-mono text-xs border">
            <ol class="list-decimal ml-6 space-y-1">
                <li>Load Hex digit in A.</li>
                <li>Compare A with 0AH.</li>
                <li>If A < 0AH, jump to AD30.</li>
                <li>ADI 07H (Adjustment for A-F).</li>
                <li>AD30: ADI 30H.</li>
                <li>Store ASCII in memory. Stop.</li>
            </ol>
        </div>
        <h4 class="font-bold text-gray-800 uppercase tracking-tight text-sm">Assembly Code:</h4>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto border-2 border-green-900/30 font-mono">
; HEX TO ASCII (e.g., 0BH -> 'B' (42H))
LDA 2000H     ; Load Hex digit
CPI 0AH       ; Compare with 10
JC AD30       ; If < 10, skip adjustment
ADI 07H       ; Adjust for A-F (37H total offset)
AD30: ADI 30H ; Add 30H
STA 2001H     ; Store ASCII
HLT</pre>
      </div>
    `
  }
};
