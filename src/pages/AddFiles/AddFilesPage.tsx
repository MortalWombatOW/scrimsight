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
import { logFileInputAtom, logFileInputMutationAtom } from "../../atoms/files";
import { ChangeEvent } from "react";
import { MdDelete } from "react-icons/md";
import { sampleDataEnabledAtom } from "../../atoms/files/sampleDataAtoms";

export const AddFilesPage = () => {
  const [, setFiles] = useAtom(logFileInputMutationAtom);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Add Files
      </h1>

      <div className="mb-6 p-4 border border-gray-200 rounded-md dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Sample Data
        </h2>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={sampleDataEnabled}
            onChange={(e) => setSampleDataEnabled(e.target.checked)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
        </label>
      </div>

      <div className="mb-6 p-4 border border-gray-200 rounded-md dark:border-gray-700">
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            window.showDirectoryPicker
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700"
          } mb-4 transition-colors`}
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

      <div className="mb-6 p-4 border border-gray-200 rounded-md dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Upload Files
        </h2>
        <label className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium cursor-pointer hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
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

      <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Files Added
        </h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {logFileInput.files.map((file, index) => (
            <li key={index} className="py-3 flex justify-between items-center">
              <span className="text-gray-800 dark:text-gray-200">
                {file.name}
              </span>
              <button
                className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleRemoveFile(index)}
                aria-label="delete"
              >
                <MdDelete size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
