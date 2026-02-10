
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
    }
};
