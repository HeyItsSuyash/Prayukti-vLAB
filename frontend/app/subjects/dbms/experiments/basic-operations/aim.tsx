export default function Aim() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Aim
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-lg text-gray-800 leading-relaxed">
                    To understand the Database Management System (DBMS) environment and perform basic operations such as creating a database and creating tables with fields and records using a simulated interface supporting multiple database types (Oracle, MySQL, PostgreSQL, MS-Access).
                </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Objectives</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Familiarize with DBMS terminology.</li>
                        <li>Learn to create a database container.</li>
                        <li>Learn to define table schemas with data types.</li>
                        <li>Understand the hierarchical relationship: Database → Table → Field/Record.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
