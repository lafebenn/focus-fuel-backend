import { NavLink, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, Brain, Lightbulb, Settings, Zap } from 'lucide-react';
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
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-56 z-50 bg-card border-r border-border">
        <div className="flex items-center gap-2 px-5 py-6 border-b border-border">
          <Zap className="text-primary" size={22} strokeWidth={2.5} />
          <span className="font-display font-black text-xl text-foreground">FocusFuel</span>
        </div>
        <div className="flex flex-col gap-1 p-3 flex-1">
          {tabs.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <NavLink key={to} to={to}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span className={`font-display text-sm ${active ? 'font-bold' : 'font-semibold'}`}>
                    {label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
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
                  <span className={`text-xs font-display ${active ? 'font-bold' : 'font-semibold'}`}>
                    {label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
