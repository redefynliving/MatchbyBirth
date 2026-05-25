
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Loader2 } from 'lucide-react';

function GroupInputForm({ people, setPeople, onSubmit, isCalculating, error }) {
  const addPerson = () => {
    if (people.length < 7) {
      setPeople([...people, { id: Date.now(), name: '', birthDate: '' }]);
    }
  };

  const removePerson = (id) => {
    if (people.length > 2) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const handlePersonChange = (id, field, value) => {
    setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-card p-6 md:p-10 rounded-3xl border border-border shadow-lg animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Group Compatibility</h2>
        <p className="text-muted-foreground text-sm mt-1">Add up to 7 friends to see your group vibe score.</p>
      </div>

      {error && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {people.map((person, index) => (
          <div key={person.id} className="relative p-4 bg-muted/30 rounded-2xl border border-border/50 transition-all">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {index === 0 ? 'You' : `Friend ${index}`}
              </h3>
              {index >= 2 && (
                <button
                  type="button"
                  onClick={() => removePerson(person.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full p-1.5 transition-colors"
                  aria-label="Remove person"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${person.id}`} className="text-foreground font-medium text-sm">Name</Label>
                <Input
                  id={`name-${person.id}`}
                  type="text"
                  value={person.name}
                  onChange={(e) => handlePersonChange(person.id, 'name', e.target.value)}
                  placeholder="Enter name"
                  className="bg-background text-foreground border-border focus-visible:ring-primary h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`dob-${person.id}`} className="text-foreground font-medium text-sm">Birth Date</Label>
                <Input
                  id={`dob-${person.id}`}
                  type="date"
                  value={person.birthDate}
                  onChange={(e) => handlePersonChange(person.id, 'birthDate', e.target.value)}
                  className="bg-background text-foreground border-border focus-visible:ring-primary h-11 rounded-xl"
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
        className="w-full h-12 border-dashed border-2 rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Person ({people.length}/7)
      </Button>

      <Button
        type="submit"
        disabled={isCalculating}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md text-lg font-semibold h-14 rounded-xl mt-4"
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Calculating Group Vibe...
          </>
        ) : (
          'Calculate Group Compatibility'
        )}
      </Button>
    </form>
  );
}

export default GroupInputForm;
