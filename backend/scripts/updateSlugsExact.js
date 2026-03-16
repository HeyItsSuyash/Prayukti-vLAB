const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Experiment = require('../models/Experiment');

const exactMapping = {
    // DLD
    "Study and Verification of Logic Gates": "dld-exp-1",
    "Half Adder and Full Adder": "dld-exp-2",
    "Half Subtractor and Full Subtractor": "dld-exp-3",
    "Code Conversion (Binary to Gray & Gray to Binary)": "dld-exp-4",
    "Combinational Logic Design (SOP & POS)": "dld-exp-5",
    "Decoder and Encoder Circuits": "dld-exp-6",
    "Multiplexer and Demultiplexer": "dld-exp-7",
    "Comparators (1-bit & 4-bit)": "dld-exp-8",
    "Flip-Flops and Shift Registers": "dld-exp-9",
    "Synchronous and Asynchronous Counters": "dld-exp-10",
    
    // CN
    "OSI vs TCP/IP Reference Models": "cn-exp-1",
    "CSMA/CD Protocol Study": "cn-exp-2",
    "Token Bus and Token Ring Protocols": "cn-exp-3",
    "Sliding Window Protocols": "cn-exp-4",
    "Cyclic Redundancy Check (CRC)": "cn-exp-5",
    "Implementation and Study of Selective Repeat Protocol": "cn-exp-6",
    "Address Resolution Protocol (ARP)": "cn-exp-7",
    "Distance Vector Routing Algorithm": "cn-exp-8",
    
    // DBMS
    "Introduction to DBMS": "dbms-exp-1",
    "Database Application Development": "db-app-dev", // Registry might use db-app-dev or dbms-exp-2
    "SQL Queries & Operations": "dbms-exp-3",
    "Normalization": "dbms-exp-4",
    "Host Language Interface": "dbms-exp-5",
    
    // OOPS
    "Introduction to Classes and Objects": "oops-exp-1",
    "Implementation of Inheritance": "oops-exp-2",
    "Demonstration of Polymorphism": "oops-exp-3",
    "Data Encapsulation and Abstraction": "oops-exp-4",

    // MPMC
    "Decimal Addition & Subtraction": "mpmc-exp-1",
    "Hexadecimal Addition & Subtraction": "mpmc-exp-2",
    "Addition & Subtraction of Two BCD Numbers": "mpmc-exp-3",
    "Multiplication & Division of Two 8-bit Numbers": "mpmc-exp-4",
    "Find Largest & Smallest Number in an Array": "mpmc-exp-5",
    "Arrange Array in Ascending Order": "mpmc-exp-6",
    "Arrange Array in Descending Order": "mpmc-exp-7",
    "Hexadecimal to ASCII & Vice Versa": "mpmc-exp-8"
};

// Check registry.ts for DBMS-EXP-2
// dbms-exp-2: Database Application Development
// Ah, my mapping should be very careful.

async function updateSlugs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        console.log('Step 1: Temporary reset of all slugs...');
        const allExps = await Experiment.find({});
        for (const exp of allExps) {
            await Experiment.findByIdAndUpdate(exp._id, { slug: `temp-${exp._id}` });
        }

        console.log('Step 2: Applying exact mapping...');
        for (const [title, slug] of Object.entries(exactMapping)) {
            const exp = await Experiment.findOneAndUpdate({ name: title }, { slug: slug });
            if (exp) {
                console.log(`Updated: ${title} -> ${slug}`);
            } else {
                console.log(`Not found: ${title}`);
            }
        }

        console.log('Final cleanup...');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateSlugs();
