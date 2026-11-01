// =====================================================================
//  Slime – en enkel fiende som vandrar runt slumpmässigt.
//  Tål 3 träffar från motorsågen och knuffas bakåt när den träffas.
// =====================================================================

// Möjliga riktningar: stå still, höger, vänster, ner, upp
const DIRECTIONS = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

export default class Slime extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'slime-1');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(12, 10).setOffset(2, 5);
    this.setCollideWorldBounds(true);
    this.anims.play('slime-wobble');
    // Börja på olika bildruta så att alla inte gungar i takt
    this.anims.setProgress(Math.random());

    this.hp = 3;
    this.speed = 30;
    this.hurt = false;
    this.moveTimer = 0; // när den når 0 väljer vi en ny riktning
  }

  // Anropas automatiskt varje bildruta (tack vare runChildUpdate)
  update(time, delta) {
    this.setDepth(this.y);
    if (this.hurt) return; // under knuff vandrar vi inte

    this.moveTimer -= delta;
    // Ny riktning när tiden gått ut, eller om vi gått in i en vägg
    if (this.moveTimer <= 0 || this.body.blocked.left || this.body.blocked.right ||
        this.body.blocked.up || this.body.blocked.down) {
      this.pickDirection();
    }
  }

  pickDirection() {
    const dir = Phaser.Utils.Array.GetRandom(DIRECTIONS);
    this.setVelocity(dir.x * this.speed, dir.y * this.speed);
    this.moveTimer = Phaser.Math.Between(700, 1800); // millisekunder
  }

  // Träffad av motorsågen. (fromX, fromY) = var hjälten står.
  takeHit(fromX, fromY) {
    if (this.hurt) return;
    this.hp -= 1;
    this.hurt = true;
    this.setTintFill(0xffffff); // blinka vitt

    // Kort knuff bort från hjälten. Inte för hård – annars tappar
    // sågen kontakten direkt och man måste jaga ikapp hela tiden.
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    this.setVelocity(Math.cos(angle) * 140, Math.sin(angle) * 140);

    this.scene.time.delayedCall(130, () => {
      if (!this.active) return; // kan redan vara borta
      this.clearTint();
      this.hurt = false;
      this.setVelocity(0, 0);
      if (this.hp <= 0) this.die();
    });
  }

  die() {
    const scene = this.scene;
    // Liten "puff"-effekt där slajmen var
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
