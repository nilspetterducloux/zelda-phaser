// =====================================================================
//  sprites.js – all grafik ritad som pixel-matriser (16x16 tecken)
//  Varje sträng är en rad, varje tecken en pixel. Färgerna finns i palette.js.
//  Testa att ändra ett tecken och ladda om sidan – då ser du direkt resultatet!
// =====================================================================

// ---------- HJÄLTEN (bar överkropp, bara kalsonger, ingen mössa) ----------
// Framifrån (går nedåt). Mustasch, rosa kinder och randiga kalsonger.
// Bilden är lite osymmetrisk – den speglade versionen blir andra steget.
export const HERO_DOWN = [
  '................',
  '.....KKKKK......',
  '....KBBBBBK.....',
  '...KsWKssKWsK...',
  '...KssssssssK...',
  '...KspKKKKpsK...',
  '....KssssssK....',
  '......ssss......',
  '..Ks.ssssss.sK..',
  '.Kss.ssnnss.ssK.',
  '.Ks.sssssss.sK..',
  '..KWWWWWWWWWK...',
  '...WrWrWrWrWr...',
  '...WWWWWWWWWW...',
  '....ss....sss...',
  '...KsK....KsK...',
];

// Bakifrån (går uppåt): hår, nacke, bar rygg och kalsongerna bakifrån
export const HERO_UP = [
  '................',
  '.....KKKKK......',
  '....KBBBBBK.....',
  '...KBBBBBBBBK...',
  '..KsBBBBBBBBsK..',
  '..KBBBBBBBBBBK..',
  '...KBBBBBBBBK...',
  '......ssss......',
  '..Ks.ssssss.sK..',
  '.Kss.ssssss.ssK.',
  '.Ks.sssssss.sK..',
  '..KWWWWWWWWWK...',
  '...WrWrWrWrWr...',
  '...WWWWWWWWWW...',
  '...sss....ss....',
  '...KsK....KsK...',
];

// Från sidan (tittar åt höger). Näsan pekar åt höger så man ser riktningen.
// Vänster = samma bild speglad (flipX).
const HERO_SIDE_TOP = [
  '................',
  '....KKKKK.......',
  '...KBBBBBK......',
  '..KBsWsssK......',
  '.KBsssssssK.....',
  '..KBssssssK.....',
  '...KsrrssK......',
  '....KsssK.......',
  '....KsssK.......',
  '...KsssssK......',
  '..KssnnsssK.....',
  '..KssssssK......',
  '..KWWWWWWK......',
  '...WrWrWWK......',
];
// Två olika benställningar = två steg i animationen
export const HERO_SIDE_1 = [...HERO_SIDE_TOP, '..Ks....Ks......', '..KK....KK......'];
export const HERO_SIDE_2 = [...HERO_SIDE_TOP, '...KssK.........', '...KKKK.........'];

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

// ---------- KULBJÖRN ----------
// Två orange bollar i en säck som är knuten upptill, med stora ögon.
// 24x32 pixlar så ögonen syns. Andra rutan blinkar med ena ögat.
export const KULBJORN_1 = [
  '...........KK...........',
  '...........WK...........',
  '..........KjqK..........',
  '..........KqqK..........',
  '..........KqjK..........',
  '..........KqqK..........',
  '.........KqjqQK.........',
  '.........KqqqQK.........',
  '.........KjqjQK.........',
  '........KqqqqQQK........',
  '........KjqjqQQK........',
  '........KqqqqQQK........',
  '.......KjqjqjQQQK..K....',
  '.......KqqqnnQQQK.......',
  '.......KqjqnnQQQK.......',
  '......KQqqqnQQQQQK......',
  '.K..KKQQjqjnQQQQQK....K.',
  '...KQQQWqqqnQQQQQqKK....',
  '..KQQWWWWWqnQQQQWjqjK...',
  '.KQQWeWWWWWnQQWWWWWqqK..',
  'KKQQWWWKKWWnQWeWWWWWjK..',
  '.KQWWWKKKWWWQWWWKKWWqqKK',
  '.KqjWWWKKWWnWWWKKKWWWjK.',
  '.KqqWWWWWWWnnWWWKKWWqqK.',
  '.KjqjWWWWWjnnWWWWWWWjqK.',
  '.KqqNqqWqqqnnnWWWWWNqqK.',
  '..KNNNNNNNNNnnqjWjNjqK..',
  '...KNNNNNNNKNNNNNNNNK.K.',
  '..K.KKKKKKK.KKNNNNNK....',
  '..............KKKKK....K',
  '........................',
  '.....K....K...K.....K...',
];
export const KULBJORN_2 = [
  '...........KK...........',
  '...........WK...........',
  '..........KjqK..........',
  '..........KqqK..........',
  '..........KqjK..........',
  '..........KqqK..........',
  '.........KqjqQK.........',
  '.........KqqqQK.........',
  '.........KjqjQK.........',
  '........KqqqqQQK........',
  '........KjqjqQQK........',
  '........KqqqqQQK........',
  '.......KjqjqjQQQK..K....',
  '.......KqqqnnQQQK.......',
  '.......KqjqnnQQQK.......',
  '......KQqqqnQQQQQK......',
  '.K..KKQQjqjnQQQQQK....K.',
  '...KQQQQqqqnQQQQQqKK....',
  '..KQQQQQqjqnQQQQWjqjK...',
  '.KQQQQQQqqqnQQWWWWWqqK..',
  'KKQQQQQQjqjnQWeWWWWWjK..',
  '.KQQKKKKKKKnQWWWKKWWqqKK',
  '.KqjqjqjqjqnWWWKKKWWWjK.',
  '.KqqqqqqqqqnnWWWKKWWqqK.',
  '.KjqjqjqjqjnnWWWWWWWjqK.',
  '.KqqNqqqqqqnnnWWWWWNqqK.',
  '..KNNNNNNNNNnnqjWjNjqK..',
  '...KNNNNNNNKNNNNNNNNK.K.',
  '..K.KKKKKKK.KKNNNNNK....',
  '..............KKKKK....K',
  '........................',
  '.....K....K...K.....K...',
];

// ---------- MOTORSÅG (pekar uppåt – vi roterar den i koden) ----------
// Stången med kedjan är överst, den orange motorn under.
// Två bildrutor: tänderna på kedjan hoppar ett steg så att sågen ser ut att gå.
export const CHAINSAW_1 = [
  '.......KK.......',
  '......KeWK......',
  '.....K.eW.K.....',
  '......KeWK......',
  '.....K.We.K.....',
  '......KWeK......',
  '.....K.eW.K.....',
  '......KeWK......',
  '......KWWK......',
  '....KKKKKKKK....',
  '...KooyyyyoK....',
  '..KooyyKyyyoK...',
  '...KooyyyyoK....',
  '....KooooooK....',
  '.....KbbbbK.....',
  '......KKKK......',
];
export const CHAINSAW_2 = [
  '.......KK.......',
  '......KWeK......',
  '.....K.We.K.....',
  '......KWeK......',
  '.....K.eW.K.....',
  '......KeWK......',
  '.....K.We.K.....',
  '......KWeK......',
  '......KWWK......',
  '....KKKKKKKK....',
  '...KooyyyyoK....',
  '..KooyyKyyyoK...',
  '...KooyyyyoK....',
  '....KooooooK....',
  '.....KbbbbK.....',
  '......KKKK......',
];

// Liten gnista / flisa som flyger från kedjan (3x3)
export const SPARK = [
  '.y.',
  'yWy',
  '.y.',
];
export const CHIP = [
  '.e.',
  'eEe',
  '.b.',
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
