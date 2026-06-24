import React, { useState, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * Place search input with suggestions.
 * Uses /api/places search endpoint for server-side place lookup.
 */
function PlaceSearch({ onSelect, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const searchPlaces = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/places?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    searchPlaces(val);
    setIsOpen(true);
  };

  const handleSelect = (place) => {
    onSelect(place);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    onChange('');
    onSelect(null);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value || ''}
          onChange={handleInputChange}
          placeholder="City, State (optional)"
          className="h-11 rounded-xl pl-10 pr-10"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((place) => (
            <li key={place.label}>
              <button
                type="button"
                onClick={() => handleSelect(place)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-secondary transition-colors"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span>{place.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaceSearch;