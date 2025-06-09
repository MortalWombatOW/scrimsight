import { useState } from "react";

const IconAndTextButton = ({
  variant = "contained",
  icon,
  text,
  padding,
  borderRadius,
  dynamic,
  colorKey = "primary",
  onClick,
  fontSize,
}: {
  variant?: "contained" | "outlined" | "text";
  icon: React.ReactElement;
  text: string;
  padding?: string;
  borderRadius?: string;
  dynamic?: boolean;
  colorKey?: string;
  onClick?: () => void;
  fontSize?: string;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Map Material UI variants to Tailwind classes
  const getVariantClasses = () => {
    switch (variant) {
      case "contained":
        return `bg-${colorKey || "primary"}-500 text-white hover:bg-${
          colorKey || "primary"
        }-600`;
      case "outlined":
        return `border border-${colorKey || "primary"}-500 text-${
          colorKey || "primary"
        }-500 hover:bg-${colorKey || "primary"}-50`;
      case "text":
        return `text-${colorKey || "primary"}-500 hover:bg-${
          colorKey || "primary"
        }-50`;
      default:
        return `bg-${colorKey || "primary"}-500 text-white hover:bg-${
          colorKey || "primary"
        }-600`;
    }
  };

  return (
    <div className="relative">
      <button
        className={`flex items-center whitespace-nowrap max-w-fit ${getVariantClasses()}`}
        style={{
          borderRadius: borderRadius || "5px",
          padding: padding || "0.5em",
        }}
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
        onClick={onClick}
      >
        {dynamic ? (
          icon
        ) : (
          <>
            <span className="mr-2">{icon}</span>
            <span
              className="pl-2 font-bold"
              style={{ fontSize: fontSize || "1rem" }}
            >
              {text}
            </span>
          </>
        )}
      </button>

      {dynamic && anchorEl && (
        <div
          className={`absolute z-10 mt-1 p-2 rounded shadow-md bg-${
            colorKey || "primary"
          }-500 text-white`}
          style={{
            top: anchorEl.getBoundingClientRect().bottom,
            left:
              anchorEl.getBoundingClientRect().left +
              anchorEl.getBoundingClientRect().width / 2,
            transform: "translateX(-50%)",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default IconAndTextButton;
