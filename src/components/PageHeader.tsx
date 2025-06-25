import { ReactNode } from "react";

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
}

interface PageHeaderIconProps {
  children: ReactNode;
  className?: string;
}

interface PageHeaderTitleProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

const PageHeader = ({ children, className = "" }: PageHeaderProps) => {
  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      {children}
    </div>
  );
};

const PageHeaderIcon = ({ children, className = "" }: PageHeaderIconProps) => {
  return (
    <div className={`text-primary ${className}`}>
      {children}
    </div>
  );
};

const PageHeaderTitle = ({ 
  children, 
  as: Component = 'h1', 
  className = "" 
}: PageHeaderTitleProps) => {
  return (
    <Component className={`text-3xl font-bold text-base-content ${className}`}>
      {children}
    </Component>
  );
};

PageHeader.Icon = PageHeaderIcon;
PageHeader.Title = PageHeaderTitle;

export default PageHeader;