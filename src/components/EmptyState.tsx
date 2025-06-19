import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  size = 'md',
  className = '',
}: EmptyStateProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-32',
          icon: 32,
          title: 'text-base font-medium',
          description: 'text-xs',
          spacing: 'space-y-2',
        };
      case 'lg':
        return {
          container: 'h-96',
          icon: 64,
          title: 'text-2xl font-semibold',
          description: 'text-base',
          spacing: 'space-y-6',
        };
      default: // md
        return {
          container: 'h-64',
          icon: 48,
          title: 'text-lg font-medium',
          description: 'text-sm',
          spacing: 'space-y-4',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex items-center justify-center ${sizeClasses.container} ${className}`}>
      <div className={`text-base-content/70 text-center ${sizeClasses.spacing}`}>
        {Icon && (
          <div className="flex justify-center mb-4">
            <Icon 
              size={sizeClasses.icon} 
              className="text-base-content/50"
            />
          </div>
        )}
        
        <div>
          <p className={`${sizeClasses.title} text-base-content mb-2`}>
            {title}
          </p>
          {description && (
            <p className={`${sizeClasses.description} text-base-content/60`}>
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;