// =====================================================================
//  map.js – själva världen, ritad med tecken
//  Varje tecken är en ruta på 16x16 pixlar. Kartan är 40x30 rutor,
//  alltså mycket större än skärmen – kameran följer hjälten.
//
//   .  sand (går att gå på)       ,  gräs (går att gå på)
//   T  träd (vägg)                R  sten (vägg)
//   W  vatten (vägg)              P  hjältens startplats
//   S  en slajm startar här          C  en kulbjörn startar här
//
//  Rita gärna om kartan! Alla rader bör vara lika långa.
// =====================================================================
export const TILE_SIZE = 16;

export const MAP = [
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'T......,,,.........TT........,,,.......T',
  'T..P...,,,....R....TT........,,,.......T',
  'T.............R..............,,,..RR...T',
  'T....TT...........................RR...T',
  'T....TT.....,,,,........WWWW...........T',
  'T...........,,,,.......WWWWWW.....S....T',
  'T..R...................WWWWWW..........T',
  'T..R...C...TTT..........WWWW....TT.....T',
  'T..........TTT..................TT.....T',
  'T.....,,,,.......................,,....T',
  'T.....,,,,....S........RRR.......,,....T',
  'TTTT......................R..........TTT',
  'T..........TT.............R............T',
  'T..........TT....,,,,..................T',
  'T.....C..........,,,,......TTTT........T',
  'T...RR.......................TT........T',
  'T...RR.....WWW..........S..............T',
  'T.........WWWWW........................T',
  'T.........WWWWW.......,,,.......RR.....T',
  'T..TT......WWW........,,,.......RR.....T',
  'T..TT.................,,,..............T',
  'T.......,,,.........TT.........TT......T',
  'T.......,,,.........TT.........TT......T',
  'T...............S......................T',
  'T....RRR...............,,,,............T',
  'T....................TT,,,,............T',
  'T..,,,.......TT............RR..........T',
  'T..,,,.......TT............RR..........T',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
];

// Vilka tecken som är väggar, och vilken textur de ska ha
export const WALL_TILES = { T: 'tree', R: 'rock', W: 'water' };
