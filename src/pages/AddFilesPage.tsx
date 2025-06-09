"use client";

// Declare minimal types for the File System Access API
interface FileSystemHandle {
  kind: "file" | "directory";
  getFile?: () => Promise<File>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  values(): AsyncIterable<FileSystemHandle>;
}

// Extend the global Window interface to include showDirectoryPicker
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
}

import { useAtom, useAtomValue } from "jotai";
import { logFileInputAtom, sampleDataEnabledAtom } from "@library";
import { ChangeEvent } from "react";
import { MdDelete } from "react-icons/md";
import { Container } from "@components";

export const AddFilesPage = () => {
  const [, setFiles] = useAtom(logFileInputAtom);
  const logFileInput = useAtomValue(logFileInputAtom);
  const [sampleDataEnabled, setSampleDataEnabled] = useAtom(
    sampleDataEnabledAtom
  );

  const handleAddDirectory = async () => {
    try {
      if (!window.showDirectoryPicker) {
        console.error("Directory upload is supported only in Chrome.");
        return;
      }
      const directoryHandle = await window.showDirectoryPicker();
      const files: File[] = [];

      // Iterate over the directory entries
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === "file" && entry.getFile) {
          const file = await entry.getFile();
          // Check if the file is a text file by type or .txt extension
          if (
            (file.type && file.type.startsWith("text")) ||
            file.name.endsWith(".txt")
          ) {
            files.push(file);
          }
        }
      }

      setFiles(files);
    } catch (error) {
      console.error("Error adding directory:", error);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const filteredFiles = filesArray.filter(
        (file) =>
          (file.type && file.type.startsWith("text")) ||
          file.name.endsWith(".txt")
      );
      setFiles(filteredFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = logFileInput.files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6 text-base-900 dark:text-white">
        Add Files
      </h1>

      <div className="mb-6 p-4 border border-gray-700 border-gray-700 rounded-md dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-2 text-base-900 dark:text-white">
          Sample Data
        </h2>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={sampleDataEnabled}
            onChange={(e) => setSampleDataEnabled(e.target.checked)}
          />
          <div className="relative w-11 h-6 bg-base-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-base-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-base after:border-gray-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-700 peer-checked:bg-primary-600"></div>
        </label>
      </div>

      <div className="mb-6 p-4 border border-gray-700 border-gray-700 rounded-lg">
        {" "}
        {/* Use theme border border-gray-700 and radius */}
        {/* Use DaisyUI button classes */}
        <button
          className={`btn rounded-lg mb-4 ${
            window.showDirectoryPicker ? "btn-primary" : "btn-disabled"
          }`}
          onClick={handleAddDirectory}
          disabled={!window.showDirectoryPicker}
        >
          Add Directory
        </button>
        {!window.showDirectoryPicker && (
          <p className="text-sm text-red-500 mt-2">
            Directory upload is only supported in Chrome.
          </p>
        )}
      </div>

      <div className="mb-6 p-4 border border-gray-700 border-gray-700 rounded-lg">
        {" "}
        {/* Use theme border border-gray-700 and radius */}
        <h2 className="text-lg font-semibold mb-2">Upload Files</h2>
        {/* Style label like an outline button */}
        <label className="btn btn-outline rounded-lg cursor-pointer">
          Browse Files
          <input
            type="file"
            multiple
            accept="text/*,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="bg-base rounded-lg shadow-md p-4 dark:bg-base-800">
        <h2 className="text-lg font-semibold mb-4 text-base-900 dark:text-white">
          Files Added
        </h2>
        <ul className="divide-y divide-base-200 dark:divide-base-700">
          {logFileInput.files.map((file, index) => (
            <li key={index} className="py-3 flex justify-between items-center">
              <span className="text-base-800 dark:text-base-200">
                {file.name}
              </span>
              {/* Use DaisyUI ghost button for delete */}
              <button
                className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:bg-error/20 hover:text-error"
                onClick={() => handleRemoveFile(index)}
                aria-label="delete"
              >
                <MdDelete size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default AddFilesPage;
