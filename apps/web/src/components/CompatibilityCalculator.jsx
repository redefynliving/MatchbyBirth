import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trackEvent } from '@/lib/analytics.js';
import GroupInputForm from './GroupInputForm.jsx';
import GroupModeToggle from './GroupModeToggle.jsx';

const createPerson = (id) => ({ id, name: '', birthDate: '' });

function CompatibilityCalculator() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('pair');
  const [pairPeople, setPairPeople] = useState([
    createPerson('pair-1'),
    createPerson('pair-2'),
  ]);
  const [groupPeople, setGroupPeople] = useState([
    createPerson('group-1'),
    createPerson('group-2'),
    createPerson('group-3'),
  ]);
  const [relationshipType, setRelationshipType] = useState('love');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const updatePairPerson = (id, field, value) => {
    setPairPeople((people) => people.map(
      (person) => person.id === id ? { ...person, [field]: value } : person,
    ));
  };

  const submitCalculation = async (payload) => {
    setError('');
    setIsCalculating(true);
    trackEvent('calculation_started', {
      mode: payload.mode,
      relationship_type: payload.relationshipType,
      group_size: payload.people.length,
    });

    try {
      const response = await fetch('/api/calculate-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to calculate this result.');
      }

      trackEvent('calculation_completed', {
        mode: data.result.mode,
        relationship_type: data.result.relationshipType,
        group_size: data.result.people.length,
        score_band: Math.floor(
          (data.result.mode === 'group' ? data.result.groupScore : data.result.score) / 10,
        ) * 10,
      });
      navigate(`/result?share=${encodeURIComponent(data.shareSlug)}`, {
        state: {
          resultId: data.resultId,
          shareSlug: data.shareSlug,
          result: data.result,
        },
      });
    } catch (calculationError) {
      setError(calculationError.message || 'Unable to calculate this result.');
      trackEvent('calculation_failed', { mode: payload.mode });
    } finally {
      setIsCalculating(false);
    }
  };

  const calculatePairCompatibility = (event) => {
    event.preventDefault();
    submitCalculation({
      mode: 'pair',
      relationshipType,
      people: pairPeople,
    });
  };

  const calculateGroupCompatibility = (event) => {
    event.preventDefault();
    submitCalculation({
      mode: 'group',
      relationshipType: 'friendship',
      people: groupPeople,
    });
  };

  return (
    <div id="calculator" className="w-full max-w-2xl mx-auto">
      <GroupModeToggle
        mode={mode}
        setMode={(nextMode) => {
          setMode(nextMode);
          setError('');
        }}
      />

      {mode === 'pair' ? (
        <form
          onSubmit={calculatePairCompatibility}
          className="space-y-7 bg-card p-6 md:p-9 rounded-3xl border border-border shadow-lg animate-fade-in"
        >
          {error && (
            <div role="alert" className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-7">
            {pairPeople.map((person, index) => (
              <div key={person.id} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Person {index + 1}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${person.id}`}>Name</Label>
                    <Input
                      id={`name-${person.id}`}
                      value={person.name}
                      onChange={(event) => updatePairPerson(person.id, 'name', event.target.value)}
                      placeholder="Enter name"
                      maxLength={80}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`dob-${person.id}`}>Birth Date</Label>
                    <Input
                      id={`dob-${person.id}`}
                      type="date"
                      value={person.birthDate}
                      onChange={(event) => updatePairPerson(person.id, 'birthDate', event.target.value)}
                      max={new Date().toISOString().slice(0, 10)}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationshipType">Relationship Type</Label>
            <Select value={relationshipType} onValueChange={setRelationshipType}>
              <SelectTrigger id="relationshipType" className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="love">Romantic / Love</SelectItem>
                <SelectItem value="friendship">Friendship</SelectItem>
                <SelectItem value="work">Work / Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isCalculating} className="w-full btn-primary text-base h-14 rounded-xl">
            {isCalculating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              'Calculate Compatibility'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Birth dates are used for this calculation and are not stored.
          </p>
        </form>
      ) : (
        <GroupInputForm
          people={groupPeople}
          setPeople={setGroupPeople}
          onSubmit={calculateGroupCompatibility}
          isCalculating={isCalculating}
          error={error}
        />
      )}
    </div>
  );
}

export default CompatibilityCalculator;
