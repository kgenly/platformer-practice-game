import Phaser from 'phaser';

class HealthBar {
  constructor(scene, x, y, scale=1, totalHealth) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.bar.setScrollFactor(0,0).setScale(scale);
    this.x = x/scale;
    this.y = y/scale;
    this.scale = scale;
    this.maxHP = totalHealth;
    this.size = {
      width: 40,
      height: 8
    };

    this.value = totalHealth;

    this.pixelPerHealth = this.size.width / totalHealth;

    scene.add.existing(this.bar);
    this.draw(this.x,this.y, this.scale);
  }

  decrease(amount) {
      const hp = this.value - amount;
      this.setCurrentHP(hp);
  }

  increase(amount) {
      const hp = this.value + amount;
      this.setCurrentHP(hp);
  }


  setCurrentHP(hp) {
    if (hp > this.maxHP) {
      this.value = this.maxHP;
    } else if (hp < 0) {
      this.value = 0;
    } else {
      this.value = hp;
    }
    this.draw(this.x,this.y,this.scale);
  }

  draw(x,y) {
    const margin = 2;


    this.bar.clear();
    const {width,height} = this.size;

    //Border
    this.bar.fillStyle(0x000);
    this.bar.fillRect(x,y,width+margin,height+margin);
    const healthWidth = Math.floor(this.pixelPerHealth*this.value);

    //Background
    this.bar.fillStyle(0xFFFFFF);
    this.bar.fillRect(x+margin,y+margin,width-margin,height-margin);


    //Actual HP
    if (healthWidth <= this.size.width /3) {
      this.bar.fillStyle(0xFF0000);
    } else {
      this.bar.fillStyle(0x00FF00);
    }

    //Green health
    if (healthWidth > 0) {
      this.bar.fillRect(x+margin,y+margin,healthWidth-margin,height-margin);
    }
    this.bar.setScrollFactor(0,0).setScale(2);
  }


}

export default HealthBar;
