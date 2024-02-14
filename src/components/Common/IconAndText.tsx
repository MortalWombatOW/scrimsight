import React from 'react';

const IconAndText = ({
  icon,
  text,
  backgroundColor,
  textBorder,
}: {
  icon: React.ReactElement;
  text: string;
  backgroundColor?: string;
  textBorder?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      borderRadius: '5px',
      backgroundColor,
      padding: '0.5em',
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
