import { GoLinkExternal } from "react-icons/go";
import { useAtom } from "jotai";
import { sampleDataEnabledAtom } from "@atoms/files/sampleDataAtoms";
import { MdOutlineFileOpen } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { logFileInputMutationAtom } from "@atoms/files";
import { useState, useCallback } from "react";

const ZeroState = () => {
  const [_, setSampleDataEnabled] = useAtom(sampleDataEnabledAtom);
  const [__, setFiles] = useAtom(logFileInputMutationAtom);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragAccept, setIsDragAccept] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        const filteredFiles = files.filter(
          (file) =>
            (file.type && file.type.startsWith("text")) ||
            file.name.endsWith(".txt")
        );

        if (filteredFiles.length > 0) {
          setFiles(filteredFiles);
        } else {
          setIsDragReject(true);
          setTimeout(() => setIsDragReject(false), 1000);
        }
      }
    },
    [setFiles]
  );

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const hasAcceptedFiles = Array.from(e.dataTransfer.items).some(
        (item) =>
          item.kind === "file" &&
          ((item.type && item.type.startsWith("text")) ||
            item.getAsFile()?.name.endsWith(".txt") ||
            false)
      );

      setIsDragAccept(hasAcceptedFiles);
      setIsDragReject(!hasAcceptedFiles);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragAccept(false);
    setIsDragReject(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        const filteredFiles = files.filter(
          (file) =>
            (file.type && file.type.startsWith("text")) ||
            file.name.endsWith(".txt")
        );
        setFiles(filteredFiles);
      }
    },
    [setFiles]
  );

  return (
    <div className="flex items-center justify-center h-[calc(100vh-68px-32px)]">
      <div className="w-[600px] flex flex-col items-center">
        <h1 className="text-6xl font-black text-white text-center">
          Welcome to&nbsp;
          <span className="text-7xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent font-goldman">
            SCRIMSIGHT
          </span>
        </h1>

        <p className="text-center mt-4">
          A platform for analyzing Overwatch logs from the{" "}
          <a
            href="https://workshop.codes/DKEEH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            ScrimTime <GoLinkExternal className="inline relative top-0.5" />
          </a>{" "}
          workshop code.
        </p>

        <div className="mt-8 w-full">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 cursor-pointer
              ${
                isDragActive
                  ? "border-blue-400"
                  : "border-gray-700 dark:border-gray-700"
              } 
              ${
                isDragAccept
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : ""
              } 
              ${
                isDragReject
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : ""
              }
              hover:border-blue-400 transition-colors
            `}
            onDragEnter={handleDragIn}
            onDragOver={handleDragIn}
            onDragLeave={handleDragOut}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <div className="flex flex-col items-center gap-4 pointer-events-none">
              {isDragReject ? (
                <IoMdClose className="text-red-500" size={50} />
              ) : isDragAccept ? (
                <MdOutlineFileOpen className="text-green-500" size={50} />
              ) : (
                <MdOutlineFileOpen className="text-base-400" size={50} />
              )}

              <div className="flex flex-col items-center">
                <span className="text-xl">
                  Drag files here or click to select
                </span>
                <span className="text-sm text-base-500 dark:text-base-400">
                  Upload your ScrimTime log files to get started
                </span>
              </div>
            </div>
            <input
              id="file-input"
              type="file"
              accept="text/*,.txt"
              className="hidden"
              multiple
              onChange={handleFileSelect}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <span>or</span>
          <button
            onClick={() => setSampleDataEnabled(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Explore example data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZeroState;
