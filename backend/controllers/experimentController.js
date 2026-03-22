const Experiment = require('../models/Experiment');
const ActivityLog = require('../models/ActivityLog');

exports.createExperiment = async (req, res) => {
    try {
        const experiment = new Experiment(req.body);
        await experiment.save();
        
        // Log action
        await new ActivityLog({
            action: 'CREATE_EXPERIMENT',
            userName: req.user?.fullName || 'Admin',
            userRole: 'admin',
            details: `Created experiment: ${experiment.name}`
        }).save();

        res.status(201).json(experiment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getExperiments = async (req, res) => {
    try {
        const { subjectId } = req.query;
        const query = subjectId ? { subject: subjectId } : {};
        const experiments = await Experiment.find(query).populate('subject');
        res.json(experiments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateExperiment = async (req, res) => {
    try {
        const experiment = await Experiment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(experiment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteExperiment = async (req, res) => {
    try {
        await Experiment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Experiment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });

exports.createExperiment = async (req, res) => {
    try {
        const { title, subjectId, theory, algorithm, codeTemplate, language, testcases } = req.body;

        const newExperiment = new Experiment({
            title,
            subjectId,
            theory,
            algorithm,
            codeTemplate,
            language,
            testcases
        });

        await newExperiment.save();
        res.status(201).json(newExperiment);
    } catch (err) {
        console.error("[EXPERIMENT] Create Error:", err);
        res.status(500).json({ message: "Server error while creating experiment" });
    }
};

exports.getExperimentsBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const experiments = await Experiment.find({ subjectId }).sort({ createdAt: 1 });
        res.status(200).json(experiments);
    } catch (err) {
        console.error("[EXPERIMENT] Get By Subject Error:", err);
        res.status(500).json({ message: "Server error while fetching experiments" });
    }
};

exports.getExperimentById = async (req, res) => {
    try {
        const { experimentId } = req.params;
        const experiment = await Experiment.findById(experimentId);
        if (!experiment) {
            return res.status(404).json({ message: "Experiment not found" });
        }
        res.status(200).json(experiment);
    } catch (err) {
        console.error("[EXPERIMENT] Get By ID Error:", err);
        res.status(500).json({ message: "Server error while fetching experiment" });
    }
};

exports.seedExperiments = async (req, res) => {
    try {
        const Subject = require('../models/Subject');
        const subjects = await Subject.find();

        const findId = (titlePart) => subjects.find(s => s.title.toLowerCase().includes(titlePart.toLowerCase()))?._id;

        const defaultExperiments = [
            // --- DATA STRUCTURES ---
            {
                subjectId: findId("Data Structures"),
                title: "Reverse an Array",
                theory: "Reversing an array involves swapping elements from both ends moving towards the center.",
                algorithm: "1. Start\n2. Use two pointers: start=0, end=n-1\n3. Swap arr[start] and arr[end]\n4. Increment start, decrement end\n5. Repeat until start >= end",
                codeTemplate: "#include <iostream>\n#include <vector>\n\n// TODO: Implement the reverseArray function\nvoid reverseArray(std::vector<int>& arr) {\n    // Your code here\n}\n\nint main() {\n    std::vector<int> arr = {1, 2, 3, 4, 5};\n    \n    std::cout << \"Original: \";\n    for(int x : arr) std::cout << x << \" \";\n    \n    reverseArray(arr);\n    \n    std::cout << \"\\nReversed: \";\n    for(int x : arr) std::cout << x << \" \";\n    \n    return 0;\n}",
                language: "cpp",
                testcases: [
                    { input: "", output: "Original: 1 2 3 4 5 \nReversed: 5 4 3 2 1 " }
                ]
            },
            {
                subjectId: findId("Data Structures"),
                title: "Binary Search Implementation",
                theory: "Binary search targets a sorted array and repeatedly divides the search interval in half.",
                algorithm: "1. Set low=0, high=n-1\n2. Find mid = (low+high)/2\n3. If target == mid, return\n4. If target < mid, high=mid-1\n5. Else low=mid+1",
                codeTemplate: "#include <iostream>\n#include <vector>\n\n/**\n * @return index of target or -1 if not found\n */\nint binarySearch(std::vector<int>& arr, int target) {\n    // TODO: Implement binary search logic\n    return -1;\n}\n\nint main() {\n    std::vector<int> arr = {10, 20, 30, 40, 50};\n    int target = 40;\n    \n    int index = binarySearch(arr, target);\n    \n    if(index != -1)\n        std::cout << \"Target \" << target << \" found at index: \" << index;\n    else\n        std::cout << \"Target not found\";\n        \n    return 0;\n}",
                language: "cpp"
            },
            // --- C PROGRAMMING ---
            {
                subjectId: findId("C Programming"),
                title: "Sum of Natural Numbers",
                theory: "Calculate the sum of first N natural numbers using a loop.",
                algorithm: "1. Start\n2. Input N\n3. Initialize sum = 0\n4. For i from 1 to N, sum = sum + i\n5. Print sum",
                codeTemplate: "#include <stdio.h>\n\n/**\n * @return sum of first n natural numbers\n */\nint calculateSum(int n) {\n    // Your code here\n    return 0;\n}\n\nint main() {\n    int n = 10;\n    int sum = calculateSum(n);\n    \n    printf(\"Sum of first %d natural numbers is %d\\n\", n, sum);\n    return 0;\n}",
                language: "c"
            },
            {
                subjectId: findId("C Programming"),
                title: "Factorial of a Number",
                theory: "The factorial of a non-negative integer n is the product of all positive integers less than or equal to n.",
                algorithm: "1. Start\n2. If n=0 or n=1 return 1\n3. Else return n * factorial(n-1)",
                codeTemplate: "#include <stdio.h>\n\n// Recursive function to find factorial\nlong factorial(int n) {\n    // TODO: Implement recursion\n    return 0;\n}\n\nint main() {\n    int num = 5;\n    printf(\"Factorial of %d is %ld\\n\", num, factorial(num));\n    return 0;\n}",
                language: "c"
            },
            // --- COMPUTER NETWORKS ---
            {
                subjectId: findId("Computer Networks"),
                title: "OSI vs TCP/IP Reference Models",
                theory: "OSI has 7 layers, TCP/IP has 4. Study the encapsulation process and protocol suites.",
                algorithm: "1. Select Model\n2. View Layer Details\n3. Analyze Header Encapsulation",
                language: "Universal"
            },
            {
                subjectId: findId("Computer Networks"),
                title: "CSMA/CD Protocol Simulation",
                theory: "Carrier Sense Multiple Access with Collision Detection is a network protocol for carrier transmission.",
                algorithm: "1. Check if channel is idle\n2. If idle, transmit data\n3. If collision, wait random backoff\n4. Retransmit",
                language: "Universal"
            },
            // --- DATABASE MANAGEMENT ---
            {
                subjectId: findId("Database Management"),
                title: "Introduction to DBMS (DDL/DML)",
                theory: "Learn SQL commands: CREATE, INSERT, SELECT, UPDATE, DELETE.",
                algorithm: "1. CREATE TABLE students...\n2. INSERT INTO students...\n3. SELECT * FROM students",
                language: "SQL"
            },
            {
                subjectId: findId("Database Management"),
                title: "Relational Algebra Operations",
                theory: "Select, Project, Union, and Join operations in relational databases.",
                algorithm: "1. Select (σ)\n2. Project (π)\n3. Cartesian Product (×)\n4. Join (⨝)",
                language: "SQL"
            },
            // --- DIGITAL LOGIC ---
            {
                subjectId: findId("Digital Logic"),
                title: "Study and Verification of Logic Gates",
                theory: "Verify AND, OR, NOT, NAND, NOR, XOR gates using truth tables.",
                algorithm: "1. Set Inputs A and B\n2. Measure Output Y\n3. Compare with Theoretical Truth Table",
                language: "Universal"
            },
            // --- OBJECT ORIENTED ---
            {
                subjectId: findId("Object Oriented"),
                title: "Class and Object Basics",
                theory: "Understand encapsulation and how objects are instantiated from classes in Java.",
                algorithm: "1. Define Class Person\n2. Define attribute 'name'\n3. Create Object p = new Person()\n4. Set p.name = 'Vaibhav'",
                codeTemplate: "class Person {\n    String name;\n    void display() {\n        System.out.println(\"Name: \" + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Person p = new Person();\n        p.name = \"Student\";\n        p.display();\n    }\n}",
                language: "java"
            },
            // --- MPMC ---
            {
                subjectId: findId("Microprocessor"),
                title: "8-bit Addition & Subtraction",
                theory: "Write 8085 assembly code to add two 8-bit numbers stored in memory.",
                algorithm: "1. LXI H, 2000H\n2. MOV A, M\n3. INX H\n4. ADD M\n5. STA 2050H\n6. HLT",
                language: "Assembly"
            }
        ];

        // Filter out experiments where subject wasn't found
        const validExperiments = defaultExperiments.filter(e => e.subjectId);

        await Experiment.deleteMany({});
        await Experiment.insertMany(validExperiments);

        res.status(201).json({ message: "Experiments seeded correctly", count: validExperiments.length });
    } catch (err) {
        console.error("[EXPERIMENT] Seed Error:", err);
        res.status(500).json({ message: "Server error while seeding experiments" });
    }
};

exports.getExperiments = async (req, res) => {
    try {
        const experiments = await Experiment.find();
        res.status(200).json(experiments);
    } catch (err) {
        console.error("[EXPERIMENT] Get All Error:", err);
        res.status(500).json({ message: "Server error while fetching experiments" });
    }
};
