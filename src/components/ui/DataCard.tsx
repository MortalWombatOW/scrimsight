import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import { Card } from "@components";

export interface DataCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  backgroundImage?: string;
  linkUrl?: string;
  linkText?: string;
  className?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export const DataCard = ({
  title,
  subtitle,
  icon,
  backgroundImage,
  linkUrl,
  linkText = "View Details",
  className = "",
  children,
  footer,
}: DataCardProps) => {
  const CardContent = () => (
    <Card
      variant="default"
      noPadding
      className={`rounded-xl overflow-hidden relative flex flex-col h-full ${className}`}
    >
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-300/90" />
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary">{icon}</div>}
            <div>
              <h3 className="text-lg font-bold text-base-content leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-base-content/60 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow">{children}</div>

        {(footer || linkUrl) && (
          <div className="mt-4 pt-4 border-t border-base-content/10 flex items-center justify-between">
            {footer}
            {linkUrl && (
              <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:text-primary-focus transition-colors ml-auto">
                {linkText} <GoArrowRight />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  if (linkUrl) {
    return (
      <Link to={linkUrl} className="block h-full group transition-transform hover:-translate-y-1 duration-300">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};
