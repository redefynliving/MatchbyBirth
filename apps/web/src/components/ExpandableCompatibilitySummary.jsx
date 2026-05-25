
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CompatibilityReadingCard from './CompatibilityReadingCard.jsx';
import { getScoreInterpretation } from '@/lib/scoreInterpretation.js';

function ExpandableCompatibilitySummary({ 
  person1Name, person1Sign, person1Element, 
  person2Name, person2Sign, person2Element, 
  compatibilityScore, relationshipType, shortSummary 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const interpretation = getScoreInterpretation(compatibilityScore, relationshipType);

  return (
    <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm flex flex-col w-full h-full transition-shadow hover:shadow-md">
      {/* Header / Short Summary (Always Visible) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
            {person1Name} & {person2Name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="bg-muted px-2 py-0.5 rounded-md">{person1Sign} ({person1Element})</span>
            <span>+</span>
            <span className="bg-muted px-2 py-0.5 rounded-md">{person2Sign} ({person2Element})</span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
          <span className={`text-2xl font-bold tabular-nums ${
            compatibilityScore >= 70 ? 'text-success-foreground' : 
            compatibilityScore >= 40 ? 'text-warning-foreground' : 'text-danger-foreground'
          }`}>
            {compatibilityScore}%
          </span>
          <span className="text-[10px] uppercase font-bold text-primary/70 tracking-widest">Match</span>
        </div>
      </div>
      
      <div className="score-container mb-3 bg-muted/30 p-3 rounded-lg border border-border/50">
        <span className="score-label text-sm text-foreground">{interpretation.label}</span>
        <span className="score-explanation text-xs">{interpretation.explanation}</span>
      </div>

      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
        {shortSummary}
      </p>

      {/* Expand/Collapse Action Button */}
      <button 
        onClick={toggleExpand}
        className="mt-auto w-full py-2.5 px-4 bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <>
            Show Less <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            Read Deep Dive <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Expanded Detailed Reading */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <CompatibilityReadingCard 
              person1Name={person1Name}
              person1Sign={person1Sign}
              person1Element={person1Element}
              person2Name={person2Name}
              person2Sign={person2Sign}
              person2Element={person2Element}
              compatibilityScore={compatibilityScore}
              relationshipType={relationshipType}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExpandableCompatibilitySummary;
