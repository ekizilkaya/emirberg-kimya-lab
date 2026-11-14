/** Ayarlanabilir oyun sabitleri (SPEC 11.5) */

export const KP = {
  star: 1,
  molecule: 5,
  reaction: 3,
  quest: 5,
  questAdvanced: 8,
  badge: 10,
};

export type RankId = 'cirak' | 'kalfa' | 'usta' | 'profesor' | 'bas-kimyager';

export const RANKS: { id: RankId; nameTr: string; minKp: number; icon: string }[] = [
  { id: 'cirak', nameTr: 'Çırak', minKp: 0, icon: '🧑‍🔬' },
  { id: 'kalfa', nameTr: 'Kalfa', minKp: 60, icon: '⚗️' },
  { id: 'usta', nameTr: 'Usta', minKp: 180, icon: '🔬' },
  { id: 'profesor', nameTr: 'Profesör', minKp: 380, icon: '🎓' },
  { id: 'bas-kimyager', nameTr: 'Baş Kimyager', minKp: 650, icon: '👑' },
];

export const LIMITS = {
  protonMax: 36,
  neutronMax: 60,
  electronMax: 40,
  benchAtomsMax: 16,
  activeQuests: 3,
  nameMaxLength: 16,
};

export const TEMP = { min: -273, max: 6000 };

export const STORAGE_KEY = 'emirberg-kimya-lab:save';
export const STORAGE_BACKUP_KEY = 'emirberg-kimya-lab:save-bozuk-yedek';
