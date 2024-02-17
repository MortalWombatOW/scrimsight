import React from 'react';

const IconAndText = ({
  icon,
  text,
  backgroundColor,
  textBorder,
  padding,
  borderRadius,
}: {
  icon: React.ReactElement;
  text: string;
  backgroundColor?: string;
  textBorder?: boolean;
  padding?: string;
  borderRadius?: string;
}) => (
  <div
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
        marginLeft: '0.5em',
        textShadow: textBorder ? '0 0 5px black' : 'none',
      }}>
      {text}
    </span>
  </div>
);

export default IconAndText;
