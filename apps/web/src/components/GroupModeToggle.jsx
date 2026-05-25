
import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

function GroupModeToggle({ mode, setMode }) {
  return (
    <div className="flex p-1 bg-muted rounded-2xl mb-8 max-w-md mx-auto">
      <button
        type="button"
        onClick={() => setMode('pair')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200",
          mode === 'pair' 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Users className="w-4 h-4" />
        Just Us (2)
      </button>
      <button
        type="button"
        onClick={() => setMode('group')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200",
          mode === 'group' 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <UserPlus className="w-4 h-4" />
        Friend Group (3-7)
      </button>
    </div>
  );
}

export default GroupModeToggle;
