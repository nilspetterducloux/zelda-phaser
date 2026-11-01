// =====================================================================
//  overworld.js – Arvika som ett förlorat Zelda-rike.
//  Världen är 512×512 rutor (16×16 pixlar). Den är delad i 4×4 zoner.
//  Norr är uppåt, som på en karta. Läget följer det riktiga Arvika:
//
//    Graninge ligger i norr (berg och skog).
//    Taserud ligger i nordost.
//    Järnvägen och kyrkan ligger norr om Stora torget.
//    Ingestrand är västkusten mot Kyrkviken.
//    Dottevik är östra stranden, med hamn.
//    Själva staden sitter på vikens norra strand.
//    Kyrkviken fyller söder, med öar, vikar och en öppning mot syd.
//    Palmviken är åkrar vid sydöstra stranden.
//    Vik är skogen mellan stan och vildmarken.
//
//  En Arvikabo ska känna igen viken, torget, kyrkan, stationen
//  och hur stadsdelarna sitter mot varandra.
// =====================================================================
import { TILE, SOLID } from '../art/terrain.js';

export const WORLD = 512;
export const ZONE = 128;
const W = WORLD;

// Zonernas hörn. col 0 är väster, row 0 är norr.
function zone(col, row) {
  return { x: col * ZONE, y: row * ZONE, x1: (col + 1) * ZONE, y1: (row + 1) * ZONE };
}

const Z = {
  graningeN: zone(0, 0),
  graningeS: zone(1, 0),
  taserudN: zone(2, 0),
  taserudS: zone(3, 0),
  ingestrandN: zone(0, 1),
  railway: zone(1, 1),
  church: zone(2, 1),
  dottevikN: zone(3, 1),
  beach: zone(0, 2),
  city: zone(1, 2),
  vik: zone(2, 2),
  harbor: zone(3, 2),
  kyrkW: zone(0, 3),
  kyrkE: zone(1, 3),
  palm: zone(2, 3),
  wild: zone(3, 3),
};

function hash(x, y) {
  let n = (x * 374761393 + y * 668265263) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function ellipse(x, y, cx, cy, rx, ry) {
  const nx = (x - cx) / rx;
  const ny = (y - cy) / ry;
  return nx * nx + ny * ny <= 1;
}

// Kyrkviken: en lång vik som är smal vid staden och breddar sig söderut.
// Västra armen går upp mot Ingestrand. Östra armen är Dotteviks hamn.
function isKyrkviken(x, y) {
  // Inre hamn rakt söder om Stora torget. Viken är smal här.
  if (y >= 360 && y < 430) {
    const t = (y - 360) / 70;
    const half = 26 + t * 48;
    if (Math.abs(x - 190) < half) return true;
  }
  // Kyrkviken breddar sig söderut, som den riktiga viken mot Glafsfjorden.
  if (y >= 410 && y < 508) {
    const t = (y - 410) / 98;
    const half = 78 + t * 85;
    if (Math.abs(x - 185) < half) return true;
  }
  // Ingestrand: badet på västra stranden, ihop med samma vik.
  if (ellipse(x, y, 130, 348, 58, 42)) return true;
  // Dotteviks hamn hänger ihop med samma vik, på östra stranden.
  if (ellipse(x, y, 330, 400, 130, 42)) return true;
  if (ellipse(x, y, 448, 348, 46, 34)) return true;
  return false;
}

function inZone(zx, x, y) {
  return x >= zx.x && x < zx.x1 && y >= zx.y && y < zx.y1;
}

export function generateOverworld() {
  const g = new Uint8Array(W * W);
  g.fill(TILE.GRASS);

  const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= W ? 0 : g[y * W + x]);
  const set = (x, y, t) => {
    if (x < 0 || y < 0 || x >= W || y >= W) return;
    g[y * W + x] = t;
  };
  const fill = (x, y, w, h, t) => {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) set(xx, yy, t);
    }
  };
  const walk = (t) => !SOLID.has(t);

  // ---------- Mark efter stadsdel ----------
  const paintZone = (zx, tile) => {
    for (let y = zx.y; y < zx.y1; y++) {
      for (let x = zx.x; x < zx.x1; x++) set(x, y, tile);
    }
  };

  paintZone(Z.graningeS, TILE.FOREST);
  paintZone(Z.taserudN, TILE.FOREST);
  paintZone(Z.ingestrandN, TILE.FOREST);
  paintZone(Z.vik, TILE.FOREST);
  paintZone(Z.palm, TILE.FARM);
  paintZone(Z.wild, TILE.SWAMP);

  // Berg i norra Graninge, med en dal i mitten.
  for (let y = Z.graningeN.y; y < Z.graningeN.y1; y++) {
    for (let x = Z.graningeN.x; x < Z.graningeN.x1; x++) {
      const valley = Math.abs(x - 64) < 8 + (y % 5);
      if (!valley && hash(x, y) > 0.15) set(x, y, hash(x, y) > 0.82 ? TILE.PEAK : TILE.MOUNTAIN);
    }
  }
  // Hemlig stig genom berget.
  for (let y = 8; y < 120; y++) {
    set(62, y, TILE.SECRET);
    set(63, y, TILE.PATH);
    set(64, y, TILE.PATH);
    set(65, y, TILE.SECRET);
  }

  // Veteåkrar i Palmviken, i rutor så det ser odlat ut.
  for (let fy = 0; fy < 4; fy++) {
    for (let fx = 0; fx < 3; fx++) {
      fill(Z.palm.x + 16 + fx * 36, Z.palm.y + 24 + fy * 28, 22, 16, TILE.WHEAT);
    }
  }

  // ---------- Kyrkviken ----------
  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      if (!isKyrkviken(x, y)) continue;
      const deep = y > 450 || ellipse(x, y, 175, 470, 70, 30);
      set(x, y, deep ? TILE.WATER_DEEP : TILE.WATER);
    }
  }

  // Öar i viken. Små, så farleden runt dem syns.
  const islands = [
    [150, 450, 10, 7],
    [210, 470, 8, 6],
    [120, 490, 7, 5],
    [250, 440, 6, 4],
  ];
  for (const [cx, cy, rx, ry] of islands) {
    for (let y = cy - ry - 1; y <= cy + ry + 1; y++) {
      for (let x = cx - rx - 1; x <= cx + rx + 1; x++) {
        if (ellipse(x, y, cx, cy, rx, ry)) set(x, y, hash(x, y) > 0.7 ? TILE.TREE : TILE.GRASS);
        else if (ellipse(x, y, cx, cy, rx + 1, ry + 1) && get(x, y) === TILE.WATER) set(x, y, TILE.SAND);
      }
    }
  }
  // Ruin på den största ön.
  fill(146, 446, 4, 3, TILE.RUINS);

  // Sand där land möter vatten, framför allt vid Ingestrand.
  for (let y = 1; y < W - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const t = get(x, y);
      if (t === TILE.WATER || t === TILE.WATER_DEEP || SOLID.has(t)) continue;
      let shore = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const n = get(x + dx, y + dy);
        if (n === TILE.WATER || n === TILE.WATER_DEEP) shore = true;
      }
      if (!shore) continue;
      if (inZone(Z.beach, x, y) || inZone(Z.kyrkW, x, y) || inZone(Z.harbor, x, y) || inZone(Z.kyrkE, x, y)) {
        set(x, y, TILE.SAND);
      }
    }
  }

  // ---------- Vägar, ungefär som stadens riktiga stråk ----------
  const line = (x0, y0, x1, y1, tile, width) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / steps);
      const y = Math.round(y0 + ((y1 - y0) * i) / steps);
      for (let oy = -width; oy <= width; oy++) {
        for (let ox = -width; ox <= width; ox++) {
          const cur = get(x + ox, y + oy);
          if (cur === TILE.WATER || cur === TILE.WATER_DEEP || cur === TILE.SWAMP_WATER) {
            set(x + ox, y + oy, TILE.BRIDGE);
          } else if (!SOLID.has(cur) || cur === TILE.TREE || cur === TILE.FENCE) {
            set(x + ox, y + oy, tile);
          }
        }
      }
    }
  };

  // Järnvägen går öst–väst norr om torget, som i verkligheten.
  line(40, 200, 470, 200, TILE.RAIL, 0);
  // Stationsplan.
  fill(168, 206, 40, 8, TILE.ROAD);
  fill(172, 188, 28, 10, TILE.STATION);

  // Storgatan genom stan, från Ingestrand till kyrkan.
  line(70, 312, 360, 300, TILE.ROAD, 1);
  // Vägen norrut från torget upp till stationen.
  line(184, 312, 184, 214, TILE.ROAD, 1);
  // Kyrkvägen, upp till Trefaldighetskyrkan.
  line(220, 308, 310, 214, TILE.ROAD, 1);
  // Till Taserud och Graninge.
  line(184, 214, 120, 70, TILE.PATH, 0);
  line(250, 250, 400, 80, TILE.PATH, 0);
  line(400, 140, 450, 70, TILE.ROAD, 1);
  // Mot Dotteviks hamn (österut, längs vattnet).
  line(300, 300, 450, 330, TILE.ROAD, 1);
  // Ner mot Ingestrands bad.
  line(100, 300, 70, 330, TILE.PATH, 0);
  // Söderut över en bro till Vik, Palmviken och vildmarken.
  line(200, 340, 200, 470, TILE.ROAD, 1);
  line(200, 450, 340, 450, TILE.ROAD, 1);
  line(340, 450, 450, 470, TILE.PATH, 0);
  // Jägarstigar i södra Graninge och Ingestrand.
  line(90, 90, 160, 150, TILE.PATH, 0);
  line(40, 180, 100, 280, TILE.PATH, 0);

  // ---------- Stora torget ----------
  // Ett öppet torg med butiker runt kanten. Helten startar här.
  // Lagom stort så att husen runt torget syns på skärmen.
  const torget = { x: 172, y: 300, w: 18, h: 12 };
  fill(torget.x, torget.y, torget.w, torget.h, TILE.PLAZA);
  // Fontän i mitten. Den är bara en markering, så man kan gå över den.
  fill(torget.x + 8, torget.y + 5, 2, 2, TILE.FLOWERS);
  // Butiker på norra och södra sidan, med en öppning emellan.
  for (let i = 0; i < 2; i++) {
    const x = torget.x + 1 + i * 10;
    fill(x, torget.y - 6, 7, 3, TILE.ROOF_RED);
    fill(x, torget.y - 3, 7, 3, TILE.SHOP);
    fill(x, torget.y + torget.h, 7, 3, TILE.WALL);
    fill(x, torget.y + torget.h + 3, 7, 3, TILE.ROOF_BLUE);
  }

  const house = (x, y, roof) => {
    fill(x, y, 6, 2, roof);
    fill(x, y + 2, 6, 4, TILE.WALL);
  };

  // Kvarter längs Storgatan, väster och öster om torget.
  for (let i = 0; i < 5; i++) house(128 + i * 8, 276, i % 2 ? TILE.ROOF_RED : TILE.ROOF_BLUE);
  for (let i = 0; i < 4; i++) house(220 + i * 10, 276, TILE.ROOF_RED);
  for (let i = 0; i < 3; i++) house(128, 330 + i * 10, TILE.ROOF_BLUE);

  // ---------- Kyrkan och slottet ----------
  // Trefaldighetskyrkan: ett stort tempel med torn, norr om torget.
  fill(292, 188, 28, 6, TILE.CASTLE);
  fill(300, 194, 12, 16, TILE.CHURCH);
  fill(288, 206, 36, 10, TILE.CASTLE);
  fill(286, 214, 40, 4, TILE.PLAZA);
  // Adelskvarter runt kyrkan.
  for (let i = 0; i < 3; i++) house(260 + i * 12, 168, TILE.ROOF_BLUE);
  for (let i = 0; i < 3; i++) house(340 + i * 12, 176, TILE.ROOF_RED);
  fill(268, 230, 20, 8, TILE.GARDEN);
  fill(340, 224, 24, 10, TILE.GARDEN);

  // ---------- Taserud: hantverkare och guildhallar ----------
  for (let i = 0; i < 6; i++) house(400 + (i % 3) * 14, 70 + Math.floor(i / 3) * 16, TILE.ROOF_RED);
  for (let i = 0; i < 4; i++) house(430, 40 + i * 12, TILE.SHOP);
  fill(470, 48, 18, 12, TILE.CASTLE); // stor guildhall

  // ---------- Dottevik: magasin, verkstäder, smuggelgömma ----------
  for (let i = 0; i < 5; i++) {
    fill(400 + (i % 3) * 18, 150 + Math.floor(i / 3) * 16, 14, 10, TILE.WAREHOUSE);
  }
  fill(460, 180, 10, 8, TILE.CAVE); // gömd ingång mellan magasin
  // Hamn: bryggor, fartyg, fyr.
  for (let i = 0; i < 4; i++) fill(400 + i * 10, 360, 6, 14, TILE.DOCK);
  fill(418, 378, 1, 1, TILE.SHIP);
  fill(448, 372, 1, 1, TILE.SHIP);
  fill(470, 340, 1, 1, TILE.LIGHTHOUSE);
  house(480, 300, TILE.ROOF_RED);

  // ---------- Ingestrand: bad, bryggor, fiskelägen ----------
  for (let i = 0; i < 3; i++) fill(48 + i * 10, 300, 4, 10, TILE.DOCK);
  for (let i = 0; i < 4; i++) house(24 + i * 10, 270, TILE.HUT);
  fill(30, 300, 1, 1, TILE.SHIP);
  // Utsiktsplats på höjden norr om badet.
  fill(40, 160, 8, 6, TILE.PLAZA);
  fill(42, 150, 4, 4, TILE.ROCK);

  // ---------- Graninge: jaktstugor, gruva, grotta ----------
  for (let i = 0; i < 3; i++) house(150 + i * 12, 40, TILE.HUT);
  fill(48, 40, 8, 6, TILE.MINE);
  fill(90, 100, 6, 5, TILE.CAVE);
  fill(40, 70, 6, 5, TILE.CAVE);

  // ---------- Taserudsskogen: ruiner och gläntor ----------
  fill(300, 36, 10, 8, TILE.RUINS);
  fill(340, 70, 8, 6, TILE.RUINS);
  fill(280, 80, 14, 10, TILE.FLOWERS);
  fill(360, 30, 6, 5, TILE.CAVE);

  // ---------- Vik: skogsbryn, en stig och ett par hus ----------
  for (let i = 0; i < 3; i++) house(280 + i * 14, 300, TILE.HUT);
  fill(330, 340, 8, 6, TILE.RUINS);

  // ---------- Palmviken: kvarnar, gårdar, trädgårdar ----------
  fill(300, 420, 1, 1, TILE.WINDMILL);
  fill(360, 430, 1, 1, TILE.WINDMILL);
  fill(420, 400, 1, 1, TILE.WINDMILL);
  for (let i = 0; i < 4; i++) house(290 + i * 16, 470, TILE.HUT);
  fill(400, 460, 16, 12, TILE.GARDEN);
  fill(330, 490, 12, 8, TILE.GARDEN);

  // ---------- Södra vildmarken: träsktempel och slutgrotta ----------
  fill(430, 430, 16, 12, TILE.DUNGEON);
  fill(470, 480, 10, 8, TILE.DUNGEON);
  fill(400, 470, 8, 6, TILE.RUINS);
  for (let i = 0; i < 6; i++) {
    const x = 410 + Math.floor(hash(i, 3) * 80);
    const y = 400 + Math.floor(hash(i, 9) * 90);
    if (get(x, y) === TILE.SWAMP) set(x, y, TILE.SWAMP_WATER);
  }

  // Brygga ut till den största ön, som en båtled man kan gå.
  line(200, 450, 156, 450, TILE.DOCK, 0);

  // Fiskelägen på östra vikstranden.
  for (let i = 0; i < 3; i++) house(230 + i * 12, 430, TILE.HUT);
  fill(250, 448, 4, 8, TILE.DOCK);

  // ---------- Träd i skogszonerna, men inte på vägar ----------
  const forestZones = [Z.graningeS, Z.taserudN, Z.ingestrandN, Z.vik];
  for (const zx of forestZones) {
    for (let y = zx.y + 2; y < zx.y1 - 2; y += 2) {
      for (let x = zx.x + 2; x < zx.x1 - 2; x += 2) {
        const cur = get(x, y);
        if (cur !== TILE.FOREST && cur !== TILE.GRASS) continue;
        if (hash(x, y) > 0.45) set(x, y, TILE.TREE);
      }
    }
  }
  // Enstaka träd i Graninges dal och runt stan, så det inte blir kalt.
  for (let y = 2; y < W - 2; y += 3) {
    for (let x = 2; x < W - 2; x += 3) {
      if (get(x, y) === TILE.GRASS && hash(x, y) > 0.92) set(x, y, TILE.TREE);
      if (get(x, y) === TILE.GRASS && hash(x, 1000 + y) > 0.97) set(x, y, TILE.FLOWERS);
      if (get(x, y) === TILE.GRASS && hash(y, x) > 0.9) set(x, y, TILE.GRASS_ALT);
    }
  }

  // Stenar längs bergets fot.
  for (let x = 8; x < 120; x += 7) {
    if (get(x, 118) === TILE.GRASS || get(x, 118) === TILE.FOREST) set(x, 118, TILE.ROCK);
  }

  // ---------- Spelstart och fiender ----------
  // Start på Stora torget, mitten av fontänen.
  const playerTile = nearestWalk(get, walk, 180, 305);

  const wanted = [
    ['slime', 70, 60],
    ['slime', 150, 90],
    ['slime', 320, 50],
    ['slime', 40, 200],
    ['slime', 300, 340],
    ['slime', 450, 450],
    ['kul', 80, 80],
    ['kul', 40, 240],
    ['kul', 420, 160],
    ['kul', 460, 460],
  ];
  const spawns = wanted.map(([type, x, y]) => {
    const spot = nearestWalk(get, walk, x, y);
    return { type, x: spot.x * 16 + 8, y: spot.y * 16 + 8 };
  });

  return {
    tiles: g,
    width: W,
    height: W,
    player: { x: playerTile.x * 16 + 8, y: playerTile.y * 16 + 8 },
    spawns,
  };
}

function nearestWalk(get, walk, x, y) {
  if (walk(get(x, y))) return { x, y };
  for (let r = 1; r < 16; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (walk(get(x + dx, y + dy))) return { x: x + dx, y: y + dy };
      }
    }
  }
  return { x, y };
}

export function overworldRows(tiles) {
  const rows = new Array(W);
  for (let y = 0; y < W; y++) {
    const row = new Array(W);
    for (let x = 0; x < W; x++) row[x] = tiles[y * W + x];
    rows[y] = row;
  }
  return rows;
}
