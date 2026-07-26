import React from 'react';

const Badge = ({ children, tone = 'primary' }) => {
  const colors = {
    primary: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    success: { backgroundColor: '#dcfce7', color: '#166534' },
    warning: { backgroundColor: '#fef3c7', color: '#92400e' },
  };

  return <span style={{ ...colors[tone], padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>{children}</span>;
};

export default Badge;
