import { ReactNode } from 'react';

export interface NavigationPageItem {
  kind: 'page';
  title: string;
  segment?: string;
  pattern?: string;
  icon?: ReactNode;
  children?: NavigationPageItem[];
} 