// =====================================================================
//  palette.js – vår begränsade "NES-palett"
//  Varje tecken i pixelritningarna (se sprites.js) motsvarar en färg.
//  '.' betyder genomskinlig pixel.
// =====================================================================
export const PALETTE = {
  K: 0x000000, // svart (konturer, ögon)
  W: 0xfcfcfc, // vit
  e: 0xbcbcbc, // ljusgrå
  E: 0x7c7c7c, // mörkgrå
  g: 0x58d854, // ljusgrön
  G: 0x00a800, // grön
  D: 0x005800, // mörkgrön
  s: 0xfca044, // hud (orange som på NES)
  b: 0xac7c00, // ljusbrun
  B: 0x503000, // mörkbrun
  y: 0xf8b800, // gul / guld
  r: 0xd82800, // röd
  c: 0x3cbcfc, // ljusblå
  u: 0x0058f8, // blå
  t: 0xfcd8a8, // sand
  T: 0xe0a870, // mörkare sand (prickar)
};
