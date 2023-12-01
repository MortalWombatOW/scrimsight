import React from 'react';

const IconAndText = ({
  icon,
  text,
}: {
  icon: React.ReactElement;
  text: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
    }}>
    {icon}
    <span style={{marginLeft: '0.5em'}}>{text}</span>
  </div>
);

export default IconAndText;
