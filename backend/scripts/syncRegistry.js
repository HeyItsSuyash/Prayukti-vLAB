const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Subject = require('../models/Subject');
const Experiment = require('../models/Experiment');
const Resource = require('../models/Resource');

const subjectsData = [
    {
        id: "DLD",
        name: "Digital Logic & Design",
        code: "KCS-302",
        branch: "CSE",
        semester: 3,
        hasLab: true,
        experiments: [
            { name: "Study and Verification of Logic Gates", slug: "study-logic-gates" },
            { name: "Half Adder and Full Adder", slug: "half-full-adder" },
            { name: "Half Subtractor and Full Subtractor", slug: "half-full-subtractor" },
            { name: "Code Conversion (Binary to Gray & Gray to Binary)", slug: "code-conversion" },
            { name: "Combinational Logic Design (SOP & POS)", slug: "combinational-logic" },
            { name: "Decoder and Encoder Circuits", slug: "decoder-encoder" },
            { name: "Multiplexer and Demultiplexer", slug: "mux-demux" },
            { name: "Comparators (1-bit & 4-bit)", slug: "comparators" },
            { name: "Flip-Flops and Shift Registers", slug: "flip-flops-registers" },
            { name: "Synchronous and Asynchronous Counters", slug: "counters" }
        ]
    },
    {
        id: "CN",
        name: "Computer Networks",
        code: "KCS-453",
        branch: "CSE",
        semester: 4,
        hasLab: true,
        experiments: [
            { name: "OSI vs TCP/IP Reference Models", slug: "osi-tcp-ip-models" },
            { name: "CSMA/CD Protocol Study", slug: "csma-cd-protocol" },
            { name: "Token Bus and Token Ring Protocols", slug: "token-bus-ring" },
            { name: "Sliding Window Protocols", slug: "sliding-window-protocols" },
            { name: "Cyclic Redundancy Check (CRC)", slug: "crc-error-detection" },
            { name: "Implementation and Study of Selective Repeat Protocol", slug: "selective-repeat" },
            { name: "Address Resolution Protocol (ARP)", slug: "arp-protocol" },
            { name: "Distance Vector Routing Algorithm", slug: "distance-vector-routing" }
        ]
    },
    {
        id: "DBMS",
        name: "Database Management",
        code: "KCS-503",
        branch: "CSE",
        semester: 5,
        hasLab: true,
        experiments: [
            { name: "Introduction to DBMS", slug: "intro-dbms" },
            { name: "Database Application Development", slug: "db-app-dev" },
            { name: "SQL Queries & Operations", slug: "sql-queries" },
            { name: "Normalization", slug: "normalization" },
            { name: "Host Language Interface", slug: "host-lang-interface" }
        ]
    },
    {
        id: "OOPS",
        name: "Object Oriented Programming",
        code: "KCS-303",
        branch: "CSE",
        semester: 3,
        hasLab: true,
        experiments: [
            { name: "Introduction to Classes and Objects", slug: "classes-objects" },
            { name: "Implementation of Inheritance", slug: "inheritance" },
            { name: "Demonstration of Polymorphism", slug: "polymorphism" },
            { name: "Data Encapsulation and Abstraction", slug: "encapsulation-abstraction" }
        ]
    },
    {
        id: "MPMC",
        name: "Microprocessor and Microcontroller (MPMC)",
        code: "KCS-402",
        branch: "CSE",
        semester: 4,
        hasLab: true,
        experiments: [
            { name: "Decimal Addition & Subtraction", slug: "decimal-arithmetic" },
            { name: "Hexadecimal Addition & Subtraction", slug: "hex-arithmetic" },
            { name: "Addition & Subtraction of Two BCD Numbers", slug: "bcd-arithmetic" },
            { name: "Multiplication & Division of Two 8-bit Numbers", slug: "mul-div-arithmetic" },
            { name: "Find Largest & Smallest Number in an Array", slug: "array-min-max" },
            { name: "Arrange Array in Ascending Order", slug: "array-ascending" },
            { name: "Arrange Array in Descending Order", slug: "array-descending" },
            { name: "Hexadecimal to ASCII & Vice Versa", slug: "hex-ascii-conv" }
        ]
    }
];

async function sync() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const sub of subjectsData) {
            // Upsert Subject
            let subject = await Subject.findOne({ code: sub.code });
            if (!subject) {
                subject = new Subject({
                    name: sub.name,
                    code: sub.code,
                    branch: sub.branch,
                    semester: sub.semester,
                    hasLab: sub.hasLab
                });
                await subject.save();
                console.log(`Created Subject: ${sub.name}`);
            } else {
                console.log(`Subject already exists: ${sub.name}`);
            }

            // Upsert Experiments
            for (const exp of sub.experiments) {
                let experiment = await Experiment.findOne({ slug: exp.slug, subject: subject._id });
                if (!experiment) {
                    experiment = new Experiment({
                        name: exp.name,
                        slug: exp.slug,
                        subject: subject._id,
                        status: 'Active'
                    });
                    await experiment.save();
                    console.log(`  Added Experiment: ${exp.name}`);
                }
            }
        }

        console.log('Synchronization Complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error during synchronization:', error);
        process.exit(1);
    }
}

sync();
