// =====================================================================
//  Player – hjälten. Går åt fyra håll, svingar svärd och kan ta skada.
// =====================================================================

// Hur svärdet placeras för varje riktning: förskjutning (dx, dy),
// rotation i grader och storlek på träffytan (w x h)
const SWORD_OFFSETS = {
  up:    { dx: 0,   dy: -13, angle: 0,   w: 8,  h: 14 },
  down:  { dx: 0,   dy: 13,  angle: 180, w: 8,  h: 14 },
  left:  { dx: -13, dy: 2,   angle: -90, w: 14, h: 8 },
  right: { dx: 13,  dy: 2,   angle: 90,  w: 14, h: 8 },
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-down-1');

    // Lägg till i scenen och ge sprite:n en fysikkropp
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Kollisionslådan täcker bara benen/kroppen – lättare att gå i trånga gångar
    this.body.setSize(10, 8).setOffset(3, 8);
    this.setCollideWorldBounds(true);

    // Egenskaper
    this.speed = 80;          // pixlar per sekund
    this.maxHealth = 6;       // 6 = tre hela hjärtan
    this.health = this.maxHealth;
    this.facing = 'down';     // 'up' | 'down' | 'left' | 'right'
    this.attacking = false;
    this.knockedBack = false;
    this.invulnerable = false;

    // Tangenter: piltangenter + WASD + mellanslag
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys('W,A,S,D,SPACE');

    // Svärdet: en bild (syns bara vid hugg) + en osynlig träffyta (zone)
    this.sword = scene.add.image(x, y, 'sword').setVisible(false);
    this.swordHitbox = scene.add.zone(x, y, 8, 14);
    scene.physics.add.existing(this.swordHitbox);
    this.swordHitbox.body.enable = false; // av tills vi hugger
    this.hitThisSwing = new Set();        // så samma slajm bara träffas en gång per hugg
  }

  update() {
    this.setDepth(this.y); // rita framför saker som står "ovanför" oss

    // Under knuff eller hugg styr vi inte själva
    if (this.knockedBack) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) && !this.attacking) {
      this.attack();
    }
    if (this.attacking) return;

    this.handleMovement();
  }

  handleMovement() {
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;

    let vx = 0;
    let vy = 0;

    // Bara fyra riktningar (som i gamla Zelda): sidled först, annars upp/ner
    if (left) { vx = -this.speed; this.facing = 'left'; }
    else if (right) { vx = this.speed; this.facing = 'right'; }
    else if (up) { vy = -this.speed; this.facing = 'up'; }
    else if (down) { vy = this.speed; this.facing = 'down'; }

    this.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      // Vänster och höger använder samma bilder, vänster är bara speglad
      const anim = this.facing === 'left' || this.facing === 'right' ? 'walk-side' : `walk-${this.facing}`;
      this.setFlipX(this.facing === 'left');
      this.anims.play(anim, true); // true = starta inte om om den redan spelas
    } else {
      this.showIdleFrame();
    }
  }

  // Stå still och titta åt rätt håll
  showIdleFrame() {
    this.anims.stop();
    const side = this.facing === 'left' || this.facing === 'right';
    this.setTexture(side ? 'hero-side-1' : `hero-${this.facing}-1`);
    this.setFlipX(this.facing === 'left');
  }

  attack() {
    this.attacking = true;
    this.setVelocity(0, 0);
    this.showIdleFrame();
    this.hitThisSwing.clear();

    const o = SWORD_OFFSETS[this.facing];
    const sx = this.x + o.dx;
    const sy = this.y + o.dy;

    // Visa svärdet. Uppåt ritas det bakom hjälten, annars framför.
    this.sword
      .setPosition(sx, sy)
      .setAngle(o.angle)
      .setDepth(this.facing === 'up' ? this.depth - 1 : this.depth + 1)
      .setVisible(true);

    // Flytta och slå på träffytan
    this.swordHitbox.setPosition(sx, sy).setSize(o.w, o.h);
    this.swordHitbox.body.setSize(o.w, o.h);
    this.swordHitbox.body.reset(sx, sy);
    this.swordHitbox.body.enable = true;

    // Efter 200 ms är hugget klart
    this.attackTimer = this.scene.time.delayedCall(200, () => this.endAttack());
  }

  endAttack() {
    if (this.attackTimer) this.attackTimer.remove();
    this.attacking = false;
    this.sword.setVisible(false);
    this.swordHitbox.body.enable = false;
  }

  // Anropas när svärdet överlappar en slajm
  swordHits(slime) {
    if (this.hitThisSwing.has(slime)) return;
    this.hitThisSwing.add(slime);
    slime.takeHit(this.x, this.y);
  }

  // Anropas när en fiende nuddar oss
  takeDamage(enemy) {
    if (this.invulnerable || this.scene.status !== 'playing') return;

    this.health = Math.max(0, this.health - 1);
    this.scene.registry.set('health', this.health);
    if (this.attacking) this.endAttack();

    // Knuff: flyg bort från fienden en kort stund
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.x, this.y);
    this.knockedBack = true;
    this.setVelocity(Math.cos(angle) * 180, Math.sin(angle) * 180);
    this.scene.time.delayedCall(150, () => {
      this.knockedBack = false;
      this.setVelocity(0, 0);
    });

    // Kort osårbarhet – blinka så att man ser det
    this.invulnerable = true;
    const blink = this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      duration: 80,
      yoyo: true,
      repeat: -1,
    });
    this.scene.time.delayedCall(1000, () => {
      blink.stop();
      this.setAlpha(1);
      this.invulnerable = false;
    });

    if (this.health <= 0) this.scene.onPlayerDied();
  }
}
