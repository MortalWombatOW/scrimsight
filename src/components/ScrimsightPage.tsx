import { ReactNode } from "react";

interface ScrimsightPageProps {
  children: ReactNode;
  sider?: ReactNode;
  className?: string;
}

const ScrimsightPage = ({
  children,
  sider,
  className = "",
}: ScrimsightPageProps) => {
  return (
    <div className={`flex gap-6 ${className}`}>
      <div className="flex-1 space-y-6">{children}</div>
      <div className="w-0 xl:w-80 flex-shrink-0">{sider}</div>
    </div>
  );
};

export default ScrimsightPage;
