import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { buildResultNavigation } from '@/lib/result-navigation.js';
import PlaceSearch from './PlaceSearch.jsx';

const createPerson = (id) => ({ id, name: '', birthDate: '', place: null, birthTime: '' });
const defaultPair = [createPerson('pair-1'), createPerson('pair-2')];
const defaultGroup = [createPerson('group-1'), createPerson('group-2'), createPerson('group-3')];

function ExactModeToggle({ exactMode, onChange }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 px-4 py-3">
      <div className="flex-1">
        <Label htmlFor="exactMode" className="text-xs font-medium text-foreground">
          Exact Mode
        </Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Uses birth time and place for a more precise result when available.
        </p>
      </div>
      <input
        id="exactMode"
        type="checkbox"
        checked={exactMode}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
    </div>
  );
}

function CalculatorWithPreview({ mode, setMode }) {
  const navigate = useNavigate();
  const [relationshipType, setRelationshipType] = useState('love');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');
  const [exactMode, setExactMode] = useState(false);
  const [pairPeople, setPairPeople] = useState(defaultPair);
  const [groupPeople, setGroupPeople] = useState(defaultGroup);

  useEffect(() => {
    if (!exactMode) {
      const clearTimeAndPlace = (people) => people.map((person) => ({
        ...person,
        birthTime: '',
        place: null,
      }));
      setPairPeople((prev) => clearTimeAndPlace(prev));
      setGroupPeople((prev) => clearTimeAndPlace(prev));
    }
  }, [exactMode]);

  const people = mode === 'pair' ? pairPeople : groupPeople;
  const setPeople = mode === 'pair' ? setPairPeople : setGroupPeople;

  const updatePerson = (id, field, value) => {
    setPeople((prev) => prev.map((person) => (person.id === id ? { ...person, [field]: value } : person)));
  };

  const addGroupPerson = () => {
    setGroupPeople((prev) => {
      if (prev.length >= 7) return prev;
      return [...prev, createPerson(`group-${prev.length + 1}`)];
    });
  };

  const removeGroupPerson = (id) => {
    setGroupPeople((prev) => {
      if (prev.length <= 3) return prev;
      return prev.filter((person) => person.id !== id);
    });
  };

  const submitCalculation = async (payload) => {
    setError('');
    setIsCalculating(true);
    trackEvent('calculation_started', {
      mode: payload.mode,
      relationship_type: payload.relationshipType,
      group_size: payload.people.length,
      exact_mode: payload.exactMode,
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
        exact_mode: payload.exactMode,
      });
      const navigation = buildResultNavigation(data);
      navigate(navigation.path, { state: navigation.state });
    } catch (calculationError) {
      setError(calculationError.message || 'Unable to calculate this result.');
      trackEvent('calculation_failed', { mode: payload.mode, exact_mode: payload.exactMode });
    } finally {
      setIsCalculating(false);
    }
  };

  const buildSubmittedPeople = (form) => {
    const formData = new FormData(form);
    const fieldPrefix = mode === 'pair' ? '' : 'g';

    return people.map((person) => ({
      ...person,
      name: String(formData.get(`${fieldPrefix}name-${person.id}`) ?? '').trim(),
      birthDate: String(formData.get(`${fieldPrefix}dob-${person.id}`) ?? ''),
      birthTime: exactMode
        ? String(formData.get(`${fieldPrefix}time-${person.id}`) ?? '')
        : '',
      place: exactMode ? person.place : null,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const submittedPeople = buildSubmittedPeople(event.currentTarget);

    if (mode === 'pair') {
      submitCalculation({ mode: 'pair', relationshipType, people: submittedPeople, exactMode });
    } else {
      submitCalculation({ mode: 'group', relationshipType: 'friendship', people: submittedPeople, exactMode });
    }
  };

  const renderExactFields = (person, prefix) => {
    if (!exactMode) return null;

    return (
      <>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}time-${person.id}`} className="text-xs text-muted-foreground">
            Birth time (HH:MM)
          </Label>
          <Input
            id={`${prefix}time-${person.id}`}
            name={`${prefix}time-${person.id}`}
            type="time"
            defaultValue={person.birthTime}
            onInput={(event) => updatePerson(person.id, 'birthTime', event.currentTarget.value)}
            placeholder="HH:MM"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}place-${person.id}`} className="text-xs text-muted-foreground">
            Birth place (city, state)
          </Label>
          <PlaceSearch
            value={person.place?.label || ''}
            onChange={(value) => updatePerson(person.id, 'place', { ...(person.place || {}), label: value })}
            onSelect={(place) => updatePerson(person.id, 'place', place)}
          />
        </div>
      </>
    );
  };

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-[0_8px_40px_rgba(55,43,65,0.08)]">
      <div id="calculator" className="h-full w-full bg-card">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Check compatibility</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with two people or compare a full group.
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <div className="inline-flex items-center rounded-xl bg-secondary/80 p-1 ring-1 ring-border/50">
              <button
                type="button"
                onClick={() => setMode('pair')}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${mode === 'pair' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Pair
              </button>
              <button
                type="button"
                onClick={() => setMode('group')}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${mode === 'group' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Group
              </button>
            </div>
          </div>
        </div>

        {mode === 'pair' ? (
          <form onSubmit={handleSubmit} className="space-y-4 p-5 md:p-7">
            {error && (
              <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <ExactModeToggle exactMode={exactMode} onChange={setExactMode} />

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
                      name={`name-${person.id}`}
                      defaultValue={person.name}
                      onInput={(event) => updatePerson(person.id, 'name', event.currentTarget.value)}
                      placeholder="Enter name"
                      maxLength={80}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`dob-${person.id}`} className="text-xs text-muted-foreground">
                      Birth date
                    </Label>
                    <Input
                      id={`dob-${person.id}`}
                      name={`dob-${person.id}`}
                      type="date"
                      defaultValue={person.birthDate}
                      onInput={(event) => updatePerson(person.id, 'birthDate', event.currentTarget.value)}
                      max={new Date().toISOString().slice(0, 10)}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>
                  {renderExactFields(person, '')}
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
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                'Check compatibility'
              )}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Private, with no signup required. Birth dates are not stored.
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-5 md:p-7">
            {error && (
              <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <ExactModeToggle exactMode={exactMode} onChange={setExactMode} />

            <div className="divide-y divide-border border-y border-border">
              {groupPeople.map((person, index) => (
                <div key={person.id} className="flex items-end gap-3 py-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-semibold text-primary sm:mb-2">
                    {index + 1}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor={`gname-${person.id}`} className="text-xs text-muted-foreground">
                      Name
                    </Label>
                    <Input
                      id={`gname-${person.id}`}
                      name={`gname-${person.id}`}
                      defaultValue={person.name}
                      onInput={(event) => updatePerson(person.id, 'name', event.currentTarget.value)}
                      placeholder="Enter name"
                      maxLength={80}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor={`gdob-${person.id}`} className="text-xs text-muted-foreground">
                      Birth date
                    </Label>
                    <Input
                      id={`gdob-${person.id}`}
                      name={`gdob-${person.id}`}
                      type="date"
                      defaultValue={person.birthDate}
                      onInput={(event) => updatePerson(person.id, 'birthDate', event.currentTarget.value)}
                      max={new Date().toISOString().slice(0, 10)}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>
                  {exactMode && (
                    <>
                      <div className="flex-1 space-y-1.5">
                        <Label htmlFor={`gtime-${person.id}`} className="text-xs text-muted-foreground">
                          Birth time (HH:MM)
                        </Label>
                        <Input
                          id={`gtime-${person.id}`}
                          name={`gtime-${person.id}`}
                          type="time"
                          defaultValue={person.birthTime}
                          onInput={(event) => updatePerson(person.id, 'birthTime', event.currentTarget.value)}
                          placeholder="HH:MM"
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <Label htmlFor={`gplace-${person.id}`} className="text-xs text-muted-foreground">
                          Birth place (city, state)
                        </Label>
                        <PlaceSearch
                          value={person.place?.label || ''}
                          onChange={(value) => updatePerson(person.id, 'place', { ...(person.place || {}), label: value })}
                          onSelect={(place) => updatePerson(person.id, 'place', place)}
                        />
                      </div>
                    </>
                  )}
                  {groupPeople.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeGroupPerson(person.id)}
                      className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                      aria-label={`Remove ${person.name || `Person ${index + 1}`}`}
                    >
                      <span className="text-lg leading-none">&times;</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {groupPeople.length < 7 && (
              <button
                type="button"
                onClick={addGroupPerson}
                className="w-full rounded-xl border border-dashed border-primary/30 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                + Add another person
              </button>
            )}

            <Button type="submit" disabled={isCalculating} className="btn-primary h-12 w-full rounded-xl text-sm">
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                'See group compatibility'
              )}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Private, with no signup required. Birth dates are not stored.
            </p>
          </form>
        )}
      </div>

      {/* Google AdSense — below calculator on all screens */}
      <div className="flex justify-center border-t border-border bg-muted/20 p-4">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-7210866068673514"
          data-ad-slot="3279476431"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

    </div>
  );
}

export default CalculatorWithPreview;
