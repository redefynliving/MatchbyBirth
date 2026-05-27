     1|
     2|import React from 'react';
     3|import { Input } from '@/components/ui/input';
     4|import { Label } from '@/components/ui/label';
     5|import { Button } from '@/components/ui/button';
     6|import { Plus, X, Loader2 } from 'lucide-react';
     7|
     8|function GroupInputForm({ people, setPeople, onSubmit, isCalculating, error }) {
     9|  const addPerson = () => {
    10|    if (people.length < 7) {
    11|      setPeople([...people, { id: Date.now(), name: '', birthDate: '' }]);
    12|    }
    13|  };
    14|
    15|  const removePerson = (id) => {
    16|    if (people.length > 3) {
    17|      setPeople(people.filter(p => p.id !== id));
    18|    }
    19|  };
    20|
    21|  const handlePersonChange = (id, field, value) => {
    22|    setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p));
    23|  };
    24|
    25|  return (
    26|    <form onSubmit={onSubmit} className="space-y-6 bg-card p-6 md:p-10 rounded-3xl border border-border shadow-lg animate-fade-in">
    27|      <div className="text-center mb-6">
    28|        <h2 className="text-2xl font-bold text-foreground">Group Compatibility</h2>
    29|        <p className="text-muted-foreground text-sm mt-1">Add up to 7 friends to see your group vibe score.</p>
    30|      </div>
    31|
    32|      {error && (
    33|        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
    34|          {error}
    35|        </div>
    36|      )}
    37|
    38|      <div className="space-y-6">
    39|        {people.map((person, index) => (
    40|          <div key={person.id} className="relative p-4 bg-muted/30 rounded-2xl border border-border/50 transition-all">
    41|            <div className="flex justify-between items-center mb-3">
    42|              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
    43|                {index === 0 ? 'You' : `Friend ${index}`}
    44|              </h3>
    45|              {index >= 2 && (
    46|                <button
    47|                  type="button"
    48|                  onClick={() => removePerson(person.id)}
    49|                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full p-1.5 transition-colors"
    50|                  aria-label="Remove person"
    51|                >
    52|                  <X className="w-4 h-4" />
    53|                </button>
    54|              )}
    55|            </div>
    56|            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    57|              <div className="space-y-2">
    58|                <Label htmlFor={`name-${person.id}`} className="text-foreground font-medium text-sm">Name</Label>
    59|                <Input
    60|                  id={`name-${person.id}`}
    61|                  type="text"
    62|                  value={person.name}
    63|                  onChange={(e) => handlePersonChange(person.id, 'name', e.target.value)}
    64|                  placeholder="Enter name"
    65|                  className="bg-background text-foreground border-border focus-visible:ring-primary h-11 rounded-xl"
    66|                />
    67|              </div>
    68|              <div className="space-y-2">
    69|                <Label htmlFor={`dob-${person.id}`} className="text-foreground font-medium text-sm">Birth Date</Label>
    70|                <Input
    71|                  id={`dob-${person.id}`}
    72|                  type="date"
    73|                  value={person.birthDate}
    74|                  onChange={(e) => handlePersonChange(person.id, 'birthDate', e.target.value)}
    75|                  className="bg-background text-foreground border-border focus-visible:ring-primary h-11 rounded-xl"
    76|                />
    77|              </div>
    78|            </div>
    79|          </div>
    80|        ))}
    81|      </div>
    82|
    83|      <Button
    84|        type="button"
    85|        variant="outline"
    86|        onClick={addPerson}
    87|        disabled={people.length >= 7}
    88|        className="w-full h-12 border-dashed border-2 rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    89|      >
    90|        <Plus className="w-4 h-4 mr-2" />
    91|        Add Person ({people.length}/7)
    92|      </Button>
    93|
    94|      <Button
    95|        type="submit"
    96|        disabled={isCalculating}
    97|        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md text-lg font-semibold h-14 rounded-xl mt-4"
    98|      >
    99|        {isCalculating ? (
   100|          <>
   101|            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
   102|            Calculating Group Vibe...
   103|          </>
   104|        ) : (
   105|          'Calculate Group Compatibility'
   106|        )}
   107|      </Button>
   108|    </form>
   109|  );
   110|}
   111|
   112|export default GroupInputForm;
   113|