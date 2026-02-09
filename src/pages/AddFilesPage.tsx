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

import { ChangeEvent, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Page, Card } from "@components";
import { useLoadFiles, useIsProcessing, useMatches, useClearData } from "../hooks/useRepository";
import { useSampleData } from "../hooks/useSampleData";

export const AddFilesPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const loadFiles = useLoadFiles();
  const isProcessing = useIsProcessing();
  const matches = useMatches();
  const clearData = useClearData();
  const { enabled: sampleDataEnabled, toggle: setSampleDataEnabled } = useSampleData();

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all match data? This cannot be undone.")) {
      clearData();
      setFiles([]);
    }
  };

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
      loadFiles(files);
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
      loadFiles(filteredFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <Page>
      <Page.Header title="Add Files" />

      <Page.Content>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2 text-base-content">
            Sample Data
          </h2>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={sampleDataEnabled}
              onChange={(e) => setSampleDataEnabled(e.target.checked)}
            />
            <div className="relative w-11 h-6 bg-base-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-base-content after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-base-100 after:border-base-content/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </Card>

        <Card className="p-4">
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
            <p className="text-sm text-error mt-2">
              Directory upload is only supported in Chrome.
            </p>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Upload Files</h2>
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
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-base-content">
            Files Added
          </h2>
          {isProcessing && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-primary">Processing files...</p>
            </div>
          )}
          <ul className="divide-y divide-base-content/10">
            {files.map((file, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <span className="text-base-content">
                  {file.name}
                </span>
                <button
                  className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:bg-error/20 hover:text-error"
                  onClick={() => handleRemoveFile(index)}
                  aria-label="delete"
                  disabled={isProcessing}
                >
                  <MdDelete size={20} />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {matches.length > 0 && (
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-base-content">
              Data Management
            </h2>
            <p className="text-sm text-base-content/40 mb-3">
              {matches.length} match{matches.length !== 1 ? "es" : ""} stored locally.
            </p>
            <button
              className="btn btn-error btn-outline rounded-lg"
              onClick={handleClearData}
              disabled={isProcessing}
            >
              Clear All Data
            </button>
          </Card>
        )}
      </Page.Content>
    </Page>
  );
};

export default AddFilesPage;
