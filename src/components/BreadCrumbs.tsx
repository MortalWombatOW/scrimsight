import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface BreadCrumbItem {
  label: string;
  path?: string;
  icon?: ReactNode;
}

interface BreadCrumbsProps {
  items: BreadCrumbItem[];
  className?: string;
}

const BreadCrumbs = ({ items, className = '' }: BreadCrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs ${className}`}>
      <ul>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index}>
              {item.path && !isLast ? (
                <Link 
                  to={item.path} 
                  className="link link-hover flex items-center gap-1"
                >
                  {item.icon && <span className="text-sm">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-base-content/70">
                  {item.icon && <span className="text-sm">{item.icon}</span>}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BreadCrumbs;