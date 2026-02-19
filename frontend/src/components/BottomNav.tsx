import { NavLink, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, Brain, Lightbulb, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/food', icon: UtensilsCrossed, label: 'Food' },
  { to: '/mood', icon: Brain, label: 'Mood' },
  { to: '/suggest', icon: Lightbulb, label: 'Suggest' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto h-16">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink key={to} to={to} className="flex flex-col items-center gap-0.5 min-w-[56px]">
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon size={active ? 26 : 22} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[11px] font-display ${active ? 'font-bold' : 'font-semibold'}`}>
                  {label}
                </span>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
