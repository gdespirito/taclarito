import { useState } from 'react';
import { IconUpload } from './Icons';

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
            startSimulatedUpload(uniqueFiles);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            const uniqueFiles = filterDuplicateFiles(droppedFiles);
            startSimulatedUpload(uniqueFiles);
        }
    };

    const filterDuplicateFiles = (newFiles: File[]): File[] => {
        const existingFileNames = files.map((file) => file.name);
        return newFiles.filter((file) => !existingFileNames.includes(file.name));
    };

    const startSimulatedUpload = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);

        newFiles.forEach((file) => {
            const progressKey = file.name;
            setProgress((prev) => ({ ...prev, [progressKey]: 0 }));

            // Simulate progress
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const newProgress = Math.min(prev[progressKey] + 1, 100);
                    if (newProgress === 100) {
                        clearInterval(interval);
                        // Trigger onUploadComplete once all files are uploaded
                        onUploadComplete();
                    }
                    return { ...prev, [progressKey]: newProgress };
                });
            }, 20); // Update progress every 300ms
        });
    };

    return (
        <div
        className="border-dashed border-2 border-gray-600 rounded-lg p-6 text-center cursor-pointer flex flex-col items-center justify-center"
        onClick={() => document.getElementById('fileInput')?.click()} // Trigger file input click
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
    >
        <span className="mb-4 text-2xl">
            📄
        </span>
        <p className="text-gray-300 mb-2">¡Sube tu cartola!</p>
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
                    className="grid grid-cols-3 gap-4 items-center mb-4"
                >
                    {/* File Name and Size */}
                    <div className="col-span-1">
                        <p className="text-gray-300 font-semibold truncate">{file.name}</p>
                        <p className="text-gray-500 text-sm">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
    
                    {/* Progress Bar */}
                    <div className="col-span-1">
                        <div className="h-2 rounded-full bg-gray-200">
                            <div
                                className="h-2 rounded-full bg-indigo-600"
                                style={{ width: `${progress[file.name] || 0}%` }}
                            ></div>
                        </div>
                    </div>
    
                    {/* Progress Percentage */}
                    <div className="col-span-1 text-right">
                        <p className="text-gray-600 text-sm">
                            {progress[file.name] === 100
                                ? 'Listo!'
                                : `${progress[file.name] || 0}%`}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
    
    );
}
