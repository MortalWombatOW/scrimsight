import { GoLinkExternal, GoPeople } from "react-icons/go";
import { MdOutlineFileOpen, MdOutlinePersonOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoStatsChartOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { TbTournament, TbDownload } from "react-icons/tb";
import { useState, useCallback } from "react";
import { useLoadFiles } from "../../hooks/useRepository";
import { useSampleData } from "../../hooks/useSampleData";
import { Card } from "../surface/Card";

const ZeroState = () => {
  const { enable: enableSampleData } = useSampleData();
  const loadFiles = useLoadFiles();
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
          loadFiles(filteredFiles);
        } else {
          setIsDragReject(true);
          setTimeout(() => setIsDragReject(false), 1000);
        }
      }
    },
    [loadFiles]
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
        loadFiles(filteredFiles);
      }
    },
    [loadFiles]
  );

  return (
    <div className="flex flex-col items-center py-12 px-4 gap-12 max-w-[800px] mx-auto">
      {/* Section 1: Hero */}
      <div className="flex flex-col items-center">
        <h1 className="text-6xl font-black text-base-content text-center">
          Welcome to&nbsp;
          <span
            className="text-7xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: "'Plus Jakarta Sans'" }}
          >
            SCRIMSIGHT
          </span>
        </h1>

        <p className="text-center mt-4">
          A platform for analyzing Overwatch logs from the{" "}
          <a
            href="https://workshop.codes/DKEEH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline"
          >
            ScrimTime <GoLinkExternal className="inline relative top-0.5" />
          </a>{" "}
          workshop code.
        </p>

        <div className="mt-4 flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent/80 text-xs rounded-full px-3 py-1">
          <IoShieldCheckmarkOutline size={14} />
          <span>100% local — your data never leaves your browser</span>
        </div>
      </div>

      {/* Section 2: Getting Started */}
      <div className="w-full">
        <h2 className="text-lg font-semibold text-base-content text-center mb-4">
          Getting Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: 1,
              icon: <TbDownload size={24} className="text-primary" />,
              title: "Export",
              description:
                "Run the ScrimTime workshop code in Overwatch. It exports .txt log files automatically.",
            },
            {
              step: 2,
              icon: <MdOutlineFileOpen size={24} className="text-primary" />,
              title: "Import",
              description:
                "Drag your log files here or use the file picker. We handle the rest.",
            },
            {
              step: 3,
              icon: <IoStatsChartOutline size={24} className="text-primary" />,
              title: "Analyze",
              description:
                "View scrims, player stats, team performance, and trends instantly.",
            },
          ].map(({ step, icon, title, description }) => (
            <div
              key={step}
              className="card-surface rounded-xl p-5 relative overflow-hidden"
            >
              <span className="absolute top-1 right-2 text-6xl font-black text-primary/20 select-none pointer-events-none">
                {step}
              </span>
              <div className="relative flex flex-col gap-2">
                {icon}
                <span className="font-semibold text-base-content">{title}</span>
                <span className="text-sm text-base-content/60">
                  {description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Import Area */}
      <div className="w-full">
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer
            ${isDragActive ? "border-primary" : "border-primary/30"}
            ${isDragAccept ? "border-success bg-success/10" : ""}
            ${isDragReject ? "border-error bg-error/10" : ""}
            hover:border-primary transition-colors
          `}
          onDragEnter={handleDragIn}
          onDragOver={handleDragIn}
          onDragLeave={handleDragOut}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            {isDragReject ? (
              <IoMdClose className="text-error" size={50} />
            ) : isDragAccept ? (
              <MdOutlineFileOpen className="text-success" size={50} />
            ) : (
              <MdOutlineFileOpen className="text-base-content/40" size={50} />
            )}

            <div className="flex flex-col items-center">
              <span className="text-xl">
                Drag files here or click to select
              </span>
              <span className="text-sm text-base-content/60">
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

        <div className="flex items-center justify-center gap-2 mt-6">
          <span>or</span>
          <button
            onClick={enableSampleData}
            className="btn btn-outline btn-primary"
          >
            Explore example data
          </button>
        </div>
      </div>

      {/* Section 4: Explore Your Data */}
      <div className="w-full">
        <h2 className="text-lg font-semibold text-base-content text-center mb-4">
          Explore Your Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <TbTournament size={24} className="text-primary" />,
              title: "Scrim Analysis",
              description:
                "See win/loss records, map breakdowns, and performance across series",
            },
            {
              icon: (
                <MdOutlinePersonOutline size={24} className="text-primary" />
              ),
              title: "Player Stats",
              description:
                "Track KDA, hero picks, and role performance for every player",
            },
            {
              icon: <GoPeople size={24} className="text-primary" />,
              title: "Team Comparisons",
              description:
                "Compare teams head-to-head with aggregated stats and trends",
            },
          ].map(({ icon, title, description }) => (
            <Card key={title} variant="default" className="p-5">
              <div className="flex flex-col gap-2">
                {icon}
                <span className="font-semibold text-base-content">{title}</span>
                <span className="text-sm text-base-content/60">
                  {description}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZeroState;
