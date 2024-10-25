import platform from '../images/platform.png';
import hills from '../images/hills.png';
import background from '../images/background.png';
import platformSmallTall from '../images/platformSmallTall.png';
import platformSmallTall1 from '../images/platformSmallTall1.png'
import spriteRunLeft from '../images/spriteRunLeft.png';
import spriteRunRight from '../images/spriteRunRight.png';
import spriteStandLeft from '../images/spriteStandLeft.png';
import spriteStandRight from '../images/spriteStandRight.png';
import platform1 from '../images/platform1.jpg';
import createTreasureContent from './treasureContent';

export function initializeGame(canvas, playerPosition, treasureArray, onTreasureOpen) {
  const c = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let treasureIndex = 0;
  let validTreasureIndex = [];

  const gravity = 1.0;
  const jumpStrength = -20;
  let isPaused = false;
  let animationFrameId;

  function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  class Player {
    constructor() {
      this.width = 66;
      this.height = 150;
      this.speed = 5 * 2; // Reduced from 10 to 5
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

      this.draw();

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.position.y + this.height + this.velocity.y <= canvas.height) {
        this.velocity.y += gravity;
      } else {
        this.velocity.y = 0;
      }
    }

    draw() {
      c.drawImage(
        this.currentSprite,
        this.currentCropWidth * Math.floor(this.frames / 2), // Slow down animation
        0,
        this.currentCropWidth,
        400,
        this.position.x - cameraX,
        this.position.y,
        this.width,
        this.height
      );
    }

    logPosition() {
      console.log(`(${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)})`);
    }
  }


  class Platform {
    constructor({
      x,
      y,
      image,
      isMoving = false,
      movementRange = 200,
      speed = 2,
      movementType = 'horizontal' // 'horizontal' or 'vertical'
    }) {
      this.position = { x, y };
      this.image = image;
      this.width = image.width;
      this.height = image.height;
      this.isMoving = isMoving;
      this.movementRange = movementRange;
      this.speed = speed;
      this.startX = x;
      this.startY = y;
      this.direction = 1; // 1 for right/down, -1 for left/up
      this.movementType = movementType;
    }

    update() {
      if (this.isMoving) {
        if (this.movementType === 'horizontal') {
          // Horizontal movement
          this.position.x += this.speed * this.direction;

          if (this.position.x >= this.startX + this.movementRange) {
            this.direction = -1;
          } else if (this.position.x <= this.startX) {
            this.direction = 1;
          }
        } else if (this.movementType === 'vertical') {
          // Vertical movement
          this.position.y += this.speed * this.direction;

          if (this.position.y >= this.startY + this.movementRange) {
            this.direction = -1;
          } else if (this.position.y <= this.startY) {
            this.direction = 1;
          }
        }
      }
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

  class Treasure {
    constructor({ x, y, imageClosed, imageOpen, scale = 0.25, taskDescription, letter, letterImage }) {
      this.x = x;
      this.y = y;
      this.tIDX = treasureIndex++;
      this.position = { x, y };
      this.imageClosed = imageClosed;
      this.imageOpen = imageOpen;
      this.width = imageClosed.width * scale;
      this.height = imageClosed.height * scale;
      this.scale = scale;
      this.taskDescription = taskDescription;
      this.letter = letter;
      this.letterImage = letterImage;

      if (Array.isArray(treasureArray) && treasureArray.includes(this.tIDX)) {
        this.isOpen = true;
      } else {
        validTreasureIndex.push({ tIDX: this.tIDX, position: this.position });
        this.isOpen = false;
      }
    }

    draw() {
      const image = this.isOpen ? this.imageOpen : this.imageClosed;
      c.drawImage(
        image,
        this.position.x - cameraX,
        this.position.y,
        this.width,
        this.height
      );
    }

    open() {
      if (!this.isOpen) {
        this.isOpen = true;
        console.log(`Treasure ${this.tIDX} opened`);

        if (onTreasureOpen) {
          onTreasureOpen(this);
        }
      }
    }
  }

  function initTreasures() {
    const treasureContent = createTreasureContent(platforms);
    treasureIndex = 0;

    treasures = treasureContent.map(content => new Treasure({
      x: content.x,
      y: content.y,
      imageClosed: createImage(content.imageClosed),
      imageOpen: createImage(content.imageOpen),
      taskDescription: content.taskDescription,
      letterImage: content.letterImage,
      letter: content.letter
    }));

    console.log("Treasures initialized:", treasures.map(t => ({ tIDX: t.tIDX, isOpen: t.isOpen })));
  }

  let player;
  let platforms;
  let genericObjects;
  let treasures = [];
  let keys;
  let cameraX = 0;

  function init() {
    player = new Player();
    const platformImage = createImage(platform);
    const platformImage1 = createImage(platform1);
    const backgroundImage = createImage(background);
    const hillsImage = createImage(hills);
    const platformSmallTallImage = createImage(platformSmallTall);
    const platformSmallTall1Image = createImage(platformSmallTall1);

    platforms = [
      new Platform({ x: -1, y: 470, image: platformImage }),
      new Platform({ x: platformImage.width, y: 470, image: platformImage }),
      new Platform({ x: (platformImage.width + 50) * 2 + 100, y: 470, image: platformImage }),
      new Platform({ x: (platformImage.width + 50) * 3 + 300, y: 470, image: platformImage }),
      new Platform({ x: (platformImage.width + 50) * 4 + 300, y: 270, image: platformSmallTallImage }),
      new Platform({ x: (platformImage.width + 50) * 5 + 100, y: 170, image: platformSmallTallImage }),
      new Platform({ x: (platformImage.width + 50) * 6 - 50, y: 70 + 90, image: platformSmallTallImage }),
      new Platform({ x: (platformImage.width + 50) * 6 + 400, y: 170, image: platformSmallTallImage }),
      new Platform({ x: (platformImage.width + 50) * 7 + 300, y: 170, image: platformSmallTallImage }),
      new Platform({ x: (platformImage1.width + 50) * 8 + 300, y: 470, image: platformImage1 }),
      new Platform({ x: (platformImage1.width + 50) * 9 + 250, y: 470, image: platformImage1 }),
      new Platform({ x: (platformImage1.width + 50) * 10 + 300, y: 470, image: platformImage1 }),

      new Platform({ x: (platformImage1.width + 50) * 11 + 400, y: 290, image: platformSmallTall1Image }),
      new Platform({ x: (platformImage1.width + 50) * 11 + 900, y: 290, image: platformSmallTall1Image }),
      new Platform({ x: (platformImage1.width + 50) * 11 + 900 + 500, y: 290, image: platformSmallTall1Image }),
      new Platform({ x: (platformImage1.width + 50) * 11 + 900 + 500 + 500, y: 290, image: platformSmallTall1Image }),

      new Platform({ x: (platformImage1.width + 50) * 8 + 300 + 4000, y: 470, image: platformImage1 }),
      new Platform({ x: 9360 + 200 + 500, y: 470, image: platformImage1 }),
      new Platform({ x: 9360 + 200 + 500 + 580, y: 470, image: platformImage1 }),

      new Platform({ x: 10640 + 580, y: 470, image: platformImage1 }),

      // First horizontal moving platform
      new Platform({
        x: 10640 + 580 + 700,
        y: 470,
        image: platformImage1,
        isMoving: true,
        movementRange: 800,
        speed: 2,
        movementType: 'horizontal'
      }),

      new Platform({ x: 12720 + 580, y: 470, image: platformImage1 }),

      // Vertical moving platform
      // new Platform({
      //   x: 13300,
      //   y: 470,
      //   image: platformImage1,
      //   isMoving: true,
      //   movementRange: 300,
      //   speed: 1.5,
      //   movementType: 'vertical'
      // }),

      // Second horizontal moving platform (faster)
      new Platform({
        x: 13880,
        y: 470,
        image: platformImage1,
        isMoving: true,
        movementRange: 1000,
        speed: 5,
        movementType: 'horizontal'
      }),

      // Final platform
      new Platform({ x: 13880 + 580 + 1000, y: 470, image: platformImage1 }),

      // Additional vertical moving platform for extra challenge
      new Platform({
        x: 13880 + 580 + 1500,
        y: 270,
        image: platformSmallTall1Image,
        isMoving: true,
        movementRange: 400,
        speed: 2,
        movementType: 'vertical'
      }),

      // Final landing platform at a higher elevation
      new Platform({ x: 13880 + 580 + 2000, y: 270, image: platformSmallTall1Image })
    ];

    genericObjects = [
      new GenericObject({ x: -1, y: -1, image: backgroundImage }),
      new GenericObject({ x: 11540, y: -1, image: backgroundImage }),
      new GenericObject({ x: 8000, y: -1, image: hillsImage }),
    ];

    initTreasures();

    keys = {
      right: { pressed: false },
      left: { pressed: false },
    };
  }

  function animate() {
    if (isPaused) {
      return; // Exit the animation loop if the game is paused
    }

    function checkTreasureCollisions() {
      const playerRange = 100;

      validTreasureIndex.forEach(({ tIDX, position }) => {
        const treasure = treasures[tIDX];

        const distanceX = Math.abs(player.position.x - position.x);
        const distanceY = Math.abs(player.position.y - position.y);

        if (distanceX <= playerRange && distanceY <= playerRange) {
          if (
            player.position.x < position.x + treasure.width &&
            player.position.x + player.width > position.x &&
            player.position.y < position.y + treasure.height &&
            player.position.y + player.height > position.y
          ) {
            treasure.open();
            const index = validTreasureIndex.findIndex(item => item.tIDX === tIDX);
            if (index !== -1) {
              validTreasureIndex.splice(index, 1);
            }
          }
        }
      });
    }

    animationFrameId = requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach((genericObject) => genericObject.draw());

    platforms.forEach((platform) => {
      platform.update();
      platform.draw();
    });

    treasures.forEach((treasure) => treasure.draw());
    player.update();

    cameraX = player.position.x - canvas.width / 2;

    if (keys.right.pressed) {
      player.velocity.x = player.speed;
    } else if (keys.left.pressed) {
      player.velocity.x = -player.speed;
    } else {
      player.velocity.x = 0;
    }

    // Enhanced platform collision detection
    platforms.forEach((platform) => {
      if (
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >= platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width
      ) {
        player.velocity.y = 0;

        // If platform is moving, move the player with it
        if (platform.isMoving) {
          if (platform.movementType === 'horizontal') {
            player.position.x += platform.speed * platform.direction;
          } else if (platform.movementType === 'vertical') {
            player.position.y += platform.speed * platform.direction;
          }
        }
      }
    });

    checkTreasureCollisions();

    if (player.position.y >= 427) {
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

  // Control functions
  const pause = () => {
    isPaused = true;
    cancelAnimationFrame(animationFrameId);
  };

  const resume = () => {
    if (isPaused) {
      isPaused = false;
      animate();
    }
  };

  return { pause, resume };
}
