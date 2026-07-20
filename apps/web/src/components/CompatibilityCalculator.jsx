import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
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
import { getFunnelAttribution } from '@/lib/funnel-attribution.js';
import { buildResultNavigation } from '@/lib/result-navigation.js';
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
    const funnelAttribution = getFunnelAttribution();
    trackEvent('calculation_started', {
      mode: payload.mode,
      relationship_type: payload.relationshipType,
      group_size: payload.people.length,
      ...funnelAttribution,
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
        ...funnelAttribution,
      });
      const navigation = buildResultNavigation(data);
      navigate(navigation.path, { state: navigation.state });
    } catch (calculationError) {
      setError(calculationError.message || 'Unable to calculate this result.');
      trackEvent('calculation_failed', { mode: payload.mode, ...funnelAttribution });
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
    <div id="calculator" className="h-full w-full bg-card">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
        <div>
          <h2 className="text-xl font-semibold">Check your connection</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start with two people or compare a full group.
          </p>
        </div>
        <div className="flex justify-center sm:justify-end">
          <GroupModeToggle
            mode={mode}
            setMode={(nextMode) => {
              setMode(nextMode);
              setError('');
            }}
          />
        </div>
      </div>

      {mode === 'pair' ? (
        <form
          onSubmit={calculatePairCompatibility}
          className="animate-fade-in space-y-4 p-5 md:p-7"
        >
          {error && (
            <div role="alert" className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          <div className="divide-y divide-border border-y border-border">
            {pairPeople.map((person, index) => (
              <div
                key={person.id}
                className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-end"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary text-xs font-semibold text-primary sm:mb-2">
                  {index + 1}
                </span>
                <div className="space-y-1.5">
                    <Label htmlFor={`name-${person.id}`} className="text-xs text-muted-foreground">
                      Name or nickname
                    </Label>
                    <Input
                      id={`name-${person.id}`}
                      value={person.name}
                      onChange={(event) => updatePairPerson(person.id, 'name', event.target.value)}
                      placeholder="Enter name"
                      maxLength={80}
                      required
                      className="h-11 rounded-xl"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor={`dob-${person.id}`} className="text-xs text-muted-foreground">
                      Birth date (day / month / year)
                    </Label>
                    <Input
                      id={`dob-${person.id}`}
                      type="date"
                      value={person.birthDate}
                      onChange={(event) => updatePairPerson(person.id, 'birthDate', event.target.value)}
                      max={new Date().toISOString().slice(0, 10)}
                      required
                      className="h-11 rounded-xl"
                    />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationshipType" className="text-xs text-muted-foreground">
              What kind of connection?
            </Label>
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

          <Button type="submit" disabled={isCalculating} className="btn-primary h-12 w-full rounded-xl text-sm">
            {isCalculating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              'See our compatibility'
            )}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Private, with no signup required. Birth dates are not stored.
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
