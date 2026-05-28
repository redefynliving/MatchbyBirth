
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import GroupModeToggle from './GroupModeToggle.jsx';
import GroupInputForm from './GroupInputForm.jsx';

function CompatibilityCalculator() {
const navigate = useNavigate();
const [mode, setMode] = useState('pair'); // 'pair' or 'group'

// Pair State
const [pairPeople, setPairPeople] = useState([
{ id: 1, name: '', birthDate: '' },
{ id: 2, name: '', birthDate: '' }
]);
const [relationshipType, setRelationshipType] = useState('love');

// Group State (starts with 2 people instead of 3)
const [groupPeople, setGroupPeople] = useState([
{ id: 1, name: '', birthDate: '' },
{ id: 2, name: '', birthDate: '' }
]);

const [isCalculating, setIsCalculating] = useState(false);
const [error, setError] = useState('');

const handlePairChange = (id, field, value) => {
setPairPeople(pairPeople.map(p => p.id === id ? { ...p, [field]: value } : p));
};

const handleModeChange = (newMode) => {
setMode(newMode);
setError('');
};

const calculatePairCompatibility = (e) => {
e.preventDefault();
setError('');

const isInvalid = pairPeople.some(p => !p.name.trim() || !p.birthDate);
if (isInvalid) {
setError('Please fill in all names and birth dates.');
return;
}

setIsCalculating(true);

setTimeout(() => {
const searchParams = new URLSearchParams();
searchParams.set('p1', pairPeople[0].name);
searchParams.set('p1_dob', pairPeople[0].birthDate);
searchParams.set('p2', pairPeople[1].name);
searchParams.set('p2_dob', pairPeople[1].birthDate);
searchParams.set('type', relationshipType);

setIsCalculating(false);
navigate(`/result?${searchParams.toString()}`);
}, 1000);
};

const calculateGroupCompatibility = (e) => {
e.preventDefault();
setError('');

const isInvalid = groupPeople.some(p => !p.name.trim() || !p.birthDate);
if (isInvalid) {
setError('Please fill in all names and birth dates for the group.');
return;
}

// Since we now allow starting with 2 people, we must enforce minimum 2
if (groupPeople.length < 2) {
setError('Please add at least 2 people to the group.');
return;
}

setIsCalculating(true);

setTimeout(() => {
const groupString = groupPeople.map(p => `${encodeURIComponent(p.name)},${encodeURIComponent(p.birthDate)}`).join(',');
setIsCalculating(false);
navigate(`/result?group=${groupString}`);
}, 1000);
};

return (
<div className="w-full max-w-2xl mx-auto">
<GroupModeToggle mode={mode} setMode={handleModeChange} />

{mode === 'pair' ? (
<form onSubmit={calculatePairCompatibility} className="space-y-8 bg-card p-6 md:p-10 rounded-3xl border border-border shadow-lg animate-fade-in">
{error && (
<div className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
{error}
</div>
)}

<div className="space-y-8">
{pairPeople.map((person, index) => (
<div key={person.id} className="space-y-4 relative">
<h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Person {index + 1}</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div className="space-y-2">
<Label htmlFor={`name-${person.id}`} className="text-foreground font-medium">Name</Label>
<Input
id={`name-${person.id}`}
type="text"
value={person.name}
onChange={(e) => handlePairChange(person.id, 'name', e.target.value)}
placeholder="Enter name"
className="bg-background text-foreground border-border focus-visible:ring-primary h-12 rounded-xl"
/>
</div>
<div className="space-y-2">
<Label htmlFor={`dob-${person.id}`} className="text-foreground font-medium">Birth Date</Label>
<Input
id={`dob-${person.id}`}
type="date"
value={person.birthDate}
onChange={(e) => handlePairChange(person.id, 'birthDate', e.target.value)}
className="bg-background text-foreground border-border focus-visible:ring-primary h-12 rounded-xl"
/>
</div>
</div>
</div>
))}
</div>

<div className="space-y-2 pt-4">
<Label htmlFor="relationshipType" className="text-foreground font-medium">Relationship Type</Label>
<Select value={relationshipType} onValueChange={setRelationshipType}>
<SelectTrigger className="bg-background text-foreground border-border focus:ring-primary h-12 rounded-xl">
<SelectValue />
</SelectTrigger>
<SelectContent>
<SelectItem value="love">Romantic / Love</SelectItem>
<SelectItem value="friendship">Friendship</SelectItem>
<SelectItem value="work">Work / Professional</SelectItem>
</SelectContent>
</Select>
</div>

<Button
type="submit"
disabled={isCalculating}
className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md text-lg font-semibold h-14 rounded-xl"
>
{isCalculating ? (
<>
<Loader2 className="w-5 h-5 mr-2 animate-spin" />
Calculating Stars...
</>
) : (
'Calculate Compatibility'
)}
</Button>
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


