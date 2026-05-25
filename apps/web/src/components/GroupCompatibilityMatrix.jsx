
import React from 'react';
import { getScoreInterpretation } from '@/lib/scoreInterpretation.js';

function GroupCompatibilityMatrix({ people, pairs, relationshipType = 'love' }) {
  // Helper to find score between two people
  const getScore = (id1, id2) => {
    if (id1 === id2) return null;
    const pair = pairs.find(
      p => (p.p1Id === id1 && p.p2Id === id2) || (p.p1Id === id2 && p.p1Id === id1)
    );
    return pair ? pair.score : null;
  };

  const getCellClass = (score) => {
    if (score === null) return 'matrix-cell-empty';
    if (score >= 70) return 'matrix-cell-high';
    if (score >= 40) return 'matrix-cell-moderate';
    return 'matrix-cell-low';
  };

  return (
    <div className="space-y-6">
      <div className="matrix-container">
        <div className="min-w-max p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-r border-border/50">
                  Matrix
                </th>
                {people.map(person => (
                  <th key={person.id} className="p-2 text-center text-sm font-semibold text-foreground border-b border-border/50 w-16 md:w-20">
                    <div className="truncate w-12 md:w-16 mx-auto" title={person.name}>
                      {person.name.substring(0, 3)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map(rowPerson => (
                <tr key={rowPerson.id}>
                  <th className="p-2 text-left text-sm font-semibold text-foreground border-r border-border/50 whitespace-nowrap">
                    {rowPerson.name}
                  </th>
                  {people.map(colPerson => {
                    const score = getScore(rowPerson.id, colPerson.id);
                    return (
                      <td key={colPerson.id} className="p-1 border-b border-border/20">
                        <div className={`mx-auto rounded-md matrix-cell ${getCellClass(score)}`}>
                          {score === null ? '-' : score}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-6 p-4 border-t border-border/50 bg-muted/20 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--success)/0.4)] border border-[hsl(var(--success))]"></div>
            <span>High (70+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--warning)/0.4)] border border-[hsl(var(--warning))]"></div>
            <span>Moderate (40-69)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--danger)/0.4)] border border-[hsl(var(--danger))]"></div>
            <span>Low (&lt;40)</span>
          </div>
        </div>
      </div>

      {/* Pair-by-Pair Interpretations List */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">Pair Interpretations</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pairs.map((pair, idx) => {
            const interpretation = getScoreInterpretation(pair.score, relationshipType);
            return (
              <div key={idx} className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-foreground">{pair.label}</span>
                  <span className="font-bold text-sm text-primary">{pair.score}%</span>
                </div>
                <div className="score-container">
                  <span className="score-label text-xs text-foreground/90">{interpretation.label}</span>
                  <span className="score-explanation text-[11px] leading-tight mt-0.5">{interpretation.explanation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GroupCompatibilityMatrix;
