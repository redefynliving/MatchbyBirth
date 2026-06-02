import React from 'react';
import { Link } from 'react-router-dom';

export default function ReportSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-xl w-full text-center bg-card rounded-2xl p-12 shadow-lg">
        <h1 className="text-3xl font-extrabold mb-4">You're all set! ✨</h1>
        <p className="text-muted-foreground mb-6">Your compatibility report is on its way to your inbox.</p>
        <Link to="/" className="inline-block btn-primary px-6 py-3 rounded-xl font-semibold">Back to Home</Link>
      </div>
    </div>
  );
}
