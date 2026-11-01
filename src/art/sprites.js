// =====================================================================
//  sprites.js – all grafik ritad som pixel-matriser (16x16 tecken)
//  Varje sträng är en rad, varje tecken en pixel. Färgerna finns i palette.js.
//  Testa att ändra ett tecken och ladda om sidan – då ser du direkt resultatet!
// =====================================================================

// ---------- HJÄLTEN (grön tunika, som en viss känd hjälte...) ----------
// Framifrån (går nedåt). Bilden är lite osymmetrisk – den speglade
// versionen blir andra steget i gånganimationen.
export const HERO_DOWN = [
  '................',
  '......GGGG......',
  '.....GGGGGG.....',
  '....GGGGGGGGG...',
  '....BssssssB.GG.',
  '....sKssssKs....',
  '....ssssssss....',
  '.....ssssss.....',
  '...GGGGGGGGGG...',
  '..sGGGbbbbGGGs..',
  '..sGGGGyyGGGGs..',
  '....GGGGGGGG....',
  '....GGGGGGGG....',
  '....BBB..BBB....',
  '.........BBB....',
  '................',
];

// Bakifrån (går uppåt)
export const HERO_UP = [
  '................',
  '......GGGG......',
  '.....GGGGGG.....',
  '....GGGGGGGGG...',
  '....GGGGGGGGGGG.',
  '....BBBBBBBB....',
  '....BBBBBBBB....',
  '.....BBBBBB.....',
  '...GGGGGGGGGG...',
  '..sGGGGGGGGGGs..',
  '..sGGGbbbbGGGs..',
  '....GGGGGGGG....',
  '....GGGGGGGG....',
  '....BBB..BBB....',
  '....BBB.........',
  '................',
];

// Från sidan (tittar åt höger). Vänster = samma bild speglad (flipX).
const HERO_SIDE_TOP = [
  '................',
  '.....GGGGG......',
  '....GGGGGGG.....',
  '...GGGGGGGGG....',
  '..GG.BBBssss....',
  '.G...BBsssKs....',
  '.....BBsssssss..',
  '......sssss.....',
  '.....GGGGGG.....',
  '.....GGGGsss....',
  '.....bbbbbb.....',
  '.....GGGGGG.....',
  '.....GGGGGG.....',
];
// Två olika benställningar = två steg i animationen
export const HERO_SIDE_1 = [...HERO_SIDE_TOP, '.....BB..BB.....', '....BB....BB....', '................'];
export const HERO_SIDE_2 = [...HERO_SIDE_TOP, '......BBBB......', '......BBBB......', '................'];

// ---------- SLAJM (två bildrutor: normal och hopklämd) ----------
export const SLIME_1 = [
  '................',
  '................',
  '................',
  '................',
  '......KKKK......',
  '....KKccccKK....',
  '...KcWWcccccK...',
  '..KcWWcccccccK..',
  '..KcccccccccuK..',
  '.KcccKcccKcccuK.',
  '.KcccKcccKccuuK.',
  '.KccccccccccuuK.',
  '.KcuccccccccuuK.',
  '..KuuuuuuuuuuK..',
  '...KKKKKKKKKK...',
  '................',
];
export const SLIME_2 = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....KKKKKK.....',
  '...KKccccccKK...',
  '..KcWWcccccccK..',
  '.KcWWcKcccKcccK.',
  '.KccccKcccKccuuK',
  'KccccccccccccuuK',
  'KcuccccccccccuuK',
  '.KuuuuuuuuuuuuK.',
  '..KKKKKKKKKKKK..',
  '................',
];

// ---------- SVÄRD (pekar uppåt – vi roterar det i koden) ----------
export const SWORD = [
  '.......W........',
  '......WeW.......',
  '......WeW.......',
  '......WeW.......',
  '......WeW.......',
  '......WeW.......',
  '......WeW.......',
  '......WeW.......',
  '....yyyyyyy.....',
  '.......b........',
  '.......b........',
  '.......y........',
  '................',
  '................',
  '................',
  '................',
];

// ---------- MARKRUTOR (tiles) ----------
export const SAND = [
  'tttttttttttttttt',
  'tttttttttTtttttt',
  'tttttttttttttttt',
  'ttTttttttttttttt',
  'tttttttttttttttt',
  'tttttttttttttTtt',
  'tttttttttttttttt',
  'tttttttTtttttttt',
  'tttttttttttttttt',
  'tttttttttttttttt',
  'tTtttttttttttttt',
  'ttttttttttttTttt',
  'tttttttttttttttt',
  'ttttttTttttttttt',
  'tttttttttttttttt',
  'tttttttttttttttt',
];

export const GRASS = [
  'tttttttttttttttt',
  'tttGttttttttGttt',
  'ttGtGttttttGtGtt',
  'tGtgtGttttGtgtGt',
  'tttttttttttttttt',
  'tttttttGtttttttt',
  'ttttttGtGttttttt',
  'tttttGtgtGtttttt',
  'tttttttttttttttt',
  'ttGttttttttttGtt',
  'tGtGttttttttGtGt',
  'GtgtGttttttGtgtG',
  'tttttttttttttttt',
  'tttttttttGtttttt',
  'ttttttttGtGttttt',
  'tttttttGtgtGtttt',
];

export const TREE = [
  '....DDDDDDDD....',
  '..DDGGGGGGGGDD..',
  '.DGGgGGGGGgGGGD.',
  '.DGgggGGGgggGGD.',
  'DGGGgGGGGGgGGGGD',
  'DGGGGGGgGGGGGgGD',
  'DGgGGGgggGGGgggD',
  'DGGGGGGgGGGGGgGD',
  '.DGGgGGGGGgGGGD.',
  '.DDGGGDDDDGGGDD.',
  '..DDDDbBBbDDDD..',
  '......bBBb......',
  '......bBBb......',
  '.....bbBBbb.....',
  '....DbBBBBbD....',
  '................',
];

export const ROCK = [
  '................',
  '....KKKKKKKK....',
  '...KeeWeeeeeK...',
  '..KeWWeeeeeeEK..',
  '.KeeWeeeeeeeEEK.',
  '.KeeeeeeeeeEEEK.',
  '.KeeeeeeeeEEEEK.',
  '.KEeeeeeeEEEEEK.',
  '.KEEeeeeEEEEEEK.',
  '.KEEEEEEEEEEEEK.',
  '..KEEEEEEEEEEK..',
  '...KKKKKKKKKK...',
  '................',
  '................',
  '................',
  '................',
];

const WATER_HALF = [
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uucccuuuuuuuuuuu',
  'ucuuucuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuucccuuuu',
  'uuuuuuuucuuucuuu',
  'uuuuuuuuuuuuuuuu',
];
export const WATER = [...WATER_HALF, ...WATER_HALF];

// ---------- HJÄRTAN (7x7) för livmätaren ----------
export const HEART_FULL = [
  '.rr.rr.',
  'rWrrrrr',
  'rrrrrrr',
  'rrrrrrr',
  '.rrrrr.',
  '..rrr..',
  '...r...',
];
export const HEART_HALF = [
  '.rr.EE.',
  'rWrr..E',
  'rrrr..E',
  'rrrr..E',
  '.rrr.E.',
  '..rrE..',
  '...r...',
];
export const HEART_EMPTY = [
  '.EE.EE.',
  'E..E..E',
  'E.....E',
  'E.....E',
  '.E...E.',
  '..E.E..',
  '...E...',
];

// ---------- "PUFF" när en fiende dör (8x8) ----------
export const PUFF = [
  '...W....',
  '.W.W.W..',
  '..WWW...',
  'WWWWWWW.',
  '..WWW...',
  '.W.W.W..',
  '...W....',
  '........',
];
