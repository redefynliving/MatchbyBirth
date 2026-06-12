
import React from 'react';
import { UserRound, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils';

function GroupModeToggle({ mode, setMode }) {
  return (
    <div className="flex shrink-0 rounded-xl bg-muted p-1">
      <button
        type="button"
        onClick={() => setMode('pair')}
        className={cn(
          'flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200',
          mode === 'pair' 
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
        )}
        aria-pressed={mode === 'pair'}
      >
        <UserRound className="h-3.5 w-3.5" />
        Pair
      </button>
      <button
        type="button"
        onClick={() => setMode('group')}
        className={cn(
          'flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200',
          mode === 'group' 
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
        )}
        aria-pressed={mode === 'group'}
      >
        <UsersRound className="h-3.5 w-3.5" />
        Group
      </button>
    </div>
  );
}

export default GroupModeToggle;
