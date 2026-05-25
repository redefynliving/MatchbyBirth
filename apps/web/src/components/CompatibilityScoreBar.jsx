
import React from 'react';
import { Star, AlertTriangle } from 'lucide-react';
import { getScoreInterpretation } from '@/lib/scoreInterpretation.js';

function CompatibilityScoreBar({ label, score, description, groupResults, relationshipType = 'love' }) {
  // If groupResults prop is provided, render the multi-person group breakdown
  if (groupResults) {
    const { overallScore, pairs, strongest, weakest } = groupResults;
    const groupInterpretation = getScoreInterpretation(overallScore, relationshipType);

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">Group Compatibility Dynamics</h2>
            <p className="text-base text-muted-foreground mb-4">
              Analyzing {pairs.length} unique connections within the group.
            </p>
            <div className="score-container">
              <span className="score-label text-foreground">{groupInterpretation.label}</span>
              <span className="score-explanation">{groupInterpretation.explanation}</span>
            </div>
          </div>
          <div className="text-left md:text-right bg-primary/10 px-6 py-4 rounded-xl border border-primary/20 min-w-[140px]">
            <div className="text-4xl font-bold text-primary mb-1">{overallScore}%</div>
            <div className="text-xs text-primary/80 uppercase tracking-wider font-semibold">Group Average</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
          <div className="bg-muted/40 p-5 rounded-xl border border-border/60 flex items-start gap-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-1">Strongest Match</span>
              <span className="font-medium text-foreground text-lg block">{strongest.label}</span>
              <span className="text-sm text-primary font-semibold">{strongest.score}% Match</span>
            </div>
          </div>
          <div className="bg-muted/40 p-5 rounded-xl border border-border/60 flex items-start gap-4">
            <div className="bg-secondary/20 p-2 rounded-lg text-secondary-foreground">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-1">Needs Attention</span>
              <span className="font-medium text-foreground text-lg block">{weakest.label}</span>
              <span className="text-sm text-muted-foreground font-semibold">{weakest.score}% Match</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Pair-by-Pair Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pairs.map((pair, idx) => {
              const pairInterpretation = getScoreInterpretation(pair.score, relationshipType);
              return (
                <div key={idx} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-foreground">{pair.label}</span>
                    <span className="text-base font-semibold text-primary">{pair.score}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${pair.score}%` }}
                    />
                  </div>
                  <div className="score-container mt-2">
                    <span className="score-label text-sm text-foreground">{pairInterpretation.label}</span>
                    <span className="score-explanation text-xs">{pairInterpretation.explanation}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
                    {pair.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Standard 2-person score bar rendering (used for sub-scores like Emotional, Communication)
  const interpretation = getScoreInterpretation(score, relationshipType);
  
  return (
    <div className="space-y-2 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-primary">{score}%</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="score-container pt-1">
        <span className="score-label text-sm text-foreground/90">{interpretation.label}</span>
        <span className="score-explanation text-xs">{interpretation.explanation}</span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{description}</p>
      )}
    </div>
  );
}

export default CompatibilityScoreBar;
