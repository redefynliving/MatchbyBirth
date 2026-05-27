     1|
     2|import React, { useState } from 'react';
     3|import { useNavigate } from 'react-router-dom';
     4|import { Button } from '@/components/ui/button';
     5|import { Input } from '@/components/ui/input';
     6|import { Label } from '@/components/ui/label';
     7|import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
     8|import { Loader2 } from 'lucide-react';
     9|import GroupModeToggle from './GroupModeToggle.jsx';
    10|import GroupInputForm from './GroupInputForm.jsx';
    11|
    12|function CompatibilityCalculator() {
    13|  const navigate = useNavigate();
    14|  const [mode, setMode] = useState('pair'); // 'pair' or 'group'
    15|  
    16|  // Pair State
    17|  const [pairPeople, setPairPeople] = useState([
    18|    { id: 1, name: '', birthDate: '' },
    19|    { id: 2, name: '', birthDate: '' }
    20|  ]);
    21|  const [relationshipType, setRelationshipType] = useState('love');
    22|  
    23|  // Group State (starts with 2 people instead of 3)
    24|  const [groupPeople, setGroupPeople] = useState([
    25|    { id: 1, name: '', birthDate: '' },
    26|    { id: 2, name: '', birthDate: '' }
    27|  ]);
    28|
    29|  const [isCalculating, setIsCalculating] = useState(false);
    30|  const [error, setError] = useState('');
    31|
    32|  const handlePairChange = (id, field, value) => {
    33|    setPairPeople(pairPeople.map(p => p.id === id ? { ...p, [field]: value } : p));
    34|  };
    35|
    36|  const handleModeChange = (newMode) => {
    37|    setMode(newMode);
    38|    setError('');
    39|  };
    40|
    41|  const calculatePairCompatibility = (e) => {
    42|    e.preventDefault();
    43|    setError('');
    44|
    45|    const isInvalid = pairPeople.some(p => !p.name.trim() || !p.birthDate);
    46|    if (isInvalid) {
    47|      setError('Please fill in all names and birth dates.');
    48|      return;
    49|    }
    50|
    51|    setIsCalculating(true);
    52|
    53|    setTimeout(() => {
    54|      const searchParams = new URLSearchParams();
    55|      searchParams.set('p1', pairPeople[0].name);
    56|      searchParams.set('p1_dob', pairPeople[0].birthDate);
    57|      searchParams.set('p2', pairPeople[1].name);
    58|      searchParams.set('p2_dob', pairPeople[1].birthDate);
    59|      searchParams.set('type', relationshipType);
    60|      
    61|      setIsCalculating(false);
    62|      navigate(`/result?${searchParams.toString()}`);
    63|    }, 1000);
    64|  };
    65|
    66|  const calculateGroupCompatibility = (e) => {
    67|    e.preventDefault();
    68|    setError('');
    69|
    70|    const isInvalid = groupPeople.some(p => !p.name.trim() || !p.birthDate);
    71|    if (isInvalid) {
    72|      setError('Please fill in all names and birth dates for the group.');
    73|      return;
    74|    }
    75|
    76|    // Since we now allow starting with 2 people, we must enforce minimum 2
    77|    if (groupPeople.length < 2) {
    78|      setError('Please add at least 2 people to the group.');
    79|      return;
    80|    }
    81|
    82|    setIsCalculating(true);
    83|
    84|    setTimeout(() => {
    85|      const groupString = groupPeople.map(p => `${encodeURIComponent(p.name)},${encodeURIComponent(p.birthDate)}`).join(',');
    86|      setIsCalculating(false);
    87|      navigate(`/result?group=${groupString}`);
    88|    }, 1000);
    89|  };
    90|
    91|  return (
    92|    <div className="w-full max-w-2xl mx-auto">
    93|      <GroupModeToggle mode={mode} setMode={handleModeChange} />
    94|
    95|      {mode === 'pair' ? (
    96|        <form onSubmit={calculatePairCompatibility} className="space-y-8 bg-card p-6 md:p-10 rounded-3xl border border-border shadow-lg animate-fade-in">
    97|          {error && (
    98|            <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
    99|              {error}
   100|            </div>
   101|          )}
   102|          
   103|          <div className="space-y-8">
   104|            {pairPeople.map((person, index) => (
   105|              <div key={person.id} className="space-y-4 relative">
   106|                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Person {index + 1}</h3>
   107|                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
   108|                  <div className="space-y-2">
   109|                    <Label htmlFor={`name-${person.id}`} className="text-foreground font-medium">Name</Label>
   110|                    <Input
   111|                      id={`name-${person.id}`}
   112|                      type="text"
   113|                      value={person.name}
   114|                      onChange={(e) => handlePairChange(person.id, 'name', e.target.value)}
   115|                      placeholder="Enter name"
   116|                      className="bg-background text-foreground border-border focus-visible:ring-primary h-12 rounded-xl"
   117|                    />
   118|                  </div>
   119|                  <div className="space-y-2">
   120|                    <Label htmlFor={`dob-${person.id}`} className="text-foreground font-medium">Birth Date</Label>
   121|                    <Input
   122|                      id={`dob-${person.id}`}
   123|                      type="date"
   124|                      value={person.birthDate}
   125|                      onChange={(e) => handlePairChange(person.id, 'birthDate', e.target.value)}
   126|                      className="bg-background text-foreground border-border focus-visible:ring-primary h-12 rounded-xl"
   127|                    />
   128|                  </div>
   129|                </div>
   130|              </div>
   131|            ))}
   132|          </div>
   133|
   134|          <div className="space-y-2 pt-4">
   135|            <Label htmlFor="relationshipType" className="text-foreground font-medium">Relationship Type</Label>
   136|            <Select value={relationshipType} onValueChange={setRelationshipType}>
   137|              <SelectTrigger className="bg-background text-foreground border-border focus:ring-primary h-12 rounded-xl">
   138|                <SelectValue />
   139|              </SelectTrigger>
   140|              <SelectContent>
   141|                <SelectItem value="love">Romantic / Love</SelectItem>
   142|                <SelectItem value="friendship">Friendship</SelectItem>
   143|                <SelectItem value="work">Work / Professional</SelectItem>
   144|              </SelectContent>
   145|            </Select>
   146|          </div>
   147|
   148|          <Button
   149|            type="submit"
   150|            disabled={isCalculating}
   151|            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md text-lg font-semibold h-14 rounded-xl"
   152|          >
   153|            {isCalculating ? (
   154|              <>
   155|                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
   156|                Calculating Stars...
   157|              </>
   158|            ) : (
   159|              'Calculate Compatibility'
   160|            )}
   161|          </Button>
   162|        </form>
   163|      ) : (
   164|        <GroupInputForm 
   165|          people={groupPeople} 
   166|          setPeople={setGroupPeople} 
   167|          onSubmit={calculateGroupCompatibility}
   168|          isCalculating={isCalculating}
   169|          error={error}
   170|        />
   171|      )}
   172|    </div>
   173|  );
   174|}
   175|
   176|export default CompatibilityCalculator;
   177|