const Subject = require('../models/Subject');
const ActivityLog = require('../models/ActivityLog');
const Experiment = require('../models/Experiment');

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Admin
exports.createSubject = async (req, res) => {
    try {
        const { title, description, icon, experimentsCount, slug, subject_id } = req.body;

        const newSubject = new Subject({
            title,
            description,
            icon,
            experimentsCount,
            slug,
            subject_id
        const { title, description, icon, experimentsCount, slug } = req.body;
        
        const subject = new Subject({
            title: title || req.body.name, // Support both naming conventions if needed
            description,
            icon,
            experimentsCount: experimentsCount || 0,
            slug
        });
        
        await subject.save();

        // Log the action
        try {
            const log = new ActivityLog({
                action: 'CREATE_SUBJECT',
                userName: req.user?.fullName || 'Admin',
                userRole: req.user?.role || 'admin',
                details: `Created subject: ${subject.title} (${subject.slug})`
            });
            await log.save();
        } catch (logErr) {
            console.error("Failed to save activity log:", logErr.message);
        }

        res.status(201).json(subject);
    } catch (error) {
        console.error("[SUBJECT] Create Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
exports.getSubjects = async (req, res) => {
    try {
        const { branch, semester } = req.query;
        const query = {};
        // if (branch) query.branch = branch;
        // if (semester) query.semester = parseInt(semester);
        
        // Use aggregation to count experiments for each subject if needed, 
        // but for now, simple find is safer given the state of the codebase.
        const subjects = await Subject.find(query).sort({ createdAt: -1 });
        res.json(subjects);
    } catch (error) {
        console.error("[SUBJECT] Get All Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Helper alias for route consistency
exports.getAllSubjects = exports.getSubjects;

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Admin
exports.updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Admin
exports.deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: "Subject deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed default subjects
// @route   POST /api/subjects/seed
// @access  Admin
exports.seedSubjects = async (req, res) => {
    try {
        const defaultSubjects = [
            {
                title: "Data Structures and Algorithms",
                description: "Master arrays, linked lists, trees, and core algorithms with interactive execution.",
                icon: "dsa",
                experimentsCount: 0,
                subject_id: "BCS-301"
                slug: "dsa"
            },
            {
                title: "Computer Networks",
                description: "Explore the architecture of the internet, networking protocols, and OSI models.",
                icon: "cn",
                experimentsCount: 0,
                slug: "cn",
                subject_id: "BCS-502"
            },
            {
                title: "Digital Logic & Design",
                description: "Master the fundamentals of digital electronics, logic gates, and circuit design.",
                icon: "dld",
                experimentsCount: 0,
                slug: "dld",
                subject_id: "BCS-303"
            },
            {
                title: "Database Management",
                description: "Learn to design, query, and manage relational databases using SQL.",
                icon: "dbms",
                experimentsCount: 0,
                slug: "dbms",
                subject_id: "BCS-404"
            },
            {
                title: "Object Oriented Programming",
                description: "Learn the principles of encapsulation, inheritance, polymorphism, and abstraction.",
                icon: "oops",
                experimentsCount: 0,
                slug: "oops",
                subject_id: "BCS-405"
            },
            {
                title: "Microprocessor and Microcontroller",
                description: "Study the architecture, programming, and interfacing of 8085/8086 microprocessors.",
                icon: "mpmc",
                experimentsCount: 0,
                slug: "mpmc",
                subject_id: "BCS-506"
            },
            {
                title: "C Programming Lab",
                description: "Master the foundations of C programming, memory management, and data types.",
                icon: "c",
                experimentsCount: 0,
                subject_id: "BCS-107"
            },
            {
                title: "Design and Analysis of Algorithms",
                description: "Design and Analysis of Algorithms Virtual Lab",
                icon: "FlaskConical",
                experimentsCount: 0,
                slug: "daa",
                subject_id: "BCS-408"
                slug: "c-programming"
            }
        ];

        await Subject.deleteMany({});
        await Subject.insertMany(defaultSubjects);

        res.status(201).json({ message: "Default subjects seeded successfully" });
    } catch (err) {
        console.error("[SUBJECT] Seed Error:", err);
        res.status(500).json({ message: "Server error while seeding subjects" });
    }
};
