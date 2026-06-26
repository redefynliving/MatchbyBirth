import React, { useState } from 'react';
import { Clock, Loader2, MapPin, ShieldCheck } from 'lucide-react';
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
import HomeResultPreview from './HomeResultPreview.jsx';

const ZODIAC_START_DATES = [
  [1, 20],
  [2, 19],
  [3, 21],
  [4, 20],
  [5, 21],
  [6, 21],
  [7, 23],
  [8, 23],
  [9, 23],
  [10, 23],
  [11, 22],
  [12, 22],
];

const createPerson = (id) => ({
  id,
  name: '',
  birthDate: '',
  birthTime: '',
  birthPlace: null,
  birthPlaceQuery: '',
  birthPlaceMatches: [],
  birthPlaceLoading: false,
  birthPlaceError: '',
});

function dayOfLeapYear(month, day) {
  const date = new Date(Date.UTC(2000, month - 1, day));
  const start = new Date(Date.UTC(2000, 0, 1));
  return Math.round((date.getTime() - start.getTime()) / 86400000) + 1;
}

function isNearZodiacTransition(birthDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate || '');
  if (!match) return false;

  const month = Number(match[2]);
  const day = Number(match[3]);
  const targetDay = dayOfLeapYear(month, day);
  return ZODIAC_START_DATES.some(([startMonth, startDay]) => (
    Math.abs(dayOfLeapYear(startMonth, startDay) - targetDay) <= 1
  ));
}

function BirthPlaceSearch({ person, searchBirthPlaces, selectBirthPlace, idPrefix }) {
  const selectedPlace = person.birthPlace;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${idPrefix}-place-${person.id}`} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        Birth place
      </Label>
      <Input
        id={`${idPrefix}-place-${person.id}`}
        value={person.birthPlaceQuery}
        onChange={(event) => searchBirthPlaces(person.id, event.target.value)}
        placeholder="Search city, state, or country"
        maxLength={120}
        className="h-10 rounded-xl"
      />
      {person.birthPlaceLoading && (
        <p className="text-xs text-muted-foreground">Searching places...</p>
      )}
      {person.birthPlaceError && (
        <p className="text-xs text-destructive">{person.birthPlaceError}</p>
      )}
      {person.birthPlaceMatches.length > 0 && (
        <div className="max-h-44 overflow-auto rounded-xl border border-border bg-card shadow-sm">
          {person.birthPlaceMatches.map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => selectBirthPlace(person.id, place)}
              className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-secondary"
            >
              {place.label}
            </button>
          ))}
        </div>
      )}
      {person.birthPlaceQuery && !selectedPlace && !person.birthPlaceLoading && (
        <p className="text-xs text-muted-foreground">
          Select a city from the list to enable MBB Exact Mode.
        </p>
      )}
      {selectedPlace && (
        <p className="text-xs font-medium text-primary">
          Selected: {selectedPlace.label}
        </p>
      )}
    </div>
  );
}

function OptionalBirthDetails({
  person,
  updatePerson,
  searchBirthPlaces,
  selectBirthPlace,
  idPrefix,
}) {
  const nearTransition = isNearZodiacTransition(person.birthDate);
  const hasOptionalDetails = Boolean(person.birthTime || person.birthPlaceQuery || person.birthPlace);
  const exactModeReady = Boolean(person.birthDate && person.birthTime && person.birthPlace);

  return (
    <details className="group mt-3 rounded-xl border border-dashed border-primary/20 bg-secondary/25 px-3 py-2 sm:ml-10">
      <summary className="cursor-pointer select-none text-xs font-semibold text-primary marker:text-primary">
        Add birth time/place <span className="font-normal text-muted-foreground">(optional)</span>
      </summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-time-${person.id}`} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Birth time
          </Label>
          <Input
            id={`${idPrefix}-time-${person.id}`}
            type="time"
            value={person.birthTime}
            onChange={(event) => updatePerson(person.id, 'birthTime', event.target.value)}
            className="h-10 rounded-xl"
          />
        </div>
        <BirthPlaceSearch
          person={person}
          searchBirthPlaces={searchBirthPlaces}
          selectBirthPlace={selectBirthPlace}
          idPrefix={idPrefix}
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {exactModeReady
          ? 'MBB Exact Mode ready. This will calculate the Sun sign from birth date, time, and selected place.'
          : nearTransition
            ? 'Near a zodiac transition. Add time and select a city to enable MBB Exact Mode.'
            : 'Near a zodiac transition? Time/place can clarify sign context. Otherwise this is optional.'}
        {hasOptionalDetails ? ' Raw time/place are not stored in shared results.' : ''}
      </p>
    </details>
  );
}

function CalculatorWithPreview({ mode, setMode }) {
  const navigate = useNavigate();
  const [relationshipType, setRelationshipType] = useState('love');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const defaultPair = [createPerson('pair-1'), createPerson('pair-2')];
  const defaultGroup = [createPerson('group-1'), createPerson('group-2'), createPerson('group-3')];

  const [pairPeople, setPairPeople] = useState(defaultPair);
  const [groupPeople, setGroupPeople] = useState(defaultGroup);

  const people = mode === 'pair' ? pairPeople : groupPeople;
  const setPeople = mode === 'pair' ? setPairPeople : setGroupPeople;

  const updatePerson = (id, field, value) => {
    setPeople((prev) => prev.map(
      (person) => person.id === id ? { ...person, [field]: value } : person,
    ));
  };

  const patchPerson = (id, patch) => {
    setPeople((prev) => prev.map(
      (person) => person.id === id ? { ...person, ...patch } : person,
    ));
  };

  const searchBirthPlaces = async (id, query) => {
    patchPerson(id, {
      birthPlaceQuery: query,
      birthPlace: null,
      birthPlaceError: '',
    });

    if (query.trim().length < 2) {
      patchPerson(id, {
        birthPlaceMatches: [],
        birthPlaceLoading: false,
      });
      return;
    }

    patchPerson(id, { birthPlaceLoading: true });

    try {
      const response = await fetch(`/api/search-birth-places?q=${encodeURIComponent(query)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to search places.');
      patchPerson(id, {
        birthPlaceMatches: Array.isArray(data.places) ? data.places : [],
        birthPlaceLoading: false,
      });
    } catch (placeError) {
      patchPerson(id, {
        birthPlaceMatches: [],
        birthPlaceLoading: false,
        birthPlaceError: placeError.message || 'Unable to search places.',
      });
    }
  };

  const selectBirthPlace = (id, place) => {
    patchPerson(id, {
      birthPlace: place,
      birthPlaceQuery: place.label,
      birthPlaceMatches: [],
      birthPlaceLoading: false,
      birthPlaceError: '',
    });
  };

  const buildPayloadPeople = (list) => list.map((person) => ({
    id: person.id,
    name: person.name,
    birthDate: person.birthDate,
    birthTime: person.birthTime,
    birthPlace: person.birthPlace,
  }));

  const addGroupPerson = () => {
    setGroupPeople((prev) => {
      if (prev.length >= 7) return prev;
      return [...prev, createPerson(`group-${prev.length + 1}`)];
    });
  };

  const removeGroupPerson = (id) => {
    setGroupPeople((prev) => {
      if (prev.length <= 3) return prev;
      return prev.filter((p) => p.id !== id);
    });
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
      const navigation = buildResultNavigation(data);
      navigate(navigation.path, { state: navigation.state });
    } catch (calculationError) {
      setError(calculationError.message || 'Unable to calculate this result.');
      trackEvent('calculation_failed', { mode: payload.mode });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === 'pair') {
      submitCalculation({ mode: 'pair', relationshipType, people: buildPayloadPeople(pairPeople) });
    } else {
      submitCalculation({
        mode: 'group',
        relationshipType: 'friendship',
        people: buildPayloadPeople(groupPeople),
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary/15 bg-card shadow-[0_24px_65px_rgba(55,43,65,0.14)]">
      <div id="calculator" className="h-full w-full bg-card">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
          <div>
            <h2 className="text-xl font-semibold">Check your connection</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with two people or compare a full group.
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <div className="inline-flex items-center rounded-xl bg-secondary p-1">
              <button
                type="button"
                onClick={() => setMode('pair')}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${mode === 'pair' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Pair
              </button>
              <button
                type="button"
                onClick={() => setMode('group')}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${mode === 'group' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Group
              </button>
            </div>
          </div>
        </div>

        {mode === 'pair' ? (
          <form onSubmit={handleSubmit} className="space-y-4 p-5 md:p-7">
            {error && (
              <div role="alert" className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            <div className="divide-y divide-border border-y border-border">
              {pairPeople.map((person, index) => (
                <div
                  key={person.id}
                  className="py-4"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-end">
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
                        onChange={(event) => updatePerson(person.id, 'name', event.target.value)}
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
                        type="date"
                        value={person.birthDate}
                        onChange={(event) => updatePerson(person.id, 'birthDate', event.target.value)}
                        max={new Date().toISOString().slice(0, 10)}
                        required
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <OptionalBirthDetails
                    person={person}
                    updatePerson={updatePerson}
                    searchBirthPlaces={searchBirthPlaces}
                    selectBirthPlace={selectBirthPlace}
                    idPrefix="pair"
                  />
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
              Private, with no signup required. Birth details are not stored.
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-5 md:p-7">
            {error && (
              <div role="alert" className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            <div className="divide-y divide-border border-y border-border">
              {groupPeople.map((person, index) => (
                <div
                  key={person.id}
                  className="py-4"
                >
                  <div className="flex items-end gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-semibold text-primary sm:mb-2">
                      {index + 1}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <Label htmlFor={`gname-${person.id}`} className="text-xs text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        id={`gname-${person.id}`}
                        value={person.name}
                        onChange={(event) => updatePerson(person.id, 'name', event.target.value)}
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
                        type="date"
                        value={person.birthDate}
                        onChange={(event) => updatePerson(person.id, 'birthDate', event.target.value)}
                        max={new Date().toISOString().slice(0, 10)}
                        required
                        className="h-11 rounded-xl"
                      />
                    </div>
                    {groupPeople.length > 3 && (
                      <button
                        type="button"
                        onClick={() => removeGroupPerson(person.id)}
                        className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                        aria-label={`Remove ${person.name || `Person ${index + 1}`}`}
                      >
                        <span className="text-lg leading-none">&times;</span>
                      </button>
                    )}
                  </div>
                  <OptionalBirthDetails
                    person={person}
                    updatePerson={updatePerson}
                    searchBirthPlaces={searchBirthPlaces}
                    selectBirthPlace={selectBirthPlace}
                    idPrefix="group"
                  />
                </div>
              ))}
            </div>

            {groupPeople.length < 7 && (
              <button
                type="button"
                onClick={addGroupPerson}
                className="w-full rounded-xl border border-dashed border-primary/30 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                + Add another person
              </button>
            )}

            <Button type="submit" disabled={isCalculating} className="btn-primary h-12 w-full rounded-xl text-sm">
              {isCalculating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                'See group compatibility'
              )}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Private, with no signup required. Birth details are not stored.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default CalculatorWithPreview;
