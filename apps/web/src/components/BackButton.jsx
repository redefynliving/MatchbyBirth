import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';

export default function BackButton({ fallbackTo = '/', label = 'Back', className = '' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      className={`mb-6 inline-flex rounded-full px-0 text-sm font-medium text-muted-foreground hover:text-foreground ${className}`.trim()}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}