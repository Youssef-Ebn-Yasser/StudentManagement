import React from 'react';

function NoAccess() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-red-500 text-4xl font-bold">Access Denied</h1>
            <p className="text-gray-700 text-lg mt-4">You do not have permission to view this page.</p>
        </div>
    );
}

export default NoAccess;
