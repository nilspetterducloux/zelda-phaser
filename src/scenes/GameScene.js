// =====================================================================
//  GameScene – själva spelvärlden: karta, hjälte, fiender och kollisioner
// =====================================================================
import Player from '../entities/Player.js?v=4';
import Slime from '../entities/Slime.js?v=4';
import Kulbjorn from '../entities/Kulbjorn.js?v=4';
import { generateOverworld, overworldRows, WORLD } from '../data/overworld.js?v=4';
import { SOLID } from '../art/terrain.js?v=4';

const HUD_HEIGHT = 16; // höjden på den svarta HUD-listan överst (pixlar)

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // "status" kan vara 'playing', 'gameover' eller 'won'
    this.status = 'playing';

    // ---------- 1. Den stora kartan över Arvika ----------
    const world = generateOverworld();
    const worldWidth = WORLD * 16;
    const worldHeight = WORLD * 16;
    const map = this.make.tilemap({
      data: overworldRows(world.tiles),
      tileWidth: 16,
      tileHeight: 16,
    });
    const tileset = map.addTilesetImage('terrain', 'terrain', 16, 16, 0, 0, 0);
    const ground = map.createLayer(0, tileset, 0, 0);
    ground.setDepth(0);
    // Vatten, berg, hus och träd går inte att gå igenom.
    ground.setCollision([...SOLID]);

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // ---------- 2. Hjälten, mitt på Stora torget ----------
    this.player = new Player(this, world.player.x, world.player.y);

    // ---------- 3. Fiender ute i markerna ----------
    this.enemies = this.physics.add.group({ runChildUpdate: true });
    world.spawns.forEach((spot) => {
      const Enemy = spot.type === 'kul' ? Kulbjorn : Slime;
      this.enemies.add(new Enemy(this, spot.x, spot.y));
    });

    // ---------- 4. Kollisioner ----------
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.enemies, ground);
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
