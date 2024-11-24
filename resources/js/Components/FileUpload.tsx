import { useState } from 'react';
import axios, { AxiosProgressEvent } from "axios";
import { router } from "@inertiajs/react";

interface FileUploadProps {
    onUploadComplete: () => void; // Define the prop type
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState<{ [key: string]: number }>({}); // Tracks upload progress

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const uniqueFiles = filterDuplicateFiles(selectedFiles);
            startUpload(uniqueFiles);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            const uniqueFiles = filterDuplicateFiles(droppedFiles);
            startUpload(uniqueFiles);
        }
    };

    const filterDuplicateFiles = (newFiles: File[]): File[] => {
        const existingFileNames = files.map((file) => file.name);
        return newFiles.filter(
            (file) => !existingFileNames.includes(file.name),
        );
    };

    const startUpload = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);

        newFiles.forEach((file) => {
            const progressKey = file.name;
            setProgress((prev) => ({ ...prev, [progressKey]: 0 }));

            const formData = new FormData();
            formData.append('file', file);

            axios
                .post(route('files.store'), formData, {
                    onUploadProgress: (event: AxiosProgressEvent) => {
                        if (event.total === undefined) {
                            return;
                        }
                        const percentage = Math.round(
                            (event.loaded * 100) / event.total,
                        );
                        setProgress((prev) => ({
                            ...prev,
                            [progressKey]: percentage,
                        }));
                        if (percentage === 100) {
                            onUploadComplete();
                        }
                    },
                })
                .then((response) => {
                    console.log(response);
                    // Handle successful upload response here, if needed
                    // router.visit(route('dashboard')); // Optional: navigate to another page after upload
                })
                .catch((error) => {
                    // Handle upload error here, if needed
                    console.error(`Failed to upload ${file.name}:`, error);
                });
        });
    };

    return (
        <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center"
            onClick={() => document.getElementById('fileInput')?.click()} // Trigger file input click
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <span className="mb-4 text-2xl">📄</span>
            <p className="mb-2 darl:text-gray-300">Arrastra o selecciona tu cartola, boleta, factura, estado de cuenta, etc.</p>
            <input
                id="fileInput"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
            />

            <div className="mt-6 w-full">
                {files.map((file) => (
                    <div
                        key={file.name}
                        className="mb-4 grid grid-cols-3 items-center gap-4"
                    >
                        {/* File Name and Size */}
                        <div className="col-span-1">
                            <p className="truncate font-semibold dark:text-gray-300">
                                {file.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="col-span-1">
                            <div className="h-2 rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-indigo-600"
                                    style={{
                                        width: `${progress[file.name] || 0}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Progress Percentage */}
                        <div className="col-span-1 text-right">
                            <p className="text-sm text-gray-600">
                                {progress[file.name] === 100
                                    ? 'Listo'
                                    : `${progress[file.name] || 0}%`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
