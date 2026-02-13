"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Box, ShoppingCart, CreditCard, Plus, ArrowRight, CheckCircle2, AlertCircle, Terminal, Play, FileText, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppMode = "Store" | "Vendor" | "Finance";

// Simplified Schema
const schemas = {
    Store: [
        { name: "Products", columns: ["id", "name", "price", "stock_qty"] },
        { name: "Customers", columns: ["id", "name", "email"] },
        { name: "Sales", columns: ["id", "customer_id", "product_id", "qty", "total"] }
    ],
    Vendor: [
        { name: "Vendors", columns: ["id", "name", "contact_info"] },
        { name: "PurchaseOrders", columns: ["id", "vendor_id", "item_name", "qty"] },
        { name: "Deliveries", columns: ["id", "po_id", "delivery_date", "status"] }
    ],
    Finance: [
        { name: "Accounts", columns: ["id", "account_name", "type", "balance"] },
        { name: "Transactions", columns: ["id", "from_acc", "to_acc", "amount", "type", "date"] },
        { name: "Ledger", columns: ["id", "trans_id", "debit", "credit"] }
    ]
};

import { WithMode } from "@/lib/labs/modes";

interface ApplicationDevelopmentSimulationProps extends WithMode {
    mode?: "LEARNING" | "EXPERIMENTAL" | "EXAM";
}

export default function ApplicationDevelopmentSimulation({ mode = "LEARNING" }: ApplicationDevelopmentSimulationProps) {
    const isExam = mode === "EXAM";

    const [appMode, setAppMode] = useState<AppMode>("Store");
    const [actionLog, setActionLog] = useState<string[]>([]);
    const [sqlQuery, setSqlQuery] = useState("");

    // Simulated Data Store (In-memory)
    const [data, setData] = useState<any>({
        Store: {
            Products: [{ id: 1, name: "Laptop", price: 50000, stock_qty: 10 }],
            Customers: [{ id: 1, name: "Student A", email: "std@univ.edu" }],
            Sales: []
        },
        Vendor: {
            Vendors: [{ id: 1, name: "TechSupplies Inc", contact_info: "New Delhi" }],
            PurchaseOrders: [],
            Deliveries: []
        },
        Finance: {
            Accounts: [
                { id: 1, account_name: "Cash", type: "Asset", balance: 100000 },
                { id: 2, account_name: "Sales Revenue", type: "Income", balance: 0 }
            ],
            Transactions: [],
            Ledger: []
        }
    });

    // Form Inputs & UI State
    const [formInputs, setFormInputs] = useState<any>({});
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [editingState, setEditingState] = useState<{ table: string, id: number } | null>(null);

    const logAction = (msg: string) => setActionLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    // -- SQL Execution Logic --
    const executeSQL = () => {
        const query = sqlQuery.trim();
        if (!query) return;

        logAction(`EXECUTE: ${query}`);
        const lowerQuery = query.toLowerCase();

        try {
            if (lowerQuery.startsWith("insert into")) {
                const tableNameMatch = query.match(/insert into\s+(\w+)/i);
                if (!tableNameMatch) throw new Error("Invalid table name");
                const tableName = tableNameMatch[1];
                let targetMode: AppMode | null = null;
                if (Object.keys(data.Store).includes(tableName)) targetMode = "Store";
                else if (Object.keys(data.Vendor).includes(tableName)) targetMode = "Vendor";
                else if (Object.keys(data.Finance).includes(tableName)) targetMode = "Finance";

                if (!targetMode) throw new Error(`Table '${tableName}' not found.`);

                const valuesMatch = query.match(/values\s*\((.+)\)/i);
                if (!valuesMatch) throw new Error("Invalid VALUES clause");
                const values = valuesMatch[1].split(',').map(v => {
                    const val = v.trim();
                    if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1);
                    return isNaN(Number(val)) ? val : Number(val);
                });

                const schema = schemas[targetMode].find(t => t.name === tableName);
                if (!schema) throw new Error("Schema definition not found");

                const newRecord: any = {};
                schema.columns.forEach((col, idx) => { newRecord[col] = values[idx] !== undefined ? values[idx] : null; });

                const newData = { ...data };
                newData[targetMode][tableName].push(newRecord);
                setData(newData);
                logAction(`SUCCESS: 1 row inserted.`);
            } else if (lowerQuery.startsWith("delete from")) {
                // Basic DELETE implementation for demo
                const tableMatch = lowerQuery.match(/delete from\s+(\w+)/i);
                if (!tableMatch) throw new Error("Invalid DELETE syntax");
                const tableName = tableMatch[1];
                // We only support deleting by ID for simplicity in SQL console for now, or just clearing table
                // Expanding this is complex for regex parser, sticking to UI for robust delete.
                logAction("INFO: For specific deletes, please use the UI trash icon. Console supports basic INSERT.");
            } else {
                logAction("INFO: Only INSERT currently supported in console.");
            }
        } catch (e: any) { logAction(`ERROR: ${e.message}`); }
        setSqlQuery("");
    };

    // -- CRUD Helpers --
    const deleteRecord = (table: string, id: number) => {
        if (!confirm("Are you sure you want to delete this record?")) return;
        const newData = { ...data };
        newData[appMode][table] = newData[appMode][table].filter((r: any) => r.id !== id);
        setData(newData);
        logAction(`DELETE FROM ${table} WHERE id=${id};`);
    };

    const startEdit = (table: string, record: any) => {
        setEditingState({ table, id: record.id });
        setFormInputs({ ...record });
        // Map table to action
        if (table === "Products") setActiveAction("addProduct");
        if (table === "Customers") setActiveAction("addCustomer");
        if (table === "Vendors") setActiveAction("addVendor");
        if (table === "PurchaseOrders") setActiveAction("createPO");
        if (table === "Accounts") setActiveAction("addAccount");
        // Others might not be editable directly or easy to map
    };

    // -- Store Operations --
    const handleAddProduct = () => {
        const newData = { ...data };
        if (editingState) {
            const idx = newData.Store.Products.findIndex((p: any) => p.id === editingState.id);
            if (idx >= 0) {
                newData.Store.Products[idx] = { ...newData.Store.Products[idx], ...formInputs, id: editingState.id };
                logAction(`UPDATE Products SET ... WHERE id=${editingState.id};`);
            }
        } else {
            const newProduct = {
                id: data.Store.Products.length + 1,
                name: formInputs.name || "New Item",
                price: Number(formInputs.price) || 0,
                stock_qty: Number(formInputs.qty) || 0
            };
            newData.Store.Products.push(newProduct);
            logAction(`INSERT INTO Products VALUES (${newProduct.id}, ...);`);
        }
        setData(newData);
        resetForm();
    };

    const handleAddCustomer = () => {
        const newData = { ...data };
        if (editingState) {
            const idx = newData.Store.Customers.findIndex((c: any) => c.id === editingState.id);
            if (idx >= 0) {
                newData.Store.Customers[idx] = { ...newData.Store.Customers[idx], ...formInputs, id: editingState.id };
                logAction(`UPDATE Customers SET ... WHERE id=${editingState.id};`);
            }
        } else {
            const newCustomer = {
                id: data.Store.Customers.length + 1,
                name: formInputs.name || "New Customer",
                email: formInputs.email || "user@example.com"
            };
            newData.Store.Customers.push(newCustomer);
            logAction(`INSERT INTO Customers VALUES (${newCustomer.id}, ...);`);
        }
        setData(newData);
        resetForm();
    };

    const handlePurchase = () => {
        const productId = Number(formInputs.productId);
        const customerId = Number(formInputs.customerId);
        const qty = Number(formInputs.qty);

        const product = data.Store.Products.find((p: any) => p.id === productId);
        if (!product || product.stock_qty < qty) { alert("Error: Insufficient Stock!"); return; }

        const sale = {
            id: data.Store.Sales.length + 1,
            customer_id: customerId,
            product_id: productId,
            qty: qty,
            total: product.price * qty
        };

        const newData = { ...data };
        const prodIdx = newData.Store.Products.findIndex((p: any) => p.id === productId);
        newData.Store.Products[prodIdx].stock_qty -= qty;
        newData.Store.Sales.push(sale);

        setData(newData);
        logAction(`START TRANSACTION; INSERT INTO Sales...; UPDATE Products...; COMMIT;`);
        resetForm();
    };

    // -- Vendor Operations --
    const handleAddVendor = () => {
        const newData = { ...data };
        if (editingState) {
            const idx = newData.Vendor.Vendors.findIndex((v: any) => v.id === editingState.id);
            if (idx >= 0) {
                newData.Vendor.Vendors[idx] = { ...newData.Vendor.Vendors[idx], ...formInputs, id: editingState.id };
                logAction(`UPDATE Vendors ...;`);
            }
        } else {
            const newVendor = {
                id: data.Vendor.Vendors.length + 1,
                name: formInputs.name || "New Vendor",
                contact_info: formInputs.contact || "N/A"
            };
            newData.Vendor.Vendors.push(newVendor);
            logAction(`INSERT INTO Vendors ...;`);
        }
        setData(newData);
        resetForm();
    };

    const handleCreatePO = () => {
        const po = { id: data.Vendor.PurchaseOrders.length + 1, vendor_id: Number(formInputs.vendorId), item_name: formInputs.item, qty: Number(formInputs.qty) };
        const newData = { ...data };
        newData.Vendor.PurchaseOrders.push(po);
        setData(newData);
        logAction(`INSERT INTO PurchaseOrders ...;`);
        resetForm();
    };

    const handleAddDelivery = () => {
        const delivery = { id: data.Vendor.Deliveries.length + 1, po_id: Number(formInputs.poId), delivery_date: formInputs.date, status: formInputs.status };
        const newData = { ...data };
        newData.Vendor.Deliveries.push(delivery);
        setData(newData);
        logAction(`INSERT INTO Deliveries ...;`);
        resetForm();
    };

    // -- Finance Operations --
    const handleAddAccount = () => {
        const newData = { ...data };
        if (editingState) {
            const idx = newData.Finance.Accounts.findIndex((a: any) => a.id === editingState.id);
            if (idx >= 0) {
                newData.Finance.Accounts[idx] = { ...newData.Finance.Accounts[idx], ...formInputs, id: editingState.id };
                logAction(`UPDATE Accounts ...;`);
            }
        } else {
            const acc = { id: data.Finance.Accounts.length + 1, account_name: formInputs.name || "New Account", type: formInputs.type || "Asset", balance: Number(formInputs.balance) || 0 };
            newData.Finance.Accounts.push(acc);
            logAction(`INSERT INTO Accounts ...;`);
        }
        setData(newData);
        resetForm();
    };

    const handleTransaction = () => {
        const amount = Number(formInputs.amount);
        const type = formInputs.type; // Credit | Debit
        const accId = Number(formInputs.accountId);

        const newData = { ...data };
        const accIdx = newData.Finance.Accounts.findIndex((a: any) => a.id === accId);

        if (accIdx === -1) { alert("Account not found"); return; }

        if (type === "Credit") newData.Finance.Accounts[accIdx].balance += amount;
        else newData.Finance.Accounts[accIdx].balance -= amount;

        const trans = {
            id: newData.Finance.Transactions.length + 1,
            from_acc: type === "Credit" ? "External" : "Account " + accId,
            to_acc: type === "Credit" ? "Account " + accId : "External",
            amount: amount,
            type: type,
            date: new Date().toISOString().split('T')[0]
        };
        newData.Finance.Transactions.push(trans);

        setData(newData);
        logAction(`START TRANSACTION; UPDATE Accounts SET balance = ... WHERE id=${accId}; INSERT INTO Transactions...; COMMIT;`);
        resetForm();
    };

    const handleAddLedger = () => {
        const entry = { id: data.Finance.Ledger.length + 1, trans_id: Number(formInputs.transId), debit: Number(formInputs.debit) || 0, credit: Number(formInputs.credit) || 0 };
        const newData = { ...data };
        newData.Finance.Ledger.push(entry);
        setData(newData);
        logAction(`INSERT INTO Ledger ...;`);
        resetForm();
    };

    const resetForm = () => {
        setActiveAction(null);
        setFormInputs({});
        setEditingState(null);
    };

    const renderVisualizer = () => {
        const currentSchema = schemas[appMode];
        const currentData = data[appMode];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSchema.map((table: any) => (
                    <div key={table.name} className="bg-white rounded-lg border shadow-sm flex flex-col">
                        <div className="bg-gray-50 border-b p-3 font-bold text-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2"> <TableIcon size={14} className="text-gray-400" /> {table.name} </div>
                            <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-500">{currentData[table.name]?.length} Records</span>
                        </div>
                        <div className="p-0 overflow-x-auto flex-1 h-48">
                            <table className="w-full text-xs">
                                <thead className="bg-[#f8f9fa] text-gray-500 border-b sticky top-0">
                                    <tr>
                                        {table.columns.map((col: string) => <th key={col} className="px-3 py-2 text-left font-medium bg-[#f8f9fa]">{col}</th>)}
                                        <th className="px-3 py-2 text-right bg-[#f8f9fa]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {currentData[table.name]?.slice().reverse().map((row: any, i: number) => (
                                        <tr key={i} className="hover:bg-blue-50/50 group">
                                            {table.columns.map((col: string) => <td key={col} className="px-3 py-2 text-gray-600 truncate max-w-[100px]">{row[col]}</td>)}
                                            <td className="px-3 py-2 text-right flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEdit(table.name, row)} className="p-1 hover:bg-gray-200 rounded text-blue-600"><Edit size={12} /></button>
                                                <button onClick={() => deleteRecord(table.name, row.id)} className="p-1 hover:bg-red-100 rounded text-red-600"><Trash2 size={12} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {currentData[table.name]?.length === 0 && <tr><td colSpan={table.columns.length + 1} className="p-4 text-center text-gray-300 italic">Empty</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    function TableIcon({ size, className }: { size: number, className: string }) { return <div className={`border rounded p-0.5 ${className}`} style={{ width: size, height: size, display: 'inline-block' }} ></div> }

    return (
        <div className="flex h-screen flex-col bg-gray-50 font-sans">
            <header className="bg-white border-b shadow-sm z-10 p-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/dbms/2" className="p-2 hover:bg-gray-100 rounded-full"> <ArrowLeft size={18} className="text-gray-600" /> </Link>
                    <h1 className="font-bold text-gray-800">Application Development Simulator</h1>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    {["Store", "Vendor", "Finance"].map((m) => (
                        <button key={m} onClick={() => { setAppMode(m as AppMode); setActionLog([]); resetForm(); }}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${appMode === m ? "bg-white shadow text-[#d32f2f]" : "text-gray-500 hover:text-gray-700"}`}>
                            {m} System
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto p-6 space-y-8 bg-gray-50">
                    {/* Action Bar */}
                    <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                {appMode === "Store" && <ShoppingCart className="text-orange-500" />}
                                {appMode === "Vendor" && <Box className="text-blue-500" />}
                                {appMode === "Finance" && <CreditCard className="text-green-500" />}
                                {appMode} Management Dashboard
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Select an action or use icons in tables to Edit/Delete.</p>
                        </div>
                        <div className="flex gap-3">
                            {appMode === "Store" && (
                                <>
                                    <Button onClick={() => setActiveAction("addProduct")} className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white"> <Plus size={16} className="mr-1" /> Add Product </Button>
                                    <Button onClick={() => setActiveAction("addCustomer")} className="bg-[#f57f17] hover:bg-[#e65100] text-white"> <Plus size={16} className="mr-1" /> Add Customer </Button>
                                    <Button onClick={() => setActiveAction("purchase")} variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50"> <ShoppingCart size={16} className="mr-1" /> Add Sale </Button>
                                </>
                            )}
                            {appMode === "Vendor" && (
                                <>
                                    <Button onClick={() => setActiveAction("addVendor")} className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white"> <Plus size={16} className="mr-1" /> New Vendor </Button>
                                    <Button onClick={() => setActiveAction("createPO")} variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50"> <ArrowRight size={16} className="mr-1" /> Create PO </Button>
                                    <Button onClick={() => setActiveAction("addDelivery")} className="bg-purple-600 hover:bg-purple-700 text-white"> <Plus size={16} className="mr-1" /> Add Delivery </Button>
                                </>
                            )}
                            {appMode === "Finance" && (
                                <>
                                    <Button onClick={() => setActiveAction("addAccount")} className="bg-blue-600 hover:bg-blue-700 text-white"> <Plus size={16} className="mr-1" /> Add Account </Button>
                                    <Button onClick={() => setActiveAction("transaction")} className="bg-green-600 hover:bg-green-700 text-white"> <Plus size={16} className="mr-1" /> Record Transaction </Button>
                                    <Button onClick={() => setActiveAction("addLedger")} variant="outline" className="border-gray-500 text-gray-700 hover:bg-gray-100"> <FileText size={16} className="mr-1" /> Add Ledger </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Forms Area */}
                    {activeAction && (
                        <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-200 animate-in fade-in slide-in-from-top-4">
                            <div className="max-w-md mx-auto bg-white p-6 rounded shadow-lg">
                                <h3 className="font-bold mb-4 border-b pb-2 flex justify-between items-center">
                                    {editingState ? `Edit Record (ID: ${editingState.id})` : "New Record"}
                                    <span className="text-xs font-normal text-gray-500 px-2 py-1 bg-gray-100 rounded">{activeAction}</span>
                                </h3>

                                <div className="space-y-4">
                                    {/* Store Forms */}
                                    {activeAction === "addProduct" && (
                                        <>
                                            <input className="w-full border p-2 rounded" placeholder="Product Name" value={formInputs.name || ""} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} />
                                            <input className="w-full border p-2 rounded" placeholder="Price" type="number" value={formInputs.price || ""} onChange={(e) => setFormInputs({ ...formInputs, price: e.target.value })} />
                                            <input className="w-full border p-2 rounded" placeholder="Stock Qty" type="number" value={formInputs.stock_qty || formInputs.qty || ""} onChange={(e) => setFormInputs({ ...formInputs, qty: e.target.value, stock_qty: e.target.value })} />
                                            <Button onClick={handleAddProduct} className="w-full bg-[#d32f2f]">Save Product</Button>
                                        </>
                                    )}
                                    {activeAction === "addCustomer" && (
                                        <>
                                            <input className="w-full border p-2 rounded" placeholder="Name" value={formInputs.name || ""} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} />
                                            <input className="w-full border p-2 rounded" placeholder="Email" value={formInputs.email || ""} onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })} />
                                            <Button onClick={handleAddCustomer} className="w-full bg-[#f57f17]">Save Customer</Button>
                                        </>
                                    )}
                                    {activeAction === "purchase" && (
                                        <>
                                            <select className="w-full border p-2 rounded" onChange={(e) => setFormInputs({ ...formInputs, customerId: e.target.value })}>
                                                <option value="">Select Customer...</option>
                                                {data.Store.Customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            <select className="w-full border p-2 rounded" onChange={(e) => setFormInputs({ ...formInputs, productId: e.target.value })}>
                                                <option value="">Select Product...</option>
                                                {data.Store.Products.map((p: any) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_qty})</option>)}
                                            </select>
                                            <input className="w-full border p-2 rounded" placeholder="Quantity" type="number" onChange={(e) => setFormInputs({ ...formInputs, qty: e.target.value })} />
                                            <Button onClick={handlePurchase} className="w-full bg-[#f57f17]">Process Order</Button>
                                        </>
                                    )}

                                    {/* Vendor Forms */}
                                    {activeAction === "addVendor" && (
                                        <>
                                            <input className="w-full border p-2 rounded" placeholder="Name" value={formInputs.name || ""} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} />
                                            <input className="w-full border p-2 rounded" placeholder="Contact" value={formInputs.contact_info || formInputs.contact || ""} onChange={(e) => setFormInputs({ ...formInputs, contact: e.target.value })} />
                                            <Button onClick={handleAddVendor} className="w-full bg-[#d32f2f]">Save Vendor</Button>
                                        </>
                                    )}
                                    {activeAction === "createPO" && (
                                        <>
                                            <select className="w-full border p-2 rounded" onChange={(e) => setFormInputs({ ...formInputs, vendorId: e.target.value })}>
                                                {data.Vendor.Vendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                                            </select>
                                            <input className="w-full border p-2 rounded" placeholder="Item Name" value={formInputs.item || formInputs.item_name || ""} onChange={(e) => setFormInputs({ ...formInputs, item: e.target.value })} />
                                            <input className="w-full border p-2 rounded" placeholder="Qty" type="number" value={formInputs.qty || ""} onChange={(e) => setFormInputs({ ...formInputs, qty: e.target.value })} />
                                            <Button onClick={handleCreatePO} className="w-full bg-blue-600">Save PO</Button>
                                        </>
                                    )}
                                    {activeAction === "addDelivery" && (
                                        <>
                                            <select className="w-full border p-2 rounded" onChange={(e) => setFormInputs({ ...formInputs, poId: e.target.value })}>
                                                <option value="">Select PO...</option>
                                                {data.Vendor.PurchaseOrders.map((p: any) => <option key={p.id} value={p.id}>PO #{p.id} - {p.item_name}</option>)}
                                            </select>
                                            <input type="date" className="w-full border p-2 rounded" onChange={(e) => setFormInputs({ ...formInputs, date: e.target.value })} />
                                            <Button onClick={handleAddDelivery} className="w-full bg-purple-600 text-white">Save Delivery</Button>
                                        </>
                                    )}

                                    {/* Finance Forms */}
                                    {activeAction === "addAccount" && (
                                        <>
                                            <input className="w-full border p-2 rounded" placeholder="Account Name" value={formInputs.name || formInputs.account_name || ""} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} />
                                            <select className="w-full border p-2 rounded" value={formInputs.type} onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })}>
                                                <option value="Asset">Asset</option>
                                                <option value="Liability">Liability</option>
                                                <option value="Income">Income</option>
                                                <option value="Expense">Expense</option>
                                            </select>
                                            <input className="w-full border p-2 rounded" placeholder="Balance" type="number" value={formInputs.balance || ""} onChange={(e) => setFormInputs({ ...formInputs, balance: e.target.value })} />
                                            <Button onClick={handleAddAccount} className="w-full bg-blue-600">Save Account</Button>
                                        </>
                                    )}
                                    {activeAction === "transaction" && (
                                        <>
                                            <select className="w-full border p-2 rounded" onChange={(e) => setFormInputs({ ...formInputs, accountId: e.target.value })}>
                                                <option value="">Select Account...</option>
                                                {data.Finance.Accounts.map((a: any) => <option key={a.id} value={a.id}>{a.account_name} (Bal: {a.balance})</option>)}
                                            </select>
                                            <div className="flex gap-2">
                                                <select className="w-1/3 border p-2 rounded" onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })}>
                                                    <option value="">Type...</option>
                                                    <option value="Credit">Credit (+)</option>
                                                    <option value="Debit">Debit (-)</option>
                                                </select>
                                                <input className="w-2/3 border p-2 rounded" placeholder="Amount" type="number" onChange={(e) => setFormInputs({ ...formInputs, amount: e.target.value })} />
                                            </div>
                                            <Button onClick={handleTransaction} className="w-full bg-green-600">Post Transaction</Button>
                                        </>
                                    )}
                                    {activeAction === "addLedger" && (
                                        <>
                                            <select className="w-full border p-2 rounded" onChange={(e) => setFormInputs({ ...formInputs, transId: e.target.value })}>
                                                <option value="">Select Transaction...</option>
                                                {data.Finance.Transactions.map((t: any) => <option key={t.id} value={t.id}>Tx #{t.id} ({t.type} {t.amount})</option>)}
                                            </select>
                                            <div className="flex gap-2">
                                                <input className="w-1/2 border p-2 rounded" placeholder="Debit" type="number" onChange={(e) => setFormInputs({ ...formInputs, debit: e.target.value })} />
                                                <input className="w-1/2 border p-2 rounded" placeholder="Credit" type="number" onChange={(e) => setFormInputs({ ...formInputs, credit: e.target.value })} />
                                            </div>
                                            <Button onClick={handleAddLedger} className="w-full bg-gray-600">Save Entry</Button>
                                        </>
                                    )}

                                    <Button variant="ghost" size="sm" onClick={resetForm} className="w-full text-gray-400">Cancel</Button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Visualizer */}
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase mb-3">Live Database State</h3>
                        {renderVisualizer()}
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="w-96 bg-[#1e1e1e] border-l border-gray-700 flex flex-col shrink-0">
                    {/* Top: SQL Console */}
                    <div className="flex-1 flex flex-col border-b border-gray-700">
                        <div className="p-3 bg-[#252526] border-b border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2"> <Terminal size={14} className="text-green-400" /> <span className="text-xs font-mono font-bold text-gray-300">SQL Console</span> </div>
                        </div>
                        <div className="flex-1 bg-[#1e1e1e] p-3">
                            <textarea value={sqlQuery} onChange={(e) => setSqlQuery(e.target.value)} placeholder="> query..." className="w-full h-full bg-transparent text-green-400 font-mono text-xs outline-none resize-none placeholder-gray-600" />
                        </div>
                        <div className="bg-[#2d2d2d] p-2 flex justify-end">
                            <Button size="sm" onClick={executeSQL} className="bg-green-700 hover:bg-green-800 text-white text-xs h-7"> <Play size={12} className="mr-1" /> Execute </Button>
                        </div>
                    </div>

                    {/* Bottom: Activity Log */}
                    <div className="h-1/3 flex flex-col border-t-2 border-gray-800">
                        <div className="p-2 bg-[#252526] border-b border-black flex items-center gap-2"> <span className="font-mono font-bold text-[10px] text-gray-400 uppercase">Activity Log</span> </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[10px]">
                            {actionLog.map((log, i) => (<div key={i} className="text-gray-400 border-l border-gray-600 pl-2 leading-tight"> {log} </div>))}
                            {actionLog.length === 0 && <span className="text-gray-700 italic">No activity yet.</span>}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
