import { IoShieldCheckmarkOutline } from "react-icons/io5";

export const PrivacyFooter = () => {
  return (
    <footer className="bg-base-200/80 border-t border-base-content/5 py-2 px-4 flex-shrink-0 flex items-center justify-center gap-2">
      <IoShieldCheckmarkOutline className="text-base-content/40" size={14} />
      <span className="text-xs text-base-content/40">
        Your data stays on your device
      </span>
    </footer>
  );
};
