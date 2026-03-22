const Experiment = require('../models/Experiment');
const ActivityLog = require('../models/ActivityLog');
const Subject = require('../models/Subject');

// @desc    Create an experiment
// @route   POST /api/experiments
// @access  Admin
exports.createExperiment = async (req, res) => {
    try {
        const { title, name, subjectId, theory, algorithm, codeTemplate, language, testcases } = req.body;

        const experiment = new Experiment({
            name: name || title,
            title: title || name,
            subject: subjectId || req.body.subject,
            subjectId: subjectId || req.body.subject,
            theory,
            algorithm,
            codeTemplate,
            language,
            testcases
        });

        await experiment.save();
        
        // Log action
        try {
            await new ActivityLog({
                action: 'CREATE_EXPERIMENT',
                userName: req.user?.fullName || 'Admin',
                userRole: 'admin',
                details: `Created experiment: ${experiment.name}`
            }).save();
        } catch (logErr) {
            console.error("Failed to save activity log:", logErr.message);
        }

        res.status(201).json(experiment);
    } catch (error) {
        console.error("[EXPERIMENT] Create Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get experiments (optionally filtered by subject)
// @route   GET /api/experiments
// @access  Public
exports.getExperiments = async (req, res) => {
    try {
        const { subjectId } = req.query;
        const query = subjectId ? { $or: [{ subject: subjectId }, { subjectId: subjectId }] } : {};
        const experiments = await Experiment.find(query).populate('subject');
        res.status(200).json(experiments);
    } catch (error) {
        console.error("[EXPERIMENT] Get All Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get experiments for a specific subject
// @route   GET /api/experiments/subject/:subjectId
// @access  Public
exports.getExperimentsBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const experiments = await Experiment.find({ 
            $or: [{ subject: subjectId }, { subjectId: subjectId }] 
        }).sort({ createdAt: 1 });
        res.status(200).json(experiments);
    } catch (err) {
        console.error("[EXPERIMENT] Get By Subject Error:", err);
        res.status(500).json({ message: "Server error while fetching experiments" });
    }
};

// @desc    Get experiment by ID
// @route   GET /api/experiments/:experimentId
// @access  Public
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

// @desc    Update an experiment
// @route   PUT /api/experiments/:id
// @access  Admin
exports.updateExperiment = async (req, res) => {
    try {
        const experiment = await Experiment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(experiment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an experiment
// @route   DELETE /api/experiments/:id
// @access  Admin
exports.deleteExperiment = async (req, res) => {
    try {
        await Experiment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Experiment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed default experiments
// @route   POST /api/experiments/seed
// @access  Admin
exports.seedExperiments = async (req, res) => {
    try {
        const subjects = await Subject.find();
        const findId = (titlePart) => subjects.find(s => 
            (s.title && s.title.toLowerCase().includes(titlePart.toLowerCase())) || 
            (s.name && s.name.toLowerCase().includes(titlePart.toLowerCase()))
        )?._id;

        const defaultExperiments = [
            {
                subjectId: findId("Data Structures"),
                title: "Reverse an Array",
                theory: "Reversing an array involves swapping elements from both ends moving towards the center.",
                algorithm: "1. Start\n2. Use two pointers: start=0, end=n-1\n3. Swap arr[start] and arr[end]\n4. Increment start, decrement end\n5. Repeat until start >= end",
                codeTemplate: "#include <iostream>\\n#include <vector>\\n\\n// TODO: Implement the reverseArray function\\nvoid reverseArray(std::vector<int>& arr) {\\n    // Your code here\\n}\\n\\nint main() {\\n    std::vector<int> arr = {1, 2, 3, 4, 5};\\n    \\n    std::cout << \\\"Original: \\\";\\n    for(int x : arr) std::cout << x << \\\" \\\";\\n    \\n    reverseArray(arr);\\n    \\n    std::cout << \\\"\\\\nReversed: \\\";\\n    for(int x : arr) std::cout << x << \\\" \\\";\\n    \\n    return 0;\\n}",
                language: "cpp",
                testcases: [ { input: "", output: "Original: 1 2 3 4 5 \nReversed: 5 4 3 2 1 " } ]
            },
            {
                subjectId: findId("Data Structures"),
                title: "Binary Search Implementation",
                theory: "Binary search targets a sorted array and repeatedly divides the search interval in half.",
                algorithm: "1. Set low=0, high=n-1\n2. Find mid = (low+high)/2\n4. If target < mid, high=mid-1\n5. Else low=mid+1",
                language: "cpp"
            },
            {
                subjectId: findId("C Programming"),
                title: "Sum of Natural Numbers",
                theory: "Calculate the sum of first N natural numbers using a loop.",
                language: "c"
            },
            {
                subjectId: findId("Computer Networks"),
                title: "OSI vs TCP/IP Reference Models",
                theory: "OSI has 7 layers, TCP/IP has 4.",
                language: "Universal"
            },
            {
                subjectId: findId("Database Management"),
                title: "Introduction to DBMS (DDL/DML)",
                theory: "Learn SQL commands: CREATE, INSERT, SELECT, UPDATE, DELETE.",
                language: "SQL"
            },
            {
                subjectId: findId("Digital Logic"),
                title: "Study and Verification of Logic Gates",
                theory: "Verify AND, OR, NOT, NAND, NOR, XOR gates using truth tables.",
                language: "Universal"
            },
            {
                subjectId: findId("Object Oriented"),
                title: "Class and Object Basics",
                theory: "Understand encapsulation and how objects are instantiated from classes in Java.",
                language: "java"
            },
            {
                subjectId: findId("Microprocessor"),
                title: "8-bit Addition & Subtraction",
                theory: "Write 8085 assembly code to add two 8-bit numbers stored in memory.",
                language: "Assembly"
            }
        ];

        const validExperiments = defaultExperiments.filter(e => e.subjectId).map(e => ({
            ...e,
            name: e.title,
            subject: e.subjectId
        }));

        await Experiment.deleteMany({});
        await Experiment.insertMany(validExperiments);

        res.status(201).json({ message: "Experiments seeded correctly", count: validExperiments.length });
    } catch (err) {
        console.error("[EXPERIMENT] Seed Error:", err);
        res.status(500).json({ message: "Server error while seeding experiments" });
    }
};
