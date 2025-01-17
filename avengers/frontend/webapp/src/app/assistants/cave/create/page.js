"use client";

const url = "https://superhero-02-01-150699885662.europe-west1.run.app";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AssistantPicker from "@/app/components/assistantPicker";
import Image from "next/image";
import caveLogo from "../assets/cave-logo-name.png";

export default function CreateProject() {
    const [name, setName] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("github_link", githubLink);
    
        try {
            const response = await fetch(`${url}/api/projects/create_project/`, {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error("Failed to create the project. Please try again.");
            }
    
            const data = await response.json();
            // Redirect to the view page of the created project
            router.push(`/projects/${data.id}`);
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar with AssistantPicker */}
            <div className="w-1/8 bg-gray-900 text-white">
                <AssistantPicker />
            </div>

            {/* Top-Right Logo */}
            <div className="absolute top-4 right-4">
                <Image src={caveLogo} alt="CAVE Logo" width={150} />
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow">
                <h1 className="text-3xl text-gray-700 font-bold mb-6">Create a New Project</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow-md">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter the project name"
                            className="mt-2 p-2 border rounded w-full bg-white text-gray-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="githubLink" className="block text-lg font-medium text-gray-700">
                            GitHub Link
                        </label>
                        <input
                            type="text"
                            id="githubLink"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            placeholder="Enter the GitHub repository URL"
                            className="mt-2 p-2 border rounded w-full bg-white text-gray-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded shadow-md hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Creating Project..." : "Create Project"}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 bg-red-100 text-red-600 p-4 rounded w-full max-w-md">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}