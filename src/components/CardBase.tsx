import { ReactNode } from "react";
import { Link } from "react-router-dom";

const CardBaseHeader = ({
  title,
  icon,
}: {
  title: string;
  icon?: ReactNode;
}) => (
  <div className="flex justify-between items-center gap-3">
    {icon}
    <span className="text-xl font-bold">{title}</span>
  </div>
);

export const CardBaseFact = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-base-content/70">{label}</span>
    <span className="text-sm">{value}</span>
  </div>
);

const CardBaseInfo = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <div className="flex flex-col gap-2">{children}</div>
);

const CardBasePrimaryStat = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <div className="flex flex-col gap-1 text-center">
    <span className="text-3xl font-bold">{value}</span>
    <span className="text-sm text-base-content/70">{label}</span>
  </div>
);

const CardBaseSecondaryStat = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <div className="flex flex-row gap-2 items-center">
    <span className="text-sm font-bold">{value}</span>
    <span className="text-sm text-base-content/70">{label}</span>
  </div>
);

const CardBaseContent = ({
  title,
  icon,
  primaryStats,
  secondaryStats,
  info,
  linkText,
  linkUrl,
}: {
  title: string;
  icon?: ReactNode;
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  info: ReactNode | ReactNode[];
  linkText?: string;
  linkUrl?: string;
}) => (
  // Apply theme background, border, shadow, rounded corners
  <div className="bg-base-200 border border-gray-700 border-gray-700 shadow-md rounded-lg w-fit">
    {/* Keep card-body for padding/structure */}
    <div className="card-body flex flex-row p-6">
      {/* Info Section */}
      <div className="flex flex-col gap-6">
        <CardBaseHeader title={title} icon={icon} />
        <CardBaseInfo>{info}</CardBaseInfo>
      </div>
      <div className="divider divider-horizontal h-24"></div>
      {/* Stats Section */}
      <div className="flex flex-col justify-between justify-center">
        <div className="flex flex-row gap-6 justify-around">
          {primaryStats.map((stat) => (
            <CardBasePrimaryStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
        {secondaryStats && secondaryStats.length > 0 && (
          <div className="flex flex-wrap flex-col md:flex-row gap-x-6 gap-y-2 mt-3 items-center">
            {secondaryStats.map((stat) =>
              // Conditionally render Role as a badge
              stat.label === "Role" ? (
                <div key={stat.label} className="flex items-center gap-2">
                  {" "}
                  {/* Wrapper for alignment */}
                  <span className="badge badge-outline badge-primary rounded-full px-3 text-xs">
                    {stat.value}
                  </span>
                  {/* Optionally keep the label, or remove if badge is self-explanatory */}
                  {/* <span className="text-sm text-base-content/70">{stat.label}</span> */}
                </div>
              ) : (
                <CardBaseSecondaryStat
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                />
              )
            )}
          </div>
        )}
      </div>
      {/* Optional Link Section */}
      {linkUrl && linkText && (
        <>
          <div className="divider divider-horizontal h-24"></div>
          <div className="flex items-center justify-center">
            <Link to={linkUrl} className="link link-primary">
              {linkText}
            </Link>
          </div>
        </>
      )}
    </div>
  </div>
);

export const CardBase = ({
  linkText,
  linkUrl,
  ...props
}: {
  linkText?: string;
  linkUrl?: string;
} & Omit<
  React.ComponentProps<typeof CardBaseContent>,
  "linkText" | "linkUrl"
>) => {
  return <CardBaseContent {...props} linkText={linkText} linkUrl={linkUrl} />;
};
