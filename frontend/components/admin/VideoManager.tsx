"use client";

import { useEffect, useState } from "react";
import { getLabsBySubject, LabSubject, LabManifest } from "@/lib/labs/registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayCircle, Save, Trash2, CheckCircle, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner"; // Removed due to missing dependency

export function VideoManager() {
    const [selectedSubject, setSelectedSubject] = useState<LabSubject>("DBMS");
    const [experiments, setExperiments] = useState<LabManifest[]>([]);
    const [videoData, setVideoData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    // Fetch initial video data
    useEffect(() => {
        fetch("/api/videos")
            .then(res => res.json())
            .then(data => {
                setVideoData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load videos:", err);
                setLoading(false);
            });
    }, []);

    // Update experiments list when subject changes
    useEffect(() => {
        setExperiments(getLabsBySubject(selectedSubject));
    }, [selectedSubject]);

    const handleVideoChange = (labId: string, url: string) => {
        setVideoData(prev => ({
            ...prev,
            [labId]: url
        }));
    };

    const saveVideo = async (labId: string) => {
        setSaving(labId);
        const url = videoData[labId];

        // Basic validation for YouTube links
        if (url && !url.includes("youtube.com") && !url.includes("youtu.be")) {
            alert("Please enter a valid YouTube URL");
            setSaving(null);
            return;
        }

        // Convert watch link to embed if necessary
        let finalUrl = url;
        if (url && url.includes("watch?v=")) {
            const videoId = url.split("v=")[1]?.split("&")[0];
            if (videoId) {
                finalUrl = `https://www.youtube.com/embed/${videoId}`;
                // Update local state to reflect the change immediately
                handleVideoChange(labId, finalUrl);
            }
        } else if (url && url.includes("youtu.be/")) {
            const videoId = url.split("youtu.be/")[1]?.split("?")[0];
            if (videoId) {
                finalUrl = `https://www.youtube.com/embed/${videoId}`;
                handleVideoChange(labId, finalUrl);
            }
        }

        try {
            const res = await fetch("/api/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [labId]: finalUrl })
            });

            if (res.ok) {
                // simple success feedback
                const btn = document.getElementById(`btn-${labId}`);
                if (btn) {
                    const originalText = btn.innerText;
                    btn.innerText = "Saved!";
                    setTimeout(() => btn.innerText = originalText, 2000);
                }
            } else {
                alert("Failed to save");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving");
        } finally {
            setSaving(null);
        }
    };

    const removeVideo = async (labId: string) => {
        if (!confirm("Are you sure you want to remove this video?")) return;

        handleVideoChange(labId, ""); // Clear input

        // Save empty string to remove from persistence (or handled by backend logic)
        // Here we just save the empty string which effectively removes it from the UI's effective view
        try {
            await fetch("/api/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Sending empty string to indicate removal/no video
                body: JSON.stringify({ [labId]: "" })
            });
        } catch (e) {
            console.error(e);
        }
    }

    if (loading) return <div>Loading video configuration...</div>;

    return (
        <div className="w-full">
            <div className="mb-6">
                <label className="text-sm font-medium mb-2 block text-gray-700">Select Subject</label>
                <Select
                    value={selectedSubject}
                    onValueChange={(val) => setSelectedSubject(val as LabSubject)}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="DBMS">DBMS</SelectItem>
                        <SelectItem value="CN">Computer Networks (CN)</SelectItem>
                        <SelectItem value="DLD">Digital Logic Design (DLD)</SelectItem>
                        <SelectItem value="OOPS">Object Oriented Programming (OOPS)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 font-bold text-sm text-gray-500 pb-2 border-b">
                    <div className="col-span-4">Experiment</div>
                    <div className="col-span-6">Video URL (YouTube)</div>
                    <div className="col-span-2">Actions</div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    {experiments.map((exp) => (
                        <div key={exp.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-lg">
                            <div className="col-span-4">
                                <div className="font-semibold text-gray-900">{exp.metadata.title}</div>
                                <div className="text-xs text-gray-500 font-mono mt-1">{exp.id}</div>
                            </div>
                            <div className="col-span-6">
                                <Input
                                    placeholder="Paste YouTube Link (e.g. https://youtu.be/...)"
                                    value={videoData[exp.id] || ""}
                                    onChange={(e) => handleVideoChange(exp.id, e.target.value)}
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <Button
                                    id={`btn-${exp.id}`}
                                    onClick={() => saveVideo(exp.id)}
                                    disabled={saving === exp.id}
                                    size="sm"
                                    className="bg-black hover:bg-gray-800 text-white"
                                >
                                    {saving === exp.id ? "Saving..." : <Save className="h-4 w-4" />}
                                </Button>
                                {videoData[exp.id] && (
                                    <Button
                                        onClick={() => removeVideo(exp.id)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    {experiments.length === 0 && (
                        <div className="py-8 text-center text-gray-500">
                            No experiments found for this subject.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
