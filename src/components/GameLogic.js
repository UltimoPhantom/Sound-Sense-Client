import React, { useEffect, useRef } from 'react';
import platform from '../images/platform.png';
import hills from '../images/hills.png';
import background from '../images/background.png';
import platformSmallTall from '../images/platformSmallTall.png';
import spriteRunLeft from '../images/spriteRunLeft.png';
import spriteRunRight from '../images/spriteRunRight.png';
import spriteStandLeft from '../images/spriteStandLeft.png';
import spriteStandRight from '../images/spriteStandRight.png';

export function initializeGame(canvas, playerPosition) {
  const c = canvas.getContext('2d');
  canvas.width = window.innerWidth * .99;
  canvas.height = window.innerHeight * 0.97;
  
  const gravity = 1.0;
  const jumpStrength = -20;

  function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  class Player {
    constructor() {
      this.width = 66;
      this.height = 150;
      this.speed = 10;
      this.frames = 0;
      this.sprites = {
        stand: {
          right: createImage(spriteStandRight),
          left: createImage(spriteStandLeft),
          cropWidth: 177,
          width: 66,
        },
        run: {
          right: createImage(spriteRunRight),
          left: createImage(spriteRunLeft),
          cropWidth: 341,
          width: 127.875,
        },
      };

      this.currentSprite = this.sprites.stand.right;
      this.currentCropWidth = this.sprites.stand.cropWidth;
      this.reset(playerPosition);
    }

    reset(position) {
      this.position = {
        x: position.curr_x || 100,
        y: position.curr_y || 100,
      };
      this.velocity = {
        x: 0,
        y: 0,
      };
    }

    draw() {
      c.drawImage(
        this.currentSprite,
        this.currentCropWidth * this.frames,
        0,
        this.currentCropWidth,
        400,
        this.position.x - cameraX,
        this.position.y,
        this.width,
        this.height
      );
    }

    update() {
      this.frames++;
      if (
        this.frames > 59 &&
        (this.currentSprite === this.sprites.stand.right ||
          this.currentSprite === this.sprites.stand.left)
      )
        this.frames = 0;
      else if (
        this.frames > 29 &&
        (this.currentSprite === this.sprites.run.right ||
          this.currentSprite === this.sprites.run.left)
      )
        this.frames = 0;

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.position.y + this.height + this.velocity.y <= canvas.height) {
        this.velocity.y += gravity;
      } else {
        this.velocity.y = 0;
      }

      this.draw();
    }

    logPosition() {
      console.log(`(${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)})`);
    }
  }

  class Platform {
    constructor({ x, y, image }) {
      this.position = { x, y };
      this.image = image;
      this.width = image.width;
      this.height = image.height;
    }

    draw() {
      c.drawImage(this.image, this.position.x - cameraX, this.position.y);
    }
  }

  class GenericObject {
    constructor({ x, y, image }) {
      this.position = { x, y };
      this.image = image;
      this.width = image.width;
      this.height = image.height;
    }

    draw() {
      c.drawImage(this.image, this.position.x - cameraX, this.position.y);
    }
  }

  let player;
  let platforms;
  let genericObjects;
  let keys;
  let cameraX = 0;

  function init() {
    player = new Player();
    const platformImage = createImage(platform);
    const backgroundImage = createImage(background);
    const hillsImage = createImage(hills);
    const platformSmallTallImage = createImage(platformSmallTall);

    platforms = [
      new Platform({ x: platformImage.width + 300 - 2 + platformImage.width - platformSmallTallImage.width, y: 270, image: platformSmallTallImage }),
      new Platform({ x: -1, y: 470, image: platformImage }),
      new Platform({ x: platformImage.width + 50, y: 470, image: platformImage }),
      new Platform({ x: (platformImage.width + 50) * 2 + 100, y: 470, image: platformImage }),
      new Platform({ x: (platformImage.width + 50) * 3 + 300, y: 470, image: platformImage }),
      new Platform({ x: (platformImage.width + 50) * 4 + 400, y: 270, image: platformSmallTallImage }),
      new Platform({ x: (platformImage.width + 50) * 5 + 300, y: 470, image: platformImage }),
    ];

    genericObjects = [
      new GenericObject({ x: -1, y: -1, image: backgroundImage }),
      new GenericObject({ x: -1, y: -1, image: hillsImage }),
    ];

    keys = {
      right: { pressed: false },
      left: { pressed: false },
    };
  }

  function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach((genericObject) => genericObject.draw());
    platforms.forEach((platform) => platform.draw());
    player.update();

    cameraX = player.position.x - canvas.width / 2;


    if (keys.right.pressed) {
      player.velocity.x = player.speed;
    } else if (keys.left.pressed) {
      player.velocity.x = -player.speed;
    } else {
      player.velocity.x = 0;
    }

    platforms.forEach((platform) => {
      if (
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >= platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width
      ) {
        player.velocity.y = 0;
      }
    });

    if (player.position.y >= 427) {
      // alert("YOU DED")
      init();
    }
  }

  init();
  animate();

  window.addEventListener('keydown', ({ key }) => {
    player.logPosition();

    switch (key) {
      case 'a':
        keys.left.pressed = true;
        player.currentSprite = player.sprites.run.left;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
        break;
      case 'd':
        keys.right.pressed = true;
        player.currentSprite = player.sprites.run.right;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
        break;
      case 'w':
        if (player.velocity.y === 0) player.velocity.y = jumpStrength;
        break;
    }
  });

  window.addEventListener('keyup', ({ key }) => {
    player.logPosition();

    switch (key) {
      case 'a':
        keys.left.pressed = false;
        player.currentSprite = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
        break;
      case 'd':
        keys.right.pressed = false;
        player.currentSprite = player.sprites.stand.right;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
        break;
    }
  });
}