// =====================================================================
//  GameScene – själva spelvärlden: karta, hjälte, fiender och kollisioner
// =====================================================================
import { MAP, TILE_SIZE, WALL_TILES } from '../data/map.js?v=3';
import Player from '../entities/Player.js?v=3';
import Slime from '../entities/Slime.js?v=3';
import Kulbjorn from '../entities/Kulbjorn.js?v=3';

const HUD_HEIGHT = 16; // höjden på den svarta HUD-listan överst (pixlar)

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // "status" kan vara 'playing', 'gameover' eller 'won'
    this.status = 'playing';

    // ---------- 1. Bygg kartan ----------
    // Gör om kartans strängar till en 2D-array: grid[rad][kolumn]
    this.grid = MAP.map((row) => row.split(''));
    const rows = this.grid.length;
    const cols = Math.max(...MAP.map((r) => r.length));
    const worldWidth = cols * TILE_SIZE;
    const worldHeight = rows * TILE_SIZE;

    // En statisk fysikgrupp för väggar – de rör sig aldrig
    this.walls = this.physics.add.staticGroup();

    let playerStart = { x: 64, y: 64 };
    const slimeStarts = [];
    const kulStarts = [];

    this.grid.forEach((row, ty) => {
      row.forEach((char, tx) => {
        // Mitten av rutan i pixlar
        const x = tx * TILE_SIZE + TILE_SIZE / 2;
        const y = ty * TILE_SIZE + TILE_SIZE / 2;

        // Marken ritas under allt (gräs eller sand)
        const groundKey = char === ',' ? 'grass' : 'sand';
        this.add.image(x, y, groundKey).setDepth(-1000);

        if (WALL_TILES[char]) {
          // En vägg: bild + statisk kollisionskropp
          const wall = this.walls.create(x, y, WALL_TILES[char]);
          wall.setDepth(y); // djup efter y-led så att saker hamnar bakom/framför rätt
        } else if (char === 'P') {
          playerStart = { x, y };
        } else if (char === 'S') {
          slimeStarts.push({ x, y });
        } else if (char === 'C') {
          kulStarts.push({ x, y });
        }
      });
    });

    // Världens kanter = kartans kanter
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // ---------- 2. Hjälten ----------
    this.player = new Player(this, playerStart.x, playerStart.y);

    // ---------- 3. Fiender ----------
    // runChildUpdate: true gör att varje fiendes update() anropas automatiskt
    this.enemies = this.physics.add.group({ runChildUpdate: true });
    slimeStarts.forEach((pos) => this.enemies.add(new Slime(this, pos.x, pos.y)));
    kulStarts.forEach((pos) => this.enemies.add(new Kulbjorn(this, pos.x, pos.y)));

    // ---------- 4. Kollisioner ----------
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);
    // En fiende som nuddar hjälten skadar honom
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      player.takeDamage(enemy);
    });
    // Motorsågens träffyta skadar fienden så länge den är igång och rör vid den
    this.physics.add.overlap(this.player.sawHitbox, this.enemies, (hitbox, enemy) => {
      this.player.sawHits(enemy);
    });

    // ---------- 5. Kamera ----------
    // Kamerans "fönster" börjar under HUD-listan
    this.cameras.main.setViewport(0, HUD_HEIGHT, this.scale.width, this.scale.height - HUD_HEIGHT);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true);

    // ---------- 6. Data till HUD:en ----------
    // registry är ett delat "anteckningsblock" som alla scener kan läsa
    this.registry.set('maxHealth', this.player.maxHealth);
    this.registry.set('health', this.player.health);
    this.registry.set('enemiesLeft', this.enemies.countActive());
    this.registry.set('status', this.status);

    // Starta HUD-scenen ovanpå spelet
    this.scene.launch('UIScene');

    // R = starta om (fungerar efter game over eller vinst)
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update(time, delta) {
    if (this.status !== 'playing') {
      if (Phaser.Input.Keyboard.JustDown(this.keyR)) this.restartGame();
      return;
    }
    this.player.update(time, delta);
  }

  // Anropas när en slajm eller kulbjörn dör
  onEnemyKilled() {
    const left = this.enemies.countActive();
    this.registry.set('enemiesLeft', left);
    if (left === 0) this.endGame('won');
  }

  // Anropas av Player när livet tar slut
  onPlayerDied() {
    this.endGame('gameover');
  }

  endGame(status) {
    this.status = status;
    this.registry.set('status', status);
    this.physics.pause(); // frys all rörelse
    this.player.anims.stop();
    this.player.stopSaw(); // så att brummandet inte ligger kvar efter slut
    if (status === 'gameover') this.player.setTint(0x7c7c7c);
  }

  restartGame() {
    this.scene.stop('UIScene');
    this.scene.restart();
  }
}
