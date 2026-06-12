import React from 'react';
import { Loader2, Plus, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function GroupInputForm({ people, setPeople, onSubmit, isCalculating, error }) {
  const addPerson = () => {
    if (people.length >= 7) return;
    setPeople((current) => [
      ...current,
      {
        id: `group-${Date.now()}-${current.length}`,
        name: '',
        birthDate: '',
      },
    ]);
  };

  const removePerson = (id) => {
    if (people.length <= 3) return;
    setPeople((current) => current.filter((person) => person.id !== id));
  };

  const updatePerson = (id, field, value) => {
    setPeople((current) => current.map(
      (person) => person.id === id ? { ...person, [field]: value } : person,
    ));
  };

  return (
    <form onSubmit={onSubmit} className="animate-fade-in space-y-5 p-5 md:p-7">
      {error && (
        <div role="alert" className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {people.map((person, index) => (
          <div key={person.id} className="relative rounded-2xl border border-border bg-muted/20 p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <h3 className="text-xs font-semibold text-muted-foreground">Group member</h3>
              </div>
              {people.length > 3 && (
                <button
                  type="button"
                  onClick={() => removePerson(person.id)}
                  className="text-muted-foreground hover:text-destructive rounded-full p-1.5 transition-colors"
                  aria-label={`Remove person ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addPerson}
        disabled={people.length >= 7}
        className="h-11 w-full rounded-xl border-2 border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Person ({people.length}/7)
      </Button>

      <Button type="submit" disabled={isCalculating} className="btn-primary h-12 w-full rounded-xl text-sm">
        {isCalculating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Calculating...
          </>
        ) : (
          'See the group connection'
        )}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        Private, with no signup required. Birth dates are not stored.
      </p>
    </form>
  );
}

export default GroupInputForm;
