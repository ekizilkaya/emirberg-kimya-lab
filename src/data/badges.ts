/** Ek G — Rozetler */
import type { Condition } from '../domain/types';

export interface Badge {
  id: string;
  nameTr: string;
  howTr: string;
  icon: string;
  condition: Condition;
}

export const BADGES: Badge[] = [
  { id: 'b01', nameTr: 'Çırak Kimyager', icon: '🧑‍🔬', howTr: 'Tanıtımı tamamla ya da ilk atomunu kur.',
    condition: { type: 'any', of: [{ type: 'tutorialDone' }, { type: 'atomsBuiltCount', min: 1 }] } },
  { id: 'b02', nameTr: 'Atom Mimarı', icon: '🏗️', howTr: '10 farklı elementin atomunu kur.',
    condition: { type: 'atomsBuiltCount', min: 10 } },
  { id: 'b03', nameTr: 'Atom Ustası', icon: '⚛️', howTr: 'İlk 36 elementin hepsinin atomunu kur.',
    condition: { type: 'atomsBuiltCount', min: 36, zMax: 36 } },
  { id: 'b04', nameTr: 'İyon Avcısı', icon: '⚡', howTr: '5 farklı iyon kur.',
    condition: { type: 'ionsBuiltCount', min: 5 } },
  { id: 'b05', nameTr: 'İzotop Dedektifi', icon: '🕵️', howTr: '3 farklı kararsız (radyoaktif) çekirdek kur.',
    condition: { type: 'unstableBuiltCount', min: 3 } },
  { id: 'b06', nameTr: 'Molekül Çırağı', icon: '🔗', howTr: '5 molekül keşfet.',
    condition: { type: 'moleculesFoundCount', min: 5 } },
  { id: 'b07', nameTr: 'Molekül Ustası', icon: '🧬', howTr: '15 molekül keşfet.',
    condition: { type: 'moleculesFoundCount', min: 15 } },
  { id: 'b08', nameTr: 'Molekül Profesörü', icon: '🏆', howTr: '27 molekülün hepsini keşfet.',
    condition: { type: 'moleculesFoundCount', min: 27 } },
  { id: 'b09', nameTr: 'Bağ Ustası', icon: '🤝', howTr: 'Tekli, çiftli ve üçlü bağ kur.',
    condition: { type: 'bondOrdersUsed', orders: [1, 2, 3] } },
  { id: 'b10', nameTr: 'Çılgın Kimyager', icon: '🤪', howTr: '10 tepkime keşfet.',
    condition: { type: 'reactionsFoundCount', min: 10 } },
  { id: 'b11', nameTr: 'Kazan Ustası', icon: '🧙', howTr: '30 tepkime keşfet.',
    condition: { type: 'reactionsFoundCount', min: 30 } },
  { id: 'b12', nameTr: 'Gökkuşağı Alevi', icon: '🌈', howTr: '7 alev renginin hepsini bul.',
    condition: { type: 'reactionsFoundCount', min: 7, filter: { tag: 'alev-testi' } } },
  { id: 'b13', nameTr: 'Ev Bilimcisi', icon: '🏠', howTr: '"Evde denenebilir" 5 deney keşfet.',
    condition: { type: 'reactionsFoundCount', min: 5, filter: { safety: 'evde' } } },
  { id: 'b14', nameTr: 'Meraklı Kedi', icon: '🐱', howTr: '"Tepkime yok" türünden 4 kayıt bul.',
    condition: { type: 'reactionsFoundCount', min: 4, filter: { kind: 'tepkime-yok' } } },
  { id: 'b15', nameTr: 'Buz ve Ateş', icon: '🔥', howTr: 'Sıcaklığı hem −273 °C’ye hem 6000 °C’ye getir.',
    condition: { type: 'all', of: [{ type: 'tempReached', atMost: -273 }, { type: 'tempReached', atLeast: 6000 }] } },
  { id: 'b16', nameTr: 'Hâl Ustası', icon: '🧊', howTr: '10 farklı elementin hâl değişimini izle.',
    condition: { type: 'phaseChangesCount', min: 10 } },
  { id: 'b17', nameTr: 'Aile Dostu', icon: '👨‍👩‍👧‍👦', howTr: 'Herhangi bir ailenin tüm üyelerini incele.',
    condition: { type: 'anyFamilyComplete' } },
  { id: 'b18', nameTr: 'Büyük Aile', icon: '🌳', howTr: '10 ailenin her birinden en az bir element incele.',
    condition: { type: 'familiesTouched', min: 10 } },
  { id: 'b19', nameTr: 'İlk 20 Şampiyonu', icon: '🥇', howTr: 'İlk 20 elementin hepsinde 3 yıldız topla.',
    condition: { type: 'elementStarsCount', min: 60, zMax: 20 } },
  { id: 'b20', nameTr: 'Koleksiyoncu', icon: '🗂️', howTr: '118 kartın hepsini incele.',
    condition: { type: 'elementsViewedCount', min: 118 } },
  { id: 'b21', nameTr: 'Görev Avcısı', icon: '🎯', howTr: '25 görev tamamla.',
    condition: { type: 'questsDoneCount', min: 25 } },
  { id: 'b22', nameTr: 'Baş Kimyager', icon: '👑', howTr: '"Baş Kimyager" unvanına ulaş.',
    condition: { type: 'rankReached', rank: 'bas-kimyager' } },
];

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
