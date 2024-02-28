import React from 'react';

const IconAndText = ({
  icon,
  text,
  backgroundColor,
  textBorder,
  padding,
  borderRadius,
  dynamic,
}: {
  icon: React.ReactElement;
  text: string;
  backgroundColor?: string;
  textBorder?: boolean;
  padding?: string;
  borderRadius?: string;
  dynamic?: boolean;
}) => {
  const [hovered, setHovered] = React.useState(false);

  const hovered_ = hovered && dynamic;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        borderRadius: borderRadius || '5px',
        ...(backgroundColor ? {backgroundColor} : {}),
        padding: padding || '0.5em',
        // dont be wider than the text
        maxWidth: 'fit-content',
      }}>
      {icon}
      <span
        style={{
          marginLeft: dynamic ? (hovered_ ? '0.5em' : '0') : '0.5em',
          marginRight: hovered_ ? '0.5em' : '0',
          textShadow: textBorder ? '0 0 5px black' : 'none',
          ...(dynamic
            ? {
                transition: '0.2s',
                width: hovered_ ? 'auto' : '0',
                overflow: 'hidden',
                textOverflow: 'clip',
              }
            : {}),
        }}>
        {text}
      </span>
    </div>
  );
};

export default IconAndText;
