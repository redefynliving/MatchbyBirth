
import React, { useMemo } from 'react';
import { Users, Star, Trophy, TrendingUp } from 'lucide-react';
import { getZodiacSign, calculateBaseCompatibility } from '@/lib/zodiac.js';

function GroupCompatibilityResults({ groupData }) {
  const results = useMemo(() => {
    if (!groupData || groupData.length < 3) return null;

    const pairs = [];
    const personAverages = {};
    let totalScore = 0;

    // Initialize averages
    groupData.forEach(p => {
      personAverages[p.name] = { total: 0, count: 0 };
    });

    // Calculate all pairs
    for (let i = 0; i < groupData.length; i++) {
      for (let j = i + 1; j < groupData.length; j++) {
        const p1 = groupData[i];
        const p2 = groupData[j];
        const sign1 = getZodiacSign(p1.birthDate);
        const sign2 = getZodiacSign(p2.birthDate);
        const score = calculateBaseCompatibility(sign1, sign2);

        pairs.push({ p1: p1.name, p2: p2.name, score });
        
        personAverages[p1.name].total += score;
        personAverages[p1.name].count += 1;
        personAverages[p2.name].total += score;
        personAverages[p2.name].count += 1;
        
        totalScore += score;
      }
    }

    // Sort pairs highest to lowest
    pairs.sort((a, b) => b.score - a.score);

    // Calculate averages
    const averages = Object.entries(personAverages).map(([name, data]) => ({
      name,
      avg: Math.round(data.total / data.count)
    })).sort((a, b) => b.avg - a.avg);

    const groupVibeScore = Math.round(totalScore / pairs.length);

    return {
      pairs,
      averages,
      groupVibeScore,
      bestPair: pairs[0]
    };
  }, [groupData]);

  if (!results) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Group Vibe Hero */}
      <div className="bg-gradient-to-br from-primary to-secondary p-8 md:p-12 rounded-3xl shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Group Vibe Score</h2>
          <div className="text-7xl md:text-8xl font-extrabold text-white tracking-tighter my-4">
            {results.groupVibeScore}%
          </div>
          <p className="text-white/90 text-lg font-medium">
            {results.groupVibeScore >= 80 ? 'Incredible group dynamic! ✨' : 
             results.groupVibeScore >= 60 ? 'Solid friend group! 🌟' : 
             'A chaotic but fun mix! 🌪️'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Pair */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Most Compatible Pair</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <span className="font-medium text-foreground">{results.bestPair.p1} & {results.bestPair.p2}</span>
            <span className="text-xl font-bold text-primary">{results.bestPair.score}%</span>
          </div>
        </div>

        {/* Social Butterfly */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">The Glue (Highest Avg)</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <span className="font-medium text-foreground">{results.averages[0].name}</span>
            <span className="text-xl font-bold text-primary">{results.averages[0].avg}%</span>
          </div>
        </div>
      </div>

      {/* All Pairs Ranked */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">All Pairs Ranked</h3>
        </div>
        <div className="space-y-3">
          {results.pairs.map((pair, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground font-medium w-6">{idx + 1}.</span>
                <span className="font-medium text-foreground">{pair.p1} & {pair.p2}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${pair.score}%` }}
                  />
                </div>
                <span className="font-bold text-foreground w-10 text-right">{pair.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GroupCompatibilityResults;
