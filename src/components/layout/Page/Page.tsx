import React from "react";
import { SubPageNavigation } from "../../navigation/SubPageNavigation";

// --- Types ---

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

interface PageHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode; // For custom content like the match details
  className?: string;
}

interface PageNavigationProps {
  navItems: { path: string; label: string; end?: boolean }[];
  className?: string;
}

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

// --- Components ---

const PageRoot: React.FC<PageProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6 min-h-screen ${className}`}>
      {children}
    </div>
  );
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  children,
  className = "",
}) => {
  const hasHeaderContent = title || subtitle || icon || actions;

  return (
    <header className={`flex flex-col gap-4 ${className}`}>
      {hasHeaderContent && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div className="flex flex-col">
              {title && <h1 className="text-3xl font-bold text-base-content">{title}</h1>}
              {subtitle && <div className="text-base-content/70">{subtitle}</div>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </header>
  );
};

const PageNavigation: React.FC<PageNavigationProps> = ({ navItems, className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      <SubPageNavigation navItems={navItems} />
    </div>
  );
};

const PageContent: React.FC<PageContentProps> = ({ children, className = "" }) => {
  return (
    <main className={`flex-1 flex flex-col gap-6 ${className}`}>
      {children}
    </main>
  );
};

// --- Compound Component ---

export const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Navigation: PageNavigation,
  Content: PageContent,
});
