const SplashRow = ({
  title,
  content,
  image,
  beforeBackgroundColor,
  backgroundColor,
  className,
  textColor,
  button,
}: {
  title: string;
  content: string;
  image: string;
  beforeBackgroundColor?: string;
  backgroundColor?: string;
  className?: string;
  textColor: string;
  button?: {
    text: string;
    onClick: () => void;
  };
}) => {
  return (
    <div
      style={{
        backgroundColor: beforeBackgroundColor,
      }}
      className="flex w-full"
    >
      <div
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        className={`flex w-full p-12 ${className || ""}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <h2 className="text-3xl font-bold mb-8">{title}</h2>
            <p className="text-base">{content}</p>
            {button && (
              <button
                onClick={button.onClick}
                className="mt-8 px-6 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors"
              >
                {button.text}
              </button>
            )}
          </div>
          <div className="md:col-span-4">
            <img src={image} alt={title} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashRow;
