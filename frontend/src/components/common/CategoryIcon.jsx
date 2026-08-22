import React from 'react';
import { 
  Home, 
  ShoppingCart, 
  Utensils, 
  Zap, 
  Film, 
  Car, 
  Heart, 
  ShoppingBag, 
  CreditCard, 
  DollarSign, 
  Briefcase, 
  Tag 
} from 'lucide-react';

const iconMap = {
  Home,
  ShoppingCart,
  Utensils,
  Zap,
  Film,
  Car,
  Heart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Briefcase,
  Tag
};

export const CategoryIcon = ({ iconName, fallback = '?', className = "w-4 h-4" }) => {
  const Icon = iconMap[iconName] || iconMap.Tag;
  
  if (!iconName && fallback) {
    return <span className={`font-bold ${className}`}>{fallback}</span>;
  }
  
  return <Icon className={className} />;
};
