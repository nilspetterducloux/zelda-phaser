// =====================================================================
//  Kulbjorn – en brun, hårig fiende som ser ut som två bollar i en säck.
//  Den vaggar framåt och studsar ibland. Tål 4 träffar från motorsågen.
// =====================================================================

// Kulbjörnen står sällan still. Den väljer ett håll och vaggar dit.
const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

export default class Kulbjorn extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'kulbjorn-1');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Hela säcken är kroppen, så träffytan är nästan hela spriten
    this.body.setSize(14, 12).setOffset(1, 3);
    this.setCollideWorldBounds(true);
    this.anims.play('kulbjorn-waddle');
    this.anims.setProgress(Math.random());

    this.hp = 4;
    this.speed = 24;          // långsammare än slajmen, den är tung
    this.hurt = false;
    this.moveTimer = 0;
    this.bounceTimer = Phaser.Math.Between(400, 900);
  }

  update(time, delta) {
    this.setDepth(this.y);
    if (this.hurt) return;

    this.moveTimer -= delta;
    this.bounceTimer -= delta;

    if (this.moveTimer <= 0 || this.body.blocked.left || this.body.blocked.right ||
        this.body.blocked.up || this.body.blocked.down) {
      this.pickDirection();
    }

    // Bollarna studsar i säcken: ett kort ryck framåt
    if (this.bounceTimer <= 0) {
      this.bounce();
    }
  }

  pickDirection() {
    const dir = Phaser.Utils.Array.GetRandom(DIRECTIONS);
    this.dirX = dir.x;
    this.dirY = dir.y;
    this.setVelocity(dir.x * this.speed, dir.y * this.speed);
    this.moveTimer = Phaser.Math.Between(900, 1800);
  }

  bounce() {
    this.bounceTimer = Phaser.Math.Between(900, 1500);
    const vx = this.dirX || 0;
    const vy = this.dirY || 0;
    this.setVelocity(vx * 88, vy * 88);
    this.scene.time.delayedCall(150, () => {
      if (!this.active || this.hurt) return;
      this.setVelocity(vx * this.speed, vy * this.speed);
    });
  }

  // Träffad av motorsågen. (fromX, fromY) = var hjälten står.
  takeHit(fromX, fromY) {
    if (this.hurt) return;
    this.hp -= 1;
    this.hurt = true;
    this.setTintFill(0xffffff);

    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    this.setVelocity(Math.cos(angle) * 120, Math.sin(angle) * 120);

    this.scene.time.delayedCall(140, () => {
      if (!this.active) return;
      this.clearTint();
      this.hurt = false;
      this.setVelocity(0, 0);
      if (this.hp <= 0) this.die();
    });
  }

  die() {
    const scene = this.scene;
    const puff = scene.add.image(this.x, this.y, 'puff').setDepth(this.y + 1);
    scene.tweens.add({
      targets: puff,
      scale: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => puff.destroy(),
    });
    this.destroy();
    scene.onEnemyKilled();
  }
}
