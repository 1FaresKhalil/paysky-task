import type { NavMenuItems } from '@/types/nav';

export const navMenu: NavMenuItems = [
  {
    title: 'Home',
    icon: 'i-lucide-home',
    link: '/',
  },
  {
    title: 'Products',
    icon: 'icon-park-solid:calculator-one',
    link: '/products',
  },
  {
    title: 'Categories',
    icon: 'bxs:category-alt',
    link: '/categories',
  },
  {
    heading: 'Settings',
  },
  {
    title: 'Settings',
    icon: 'i-lucide-component',
    children: [
      {
        title: 'Settings 1',
        icon: 'i-lucide-circle',
        link: '/settings1',
      },
      {
        title: 'Settings 2',
        icon: 'i-lucide-circle',
        link: '/settings2',
      },
    ],
  },
];

export const navMenuBottom: NavMenuItems = [
  {
    title: 'Help',
    icon: 'i-lucide-life-buoy',
    link: '/help',
  },
  {
    title: 'Account',
    icon: 'i-lucide-square-user',
    link: '/account',
  },
];
