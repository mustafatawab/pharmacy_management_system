#!/bin/bash
sed -i '' 's/  index?: number;/  index?: number;\
  iconBgColor?: string;\
  iconColor?: string;/g' components/stat-card.tsx
