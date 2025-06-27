import { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'bordered';
}

interface PageSectionTitleProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}

interface PageSectionDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface PageSectionContentProps {
  children: ReactNode;
  layout?: 'grid' | 'flex' | 'stack';
  className?: string;
}

const PageSection = ({ 
  children, 
  className = "", 
  variant = 'default' 
}: PageSectionProps) => {
  const variantClasses = {
    default: 'space-y-4',
    card: 'bg-base-100 rounded-lg p-6 space-y-4 shadow-lg',
    bordered: 'border border-base-300 rounded-lg p-6 space-y-4'
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

const PageSectionTitle = ({ 
  children, 
  as: Component = 'h2', 
  className = "" 
}: PageSectionTitleProps) => {
  return (
    <Component className={`text-2xl font-bold text-base-content flex items-center gap-3 ${className}`}>
      {children}
    </Component>
  );
};

const PageSectionDescription = ({ 
  children, 
  className = "" 
}: PageSectionDescriptionProps) => {
  return (
    <p className={`text-sm text-base-content/70 ${className}`}>
      {children}
    </p>
  );
};

const PageSectionContent = ({ 
  children, 
  layout = 'flex', 
  className = "" 
}: PageSectionContentProps) => {
  const layoutClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    flex: 'flex flex-wrap gap-4',
    stack: 'space-y-4'
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {children}
    </div>
  );
};

PageSection.Title = PageSectionTitle;
PageSection.Description = PageSectionDescription;
PageSection.Content = PageSectionContent;

export default PageSection;