import React from 'react';
import { Zap, LockKeyhole, Users, Share2, FileHeart } from 'lucide-react';

const proofItems = [
  {
    Icon: Zap,
    label: 'Results in seconds',
  },
  {
    Icon: LockKeyhole,
    label: 'Birth dates not stored',
  },
  {
    Icon: Users,
    label: 'Pair or group readings',
  },
  {
    Icon: Share2,
    label: 'Shareable results',
  },
  {
    Icon: FileHeart,
    label: 'Optional full report',
  },
];

const HomeProofBand = () => {
  return (
    <div className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs font-medium text-muted-foreground">
      {proofItems.map(({ Icon, label }, index) => (
        <span key={index} className="inline-flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {label}
        </span>
      ))}
    </div>
  );
};

export default HomeProofBand;
