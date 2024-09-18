import React from 'react';

const Table: React.FC = () => {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Parameter</th>
            <th className="p-3 text-left">Value</th>
            <th className="p-3 text-left">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">Method</td>
            <td className="p-3">
              <div className="inline-block bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">GET</div>
            </td>
            <td className="p-3"></td>
          </tr>
          <tr>
            <td className="p-3">Success</td>
            <td className="p-3">Returns a value based on whether the magic packet was sent</td>
            <td className="p-3">Boolean</td>
          </tr>
          <tr>
            <td className="p-3">Message</td>
            <td className="p-3">Returns a description of any action taken</td>
            <td className="p-3">String</td>
          </tr>
          <tr>
            <td className="p-3">Error</td>
            <td className="p-3">Returns errors as a JSON, converted from any raised GOLANG Error Objects</td>
            <td className="p-3">JSONObject</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
