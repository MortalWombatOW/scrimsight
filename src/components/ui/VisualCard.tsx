import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface VisualCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  backgroundImage?: string;
  className?: string;
  linkUrl?: string;
}

export const VisualCard = ({
  title,
  icon,
  children,
  footer,
  backgroundImage,
  className = "",
  linkUrl,
}: VisualCardProps) => {
  const CardContent = () => (
    <div
      className={`card-surface rounded-xl overflow-hidden relative flex flex-col h-full ${className}`}
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

      <div className="relative z-10 p-5 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="text-lg font-bold text-base-content tracking-wide">
            {title}
          </h3>
        </div>

        <div className="flex-grow">{children}</div>

        {footer && <div className="mt-4 pt-4 border-t border-base-content/10">{footer}</div>}
      </div>
    </div>
  );

  if (linkUrl) {
    return (
      <Link to={linkUrl} className="block h-full transition-transform hover:-translate-y-1">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};
