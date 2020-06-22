import React, { FC } from 'react';

type GridRowDescriptionProps = {
  content: string;
};

export const GridRowDescription: FC<GridRowDescriptionProps> = ({ content }) => {
  return (
    <div
      style={{ fontSize: 14, lineHeight: '20px', color: '#9fa3ac', marginTop: -8, marginBottom: 20 }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
