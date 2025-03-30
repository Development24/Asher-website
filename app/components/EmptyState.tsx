import React from 'react';

const EmptyState = ({
  img = '/empty/Inbox_empty.svg',
  emptyText = 'No data available',
  widht = 120,
  height = 120,
  handleClick,
}: {
  img?: string;
  widht?: number;
  height?: number;
  emptyText?: string;
  handleClick?: () => void;
}) => {
  return (
    <div
      onClick={() => handleClick?.()}
      className={`${handleClick && 'cursor-pointer'}`}
    >
      <div className='flex flex-col items-center justify-center gap-3'>
        <img src={img} alt='empty' width={widht} height={height} />
        <p className='text-gray-500 '>{emptyText}</p>
      </div>
    </div>
  );
};

export default EmptyState;
