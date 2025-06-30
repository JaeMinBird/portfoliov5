'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Experience component to avoid build issues
const ExperienceComponent = dynamic(() => import('./Experience'), {
  ssr: false,
  loading: () => (
    <div className="bg-white" style={{ height: '600px' }}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-400">Loading experience...</div>
      </div>
    </div>
  )
});

export default function ExperienceWrapper() {
  return <ExperienceComponent />;
} 