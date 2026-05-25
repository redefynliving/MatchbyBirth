
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

function FutureToolCard({ title, description, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
    >
      <Badge className="absolute top-4 right-4 bg-primary/20 text-primary border-primary/30">
        Coming soon
      </Badge>
      <div className="flex items-center gap-3 mb-3">
        {Icon && <Icon className="h-8 w-8 text-primary" />}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default FutureToolCard;
