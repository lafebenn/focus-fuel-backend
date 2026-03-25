import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, ShieldAlert, User, MessageSquare, Star, X, Plus } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { defaultSettings, allergyOptions } from '@/utils/mockData';
import type { UserSettings } from '@/utils/mockData';
import { toast } from 'sonner';
import { userAPI } from '@/api/userAPI';
import { checkBackendHealth } from '@/api/foodLogAPI';

const frequencies = [
  { value: 'daily' as const, label: 'Daily' },
  { value: 'custom' as const, label: 'Custom' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<UserSettings>('userSettings', defaultSettings);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTimes, setCustomTimes] = useState<string[]>(settings.customReminderTimes || ['09:00', '19:00']);
  const [newAllergy, setNewAllergy] = useState('');
  const [backendUp, setBackendUp] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await checkBackendHealth();
      setBackendUp(ok);
      if (ok) {
        try {
          const res = await userAPI.getSettings();
          if (res.success) {
            setSettings(prev => ({
              ...prev,
              notifications: res.data.notifications,
              reminderFrequency: res.data.reminderFrequency === 'custom' ? 'custom' : 'daily',
              reminderTime: res.data.reminderTime || prev.reminderTime,
              allergies: res.data.allergies ?? prev.allergies,
            }));
          }
        } catch { /* keep local */ }
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const syncToBackend = async (patch: Partial<UserSettings>) => {
    if (!backendUp) return;
    try {
      const allAllergies = [...(patch.allergies ?? settings.allergies), ...(patch.customAllergies ?? settings.customAllergies ?? [])];
      await userAPI.updateSettings({
        notifications: patch.notifications ?? settings.notifications,
        reminderFrequency: patch.reminderFrequency ?? settings.reminderFrequency,
        reminderTime: patch.reminderTime ?? settings.reminderTime,
        allergies: allAllergies,
      });
    } catch { /* non-blocking */ }
  };

  const toggleNotification = () => {
    const next = !settings.notifications;
    setSettings(prev => ({ ...prev, notifications: next }));
    syncToBackend({ notifications: next });
    toast.success('Settings saved! ✓');
  };

  const setFrequency = (freq: UserSettings['reminderFrequency']) => {
    if (freq === 'custom') {
      setShowCustomModal(true);
    } else {
      setSettings(prev => ({ ...prev, reminderFrequency: freq }));
      syncToBackend({ reminderFrequency: freq });
      toast.success('Settings saved! ✓');
    }
  };

  const saveCustomTimes = () => {
    setSettings(prev => ({
      ...prev,
      reminderFrequency: 'custom',
      customReminderTimes: customTimes,
    }));
    syncToBackend({ reminderFrequency: 'custom', reminderTime: customTimes[0] });
    setShowCustomModal(false);
    toast.success('Custom schedule saved! ✓');
  };

  const addCustomTime = () => {
    setCustomTimes([...customTimes, '12:00']);
  };

  const removeCustomTime = (index: number) => {
    setCustomTimes(customTimes.filter((_, i) => i !== index));
  };

  const updateCustomTime = (index: number, value: string) => {
    const updated = [...customTimes];
    updated[index] = value;
    setCustomTimes(updated);
  };

  const toggleAllergy = (allergy: string) => {
    const updated = settings.allergies.includes(allergy)
      ? settings.allergies.filter(a => a !== allergy)
      : [...settings.allergies, allergy];
    setSettings(prev => ({ ...prev, allergies: updated }));
    syncToBackend({ allergies: updated });
    toast.success('Settings saved! ✓');
  };

  const addCustomAllergy = () => {
    if (!newAllergy.trim()) return;
    const customAllergyList = settings.customAllergies || [];
    if (customAllergyList.includes(newAllergy.trim())) return;
    const updated = [...customAllergyList, newAllergy.trim()];
    setSettings(prev => ({ ...prev, customAllergies: updated }));
    syncToBackend({ customAllergies: updated });
    setNewAllergy('');
    toast.success('Allergy added! ✓');
  };

  const removeCustomAllergy = (allergy: string) => {
    const updated = (settings.customAllergies || []).filter(a => a !== allergy);
    setSettings(prev => ({ ...prev, customAllergies: updated }));
    syncToBackend({ customAllergies: updated });
    toast.success('Allergy removed! ✓');
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-8 px-4 lg:px-10 pt-6 w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-black text-foreground">Your preferences ⚙️</h1>
      </motion.div>

      <div className="mt-5 space-y-4">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 card-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-primary" size={22} />
              <div>
                <p className="font-display font-bold text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground font-display">We'll remind you to check in</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleNotification}
              className={`w-12 h-7 rounded-full relative transition-colors ${
                settings.notifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <motion.div
                animate={{ x: settings.notifications ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-card rounded-full absolute top-1 shadow"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 card-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="text-warning" size={22} />
            <p className="font-display font-bold text-foreground">Reminder Schedule</p>
          </div>
          <div className="flex gap-2">
            {frequencies.map(f => (
              <motion.button
                key={f.value}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFrequency(f.value)}
                className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-colors ${
                  settings.reminderFrequency === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {f.label}
              </motion.button>
            ))}
          </div>
          {settings.reminderFrequency === 'daily' && (
            <div className="mt-3 flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <input
                type="time"
                value={settings.reminderTime}
                onChange={e => {
                  setSettings(prev => ({ ...prev, reminderTime: e.target.value }));
                  syncToBackend({ reminderTime: e.target.value });
                  toast.success('Settings saved! ✓');
                }}
                className="bg-muted rounded-xl px-3 py-2 font-display font-semibold text-foreground text-sm border-none outline-none"
              />
            </div>
          )}
          {settings.reminderFrequency === 'custom' && settings.customReminderTimes && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground font-display mb-2">
                Custom times: {settings.customReminderTimes.join(', ')}
              </p>
              <button
                onClick={() => setShowCustomModal(true)}
                className="text-sm font-display font-bold text-primary"
              >
                Edit custom schedule
              </button>
            </div>
          )}
        </motion.div>

        {/* Allergies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 card-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <ShieldAlert className="text-primary" size={22} />
            <p className="font-display font-bold text-foreground">Allergies & Preferences</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {allergyOptions.map(allergy => {
              const active = settings.allergies.includes(allergy);
              return (
                <motion.button
                  key={allergy}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleAllergy(allergy)}
                  className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-colors ${
                    active
                      ? 'bg-secondary text-secondary-foreground ring-1 ring-primary/25'
                      : 'bg-muted text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {active && '✓ '}{allergy}
                </motion.button>
              );
            })}
          </div>
          {settings.customAllergies && settings.customAllergies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {settings.customAllergies.map(allergy => (
                <div
                  key={allergy}
                  className="px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground ring-1 ring-primary/25 font-display font-bold text-sm flex items-center gap-2"
                >
                  {allergy}
                  <button onClick={() => removeCustomAllergy(allergy)} className="hover:opacity-70">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add other allergy..."
              value={newAllergy}
              onChange={e => setNewAllergy(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomAllergy()}
              className="flex-1 bg-muted rounded-xl px-3 py-2 font-display font-semibold text-foreground text-sm border-none outline-none placeholder:text-muted-foreground"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={addCustomAllergy}
              className="bg-primary text-primary-foreground px-3 py-2 rounded-xl font-display font-bold text-sm"
            >
              Add
            </motion.button>
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-5 card-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <User className="text-accent" size={22} />
            <p className="font-display font-bold text-foreground">Account</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display font-black text-primary text-lg">FM</span>
            </div>
            <div>
              <p className="font-display font-bold text-foreground">FocusFuel User</p>
              <p className="text-xs text-muted-foreground font-display">Profile features coming soon ✨</p>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-5 card-shadow"
        >
          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-3 text-left">
              <MessageSquare className="text-muted-foreground" size={20} />
              <span className="font-display font-bold text-foreground text-sm">Send feedback</span>
            </button>
            <button className="flex items-center gap-3 text-left">
              <Star className="text-streak" size={20} />
              <span className="font-display font-bold text-foreground text-sm">Rate us</span>
            </button>
            <p className="text-xs text-muted-foreground font-display">FocusFuel v1.0.0</p>
          </div>
        </motion.div>
      </div>

      {/* Custom reminder modal */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setShowCustomModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card w-full max-w-sm rounded-3xl p-6 card-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-display font-black text-foreground">Custom Schedule</h3>
                <button onClick={() => setShowCustomModal(false)} className="text-muted-foreground p-1">
                  <X size={24} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground font-display mb-4">Set your reminder times</p>
              <div className="space-y-2 mb-4">
                {customTimes.map((time, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <input
                      type="time"
                      value={time}
                      onChange={e => updateCustomTime(i, e.target.value)}
                      className="flex-1 bg-muted rounded-xl px-3 py-2 font-display font-semibold text-foreground text-sm border-none outline-none"
                    />
                    {customTimes.length > 1 && (
                      <button
                        onClick={() => removeCustomTime(i)}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addCustomTime}
                className="w-full border-2 border-dashed border-muted-foreground/30 rounded-xl py-2 text-muted-foreground font-display font-bold text-sm mb-4 flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add another time
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={saveCustomTimes}
                className="w-full bg-primary text-primary-foreground font-display font-bold py-3 rounded-xl"
              >
                Save Schedule
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
