
import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, AlertCircle, MessageCircle, Heart, Clock, Star } from 'lucide-react';
import { getScoreInterpretation } from '@/lib/scoreInterpretation.js';

function CompatibilityReadingCard({ 
  person1Name, person1Sign, person1Element, 
  person2Name, person2Sign, person2Element, 
  compatibilityScore, relationshipType 
}) {

  const interpretation = getScoreInterpretation(compatibilityScore, relationshipType);

  const reading = useMemo(() => {
    const isLove = relationshipType === 'love';
    const isFriendship = relationshipType === 'friendship';
    // 'work' or other acts as the 'in-between' balanced tone
    const isNeutral = !isLove && !isFriendship;

    const elementsMatch = person1Element === person2Element;
    const isFire = (el) => el === 'fire';
    const isEarth = (el) => el === 'earth';
    const isAir = (el) => el === 'air';
    const isWater = (el) => el === 'water';

    const hasElement = (e1, e2, target) => e1 === target || e2 === target;
    const e1 = person1Element.toLowerCase();
    const e2 = person2Element.toLowerCase();

    // 1. Overall Dynamic
    let overall = '';
    if (elementsMatch) {
      overall = `${person1Name} and ${person2Name} share the same ${e1} element, creating an immediate sense of familiarity and mutual understanding. You intuitively grasp each other's core motivations and pace. `;
      overall += isLove ? 'This creates a natural, effortless chemistry where you feel deeply seen.' 
               : isFriendship ? 'This makes for a highly supportive and easygoing camaraderie.'
               : 'This translates into a highly aligned connection with minimal friction.';
    } else if (
      (hasElement(e1, e2, 'fire') && hasElement(e1, e2, 'air')) || 
      (hasElement(e1, e2, 'earth') && hasElement(e1, e2, 'water'))
    ) {
      overall = `The combination of ${e1} and ${e2} is highly complementary. ${person1Name} and ${person2Name} stimulate and support each other naturally, bringing different but compatible energies to the table. `;
      overall += isLove ? 'Your romance thrives on this beautiful balance of inspiration and flow.'
               : isFriendship ? 'Your friendship is vibrant, dynamic, and full of mutual encouragement.'
               : 'Your bond is grounded in a productive and balanced exchange of ideas.';
    } else {
      overall = `Bringing together ${e1} and ${e2} creates a dynamic of contrast. ${person1Name} and ${person2Name} operate on fundamentally different wavelengths, which can lead to profound growth. `;
      overall += isLove ? 'While passion can flare brightly, it requires conscious effort to maintain harmony.'
               : isFriendship ? 'You push each other outside your comfort zones, keeping the bond interesting.'
               : 'You offer entirely different perspectives, making you a well-rounded pair when you align.';
    }

    // 2. Strengths
    let strengths = '';
    if (compatibilityScore >= 75) {
      strengths = `Your naturally high compatibility means you easily find common ground. `;
    } else {
      strengths = `Your distinct astrological differences are actually your greatest asset. `;
    }
    strengths += isLove 
      ? `You bring out a tender, protective quality in one another. Whether it's planning future adventures or simply sharing quiet moments, your unique energies blend to create a resilient partnership.`
      : isFriendship 
      ? `You act as excellent sounding boards for each other. Your loyalty runs deep, and you know exactly how to lift the other's spirits when things get tough.`
      : `You possess a unique synergy. When you focus on a shared goal, your combined traits cover almost all blind spots, making you highly effective together.`;

    // 3. Challenges
    let challenges = '';
    if (e1 === 'fire' || e2 === 'fire') {
      challenges = `Impatience or a quick temper can occasionally spark unnecessary friction. `;
    } else if (e1 === 'water' || e2 === 'water') {
      challenges = `Emotional sensitivity may lead to unexpressed hurt feelings if you aren't careful. `;
    } else {
      challenges = `Stubbornness or over-thinking can sometimes stall your forward momentum. `;
    }
    challenges += `Because ${person1Name} (${person1Sign}) and ${person2Name} (${person2Sign}) approach problem-solving differently, misunderstandings can occur if expectations aren't communicated clearly. Remember that your differences are not personal attacks.`;

    // 4. Communication Style
    let communication = '';
    if (hasElement(e1, e2, 'air')) {
      communication = `Communication is a major focal point for this pairing. Ideas flow freely, and you likely spend hours discussing everything from daily details to grand concepts. `;
    } else if (hasElement(e1, e2, 'earth')) {
      communication = `You prefer practical, straightforward discussions over abstract hypotheticals. Your conversations are grounded and highly pragmatic. `;
    } else {
      communication = `Your communication relies heavily on non-verbal cues and intuitive sensing of each other's moods. You often know what the other is thinking without saying a word. `;
    }
    communication += isLove ? `To keep the romance thriving, ensure you also share your vulnerable feelings, not just your thoughts.` 
                   : `To keep the bond strong, practice active listening and validate each other's perspectives.`;

    // 5. Emotional Compatibility
    let emotional = '';
    if (compatibilityScore >= 65) {
      emotional = `You have a strong capacity to hold space for each other's feelings. `;
    } else {
      emotional = `Your emotional needs are quite different, requiring compromise. `;
    }
    emotional += isLove 
      ? `One of you may crave more independence while the other seeks deep enmeshment. Finding a rhythm between closeness and personal space will unlock profound devotion.`
      : isFriendship 
      ? `You might process stress differently—one needing to vent while the other needs isolation. Respecting these boundaries ensures a lasting, supportive friendship.`
      : `Understanding how the other handles pressure is key. Give each other the grace to process emotions in your own respective ways to maintain harmony.`;

    // 6. Long-Term Potential
    let longTerm = '';
    if (compatibilityScore >= 80) {
      longTerm = `The astrological indicators point to excellent longevity. You have the right mix of shared values and complementing traits to weather life's storms. `;
    } else if (compatibilityScore >= 50) {
      longTerm = `This relationship has solid potential if both individuals are willing to put in the work. It will require deliberate effort to bridge your elemental differences. `;
    } else {
      longTerm = `This is a karmic, intense pairing meant to teach you both significant life lessons. While long-term stability will be challenging, the growth you achieve together is invaluable. `;
    }
    longTerm += isLove ? `True lasting love here is built on mutual respect and shared adventures.` 
              : `A lifelong connection is highly possible if you adapt to each other's changing seasons.`;

    // 7. Final Takeaway
    const takeaway = isLove 
      ? `Embrace your unique dynamic. Let ${person1Name}'s ${person1Sign} nature balance ${person2Name}'s ${person2Sign} energy, and this romance can be a beautifully transformative journey.`
      : isFriendship
      ? `Celebrate the fun and support you bring each other. As long as you respect your differences, this friendship will remain a steady anchor for years to come.`
      : `Keep your shared goals in sight. By leveraging your contrasting strengths, your connection will remain a powerful force for mutual success and understanding.`;

    return { overall, strengths, challenges, communication, emotional, longTerm, takeaway };
  }, [person1Name, person1Sign, person1Element, person2Name, person2Sign, person2Element, compatibilityScore, relationshipType]);

  return (
    <div className="bg-[hsl(var(--reading-card-bg))] rounded-xl border border-border mt-6 text-left shadow-sm">
      
      {/* Score Interpretation Header */}
      <div className="p-5 md:p-8 pb-0">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0 bg-background rounded-full w-16 h-16 flex items-center justify-center border border-border shadow-sm">
            <span className="text-xl font-bold text-primary">{compatibilityScore}%</span>
          </div>
          <div className="score-container">
            <span className="score-label text-foreground">{interpretation.label}</span>
            <span className="score-explanation">{interpretation.explanation}</span>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-8 space-y-2">
        
        {/* Overall Dynamic */}
        <section className="reading-section pt-0">
          <h4 className="reading-heading text-primary">
            <Sparkles className="w-4 h-4" />
            Overall Dynamic
          </h4>
          <p className="reading-body">{reading.overall}</p>
        </section>

        {/* Strengths */}
        <section className="reading-section">
          <h4 className="reading-heading text-success-foreground">
            <TrendingUp className="w-4 h-4" />
            Strengths
          </h4>
          <p className="reading-body">{reading.strengths}</p>
        </section>

        {/* Challenges */}
        <section className="reading-section">
          <h4 className="reading-heading text-warning-foreground">
            <AlertCircle className="w-4 h-4" />
            Growth Opportunities
          </h4>
          <p className="reading-body">{reading.challenges}</p>
        </section>

        {/* Communication Style */}
        <section className="reading-section">
          <h4 className="reading-heading text-secondary-foreground">
            <MessageCircle className="w-4 h-4" />
            Communication Style
          </h4>
          <p className="reading-body">{reading.communication}</p>
        </section>

        {/* Emotional Compatibility */}
        <section className="reading-section">
          <h4 className="reading-heading text-accent">
            <Heart className="w-4 h-4" />
            Emotional Needs
          </h4>
          <p className="reading-body">{reading.emotional}</p>
        </section>

        {/* Long-Term Potential */}
        <section className="reading-section">
          <h4 className="reading-heading text-foreground">
            <Clock className="w-4 h-4" />
            Long-Term Outlook
          </h4>
          <p className="reading-body">{reading.longTerm}</p>
        </section>

        {/* Final Takeaway */}
        <section className="reading-section pb-2 border-none">
          <div className="bg-primary/5 rounded-lg p-5 border border-primary/10 mt-2">
            <h4 className="reading-heading text-primary mb-2">
              <Star className="w-4 h-4" />
              Final Takeaway
            </h4>
            <p className="reading-body font-medium text-foreground/80">{reading.takeaway}</p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default CompatibilityReadingCard;
