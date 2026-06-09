import React from 'react';
import { Loader2, Plus, X } from 'lucide-react';
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
    <form onSubmit={onSubmit} className="space-y-6 bg-card p-6 md:p-9 rounded-3xl border border-border shadow-lg animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Friend Group</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Add 3–7 people to see the overall vibe and every pair.
        </p>
      </div>

      {error && (
        <div role="alert" className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {people.map((person, index) => (
          <div key={person.id} className="relative p-4 bg-muted/25 rounded-2xl border border-border/70">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em]">
                Person {index + 1}
              </h3>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${person.id}`}>Name</Label>
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
              <div className="space-y-2">
                <Label htmlFor={`dob-${person.id}`}>Birth Date</Label>
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
        className="w-full h-12 border-dashed border-2 rounded-xl"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Person ({people.length}/7)
      </Button>

      <Button type="submit" disabled={isCalculating} className="w-full btn-primary text-base h-14 rounded-xl">
        {isCalculating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Calculating...
          </>
        ) : (
          'Calculate Group Compatibility'
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        Birth dates are used for this calculation and are not stored.
      </p>
    </form>
  );
}

export default GroupInputForm;
