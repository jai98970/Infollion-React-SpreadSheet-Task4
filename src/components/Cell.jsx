
import React, { useState, useEffect, useRef } from 'react';

const Cell = ({ id, data, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(data.raw);
  const inputRef = useRef(null);

  useEffect(() => {
    setTempValue(data.raw);
  }, [data.raw]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (tempValue !== data.raw) {
      onChange(id, tempValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const displayValue = data.error ? data.error : data.value;
  const isError = !!data.error;

  return (
    <div 
      className={`cell ${editing ? 'editing' : ''} ${isError ? 'error' : ''}`}
      onClick={() => !editing && setEditing(true)}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span>{displayValue}</span>
      )}
    </div>
  );
};

export default Cell;
