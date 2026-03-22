"use client";

import React from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

interface MonacoEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    theme?: "vs-dark" | "light";
    height?: string;
    fontSize?: number;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
    value,
    onChange,
    language = "javascript",
    theme = "vs-dark",
    height = "100%",
    fontSize = 14
}) => {
    return (
        <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-2xl">
            <Editor
                height={height}
                language={language.toLowerCase()}
                value={value}
                theme={theme}
                onChange={onChange}
                loading={
                    <div className="flex flex-col items-center justify-center p-20 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Loading IDE...
                        </span>
                    </div>
                }
                options={{
                    fontSize: fontSize,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: "var(--font-geist-mono), monospace",
                    cursorSmoothCaretAnimation: "on",
                    smoothScrolling: true,
                    tabSize: 4,
                    renderLineHighlight: "all",
                    overviewRulerBorder: false,
                    lineNumbers: "on",
                    glyphMargin: false,
                    folding: true,
                    scrollbar: {
                        vertical: "visible",
                        horizontal: "visible",
                        useShadows: false,
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10
                    }
                }}
            />
        </div>
    );
};
