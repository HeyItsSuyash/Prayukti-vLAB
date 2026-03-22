const Subject = require('../models/Subject');
const ActivityLog = require('../models/ActivityLog');

exports.createSubject = async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();

        // Log the action
        const log = new ActivityLog({
            action: 'CREATE_SUBJECT',
            userName: req.user?.fullName || 'Admin',
            userRole: req.user?.role || 'admin',
            details: `Created subject: ${subject.name} (${subject.code})`
        });
        await log.save();

        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const Experiment = require('../models/Experiment');

exports.getSubjects = async (req, res) => {
    try {
        const { branch, semester } = req.query;
        const query = {};
        if (branch) query.branch = branch;
        if (semester) query.semester = parseInt(semester);
        
        // Use aggregation to count experiments for each subject
        const subjects = await Subject.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "experiments",
                    localField: "_id",
                    foreignField: "subject",
                    as: "experiments"
                }
            },
            {
                $addFields: {
                    experimentCount: { $size: "$experiments" }
                }
            },
            {
                $project: {
                    experiments: 0 // Remove the actual experiment documents to keep response light
                }
            }
        ]);

        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: "Subject deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });

exports.createSubject = async (req, res) => {
    try {
        const { title, description, icon, experimentsCount, slug } = req.body;

        const newSubject = new Subject({
            title,
            description,
            icon,
            experimentsCount,
            slug
        });

        await newSubject.save();
        res.status(201).json({ message: "Subject created successfully", subject: newSubject });
    } catch (err) {
        console.error("[SUBJECT] Create Error:", err);
        res.status(500).json({ message: "Server error while creating subject" });
    }
};

exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ createdAt: -1 });
        res.status(200).json(subjects);
    } catch (err) {
        console.error("[SUBJECT] Get All Error:", err);
        res.status(500).json({ message: "Server error while fetching subjects" });
    }
};

exports.seedSubjects = async (req, res) => {
    try {
        const defaultSubjects = [
            {
                title: "Data Structures and Algorithms",
                description: "Master arrays, linked lists, trees, and core algorithms with interactive execution.",
                icon: "dsa",
                experimentsCount: 0
            },
            {
                title: "Computer Networks",
                description: "Explore the architecture of the internet, networking protocols, and OSI models.",
                icon: "cn",
                experimentsCount: 0,
                slug: "cn"
            },
            {
                title: "Digital Logic & Design",
                description: "Master the fundamentals of digital electronics, logic gates, and circuit design.",
                icon: "dld",
                experimentsCount: 0,
                slug: "dld"
            },
            {
                title: "Database Management",
                description: "Learn to design, query, and manage relational databases using SQL.",
                icon: "dbms",
                experimentsCount: 0,
                slug: "dbms"
            },
            {
                title: "Object Oriented Programming",
                description: "Learn the principles of encapsulation, inheritance, polymorphism, and abstraction.",
                icon: "oops",
                experimentsCount: 0,
                slug: "oops"
            },
            {
                title: "Microprocessor and Microcontroller",
                description: "Study the architecture, programming, and interfacing of 8085/8086 microprocessors.",
                icon: "mpmc",
                experimentsCount: 0,
                slug: "mpmc"
            },
            {
                title: "C Programming Lab",
                description: "Master the foundations of C programming, memory management, and data types.",
                icon: "c",
                experimentsCount: 0
            }
        ];

        // Clear existing to avoid duplicates if re-seeding
        await Subject.deleteMany({});
        await Subject.insertMany(defaultSubjects);

        res.status(201).json({ message: "Default subjects seeded successfully" });
    } catch (err) {
        console.error("[SUBJECT] Seed Error:", err);
        res.status(500).json({ message: "Server error while seeding subjects" });
    }
};
