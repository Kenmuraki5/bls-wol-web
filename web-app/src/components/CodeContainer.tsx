import React from 'react';

const CodeContainer: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <pre>
        <code className="language-json">{code}</code>
      </pre>
    </div>
  );
};

export default CodeContainer;
