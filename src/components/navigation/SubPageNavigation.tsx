import { NavLink } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  end?: boolean;
}

interface SubPageNavigationProps {
  navItems: NavItem[];
}

export const SubPageNavigation: React.FC<SubPageNavigationProps & { className?: string }> = ({
  navItems,
  className = "",
}) => {
  return (
    <div className={`tabs tabs-boxed bg-base-200 p-1 ${className}`}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            `tab ${
              isActive
                ? "tab-active bg-base-300"
                : "text-base-content/70 hover:text-base-content"
            } capitalize`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};
