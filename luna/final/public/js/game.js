//Code by:
//https://codepen.io/adelciotto/pen/WNzRYy
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    this.Class = function(){}; 
   
    //ectends method to create subclasses
    Class.extend = function(prop) {
      var _super = this.prototype;
      initializing = true;
      var prototype = new this();
      initializing = false;
    
     // loop through properties in 'prop' to add to the subclass prototype
      for (var name in prop) {
        prototype[name] = typeof prop[name] == "function" &&
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (function(name, fn){
            return function() {
              var tmp = this._super;
              this._super = _super[name];
              var ret = fn.apply(this, arguments);        
              this._super = tmp;
             
              return ret;
            };
          })(name, prop[name]) :
          prop[name];
      }
     
    // Subclass constructor
      function Class() {
        if ( !initializing && this.init )
          this.init.apply(this, arguments);
      }
      Class.prototype = prototype;
      Class.prototype.constructor = Class;
      Class.extend = arguments.callee;
     
      return Class;
    };
  })();

  //ensures compatability across browsers
  (function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();
  
  (function() {
    if (!window.performance.now) {
      window.performance.now = (!Date.now) ? function() { return new Date().getTime(); } : 
        function() { return Date.now(); }
    }
  })();
  
  var IS_CHROME = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  var CANVAS_WIDTH = 640; // Set the canvas dimensions for the game
  var CANVAS_HEIGHT = 640;
  var SPRITE_SHEET_SRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAEACAYAAAADRnAGAAACGUlEQVR42u3aSQ7CMBAEQIsn8P+/hiviAAK8zFIt5QbELiTHmfEYE3L9mZE9AAAAqAVwBQ8AAAD6THY5CgAAAKbfbPX3AQAAYBEEAADAuZrC6UUyfMEEAIBiAN8OePXnAQAAsLcmmKFPAQAAgHMbm+gbr3Sdo/LtcAAAANR6GywPAgBAM4D2JXAAABoBzBjA7AmlOx8AAEAzAOcDAADovTc4vQim6wUCABAYQG8QAADd4dPd2fRVYQAAANQG0B4HAABAawDnAwAA6AXgfAAAALpA2uMAAABwPgAAgPoAM9Ci/R4AAAD2dmqcEQIAIC/AiQGuAAYAAECcRS/a/cJXkUf2AAAAoBaA3iAAALrD+gIAAADY9baX/nwAAADNADwFAADo9YK0e5FMX/UFACA5QPSNEAAAAHKtCekmDAAAAADvBljtfgAAAGgMMGOrunvCy2uCAAAACFU6BwAAwF6AGQPa/XsAAADYB+B8AAAAtU+ItD4OAwAAAFVhAACaA0T7B44/BQAAANALwGMQAAAAADYO8If2+P31AgAAQN0SWbhFDwCAZlXgaO1xAAAA1FngnA8AACAeQPSNEAAAAM4CnC64AAAA4GzN4N9NSfgKEAAAAACszO26X8/X6BYAAAD0Anid8KcLAAAAAAAAAJBnwNEvAAAA9Jns1ygAAAAAAAAAAAAAAAAAAABAQ4COCENERERERERERBrnAa1sJuUVr3rsAAAAAElFTkSuQmCC';
  var LEFT_KEY = 37; // Define key codes for left, right, and shoot controls
  var RIGHT_KEY = 39;
  var SHOOT_KEY = 32;
  var TEXT_BLINK_FREQ = 500;
  var PLAYER_CLIP_RECT = { x: 0, y: 204, w: 62, h: 32 };
  var ALIEN_BOTTOM_ROW = [ { x: 0, y: 0, w: 51, h: 34 }, { x: 0, y: 102, w: 51, h: 34 }]; // Alien sprite configurations (rows of aliens with specific clipping rectangles)
  var ALIEN_MIDDLE_ROW = [ { x: 0, y: 137, w: 50, h: 33 }, { x: 0, y: 170, w: 50, h: 34 }];
  var ALIEN_TOP_ROW = [ { x: 0, y: 68, w: 50, h: 32 }, { x: 0, y: 34, w: 50, h: 32 }];
  var ALIEN_X_MARGIN = 40;
  var ALIEN_SQUAD_WIDTH = 11 * ALIEN_X_MARGIN;
  
  
  function getRandomArbitrary(min, max) { //gets a random float 
      return Math.random() * (max - min) + min;
  }
  
  function getRandomInt(min, max) { //gets a ranfom integer
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function clamp(num, min, max) { //vlamps a value within a range
    return Math.min(Math.max(num, min), max);
  }
  
  function valueInRange(value, min, max) { //checks it lies in a specific range
    return (value <= max) && (value >= min);
  }
   
  function checkRectCollision(A, B) { //collison check
    var xOverlap = valueInRange(A.x, B.x, B.x + B.w) ||
    valueInRange(B.x, A.x, A.x + A.w);
   
    var yOverlap = valueInRange(A.y, B.y, B.y + B.h) ||
    valueInRange(B.y, A.y, A.y + A.h); 
    return xOverlap && yOverlap;
  }
  
  var Point2D = Class.extend({ //creates 2D points
    init: function(x, y) {
      this.x = (typeof x === 'undefined') ? 0 : x;
      this.y = (typeof y === 'undefined') ? 0 : y;
    },
    
    set: function(x, y) { //sets new values
      this.x = x;
      this.y = y;
    }
  });
  
  var Rect = Class.extend({ //represents a rectangle 
    init: function(x, y, w, h) {
      this.x = (typeof x === 'undefined') ? 0 : x;
      this.y = (typeof y === 'undefined') ? 0 : y;
      this.w = (typeof w === 'undefined') ? 0 : w;
      this.h = (typeof h === 'undefined') ? 0 : h;
    },
    
    set: function(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
  });
  
  //varibles
  var canvas = null;
  var ctx = null;
  var spriteSheetImg = null;
  var bulletImg = null;
  var keyStates = null;
  var prevKeyStates = null;
  var lastTime = 0;
  var player = null;
  var aliens = [];
  var particleManager = null;
  var updateAlienLogic = false;
  var alienDirection = -1;
  var alienYDown = 0;
  var alienCount = 0;
  var wave = 1;
  var hasGameStarted = false;
  var highscore = 0;
  
  //creates basesprite
  var BaseSprite = Class.extend({
    init: function(img, x, y) {
      this.img = img;
      this.position = new Point2D(x, y);
      this.scale = new Point2D(1, 1);
      this.bounds = new Rect(x, y, this.img.width, this.img.height);
      this.doLogic = true;
    },
                       
    update: function(dt) { },
    
    //uupdates bounds
    _updateBounds: function() {
       this.bounds.set(this.position.x, this.position.y, ~~(0.5 + this.img.width * this.scale.x), ~~(0.5 + this.img.height * this.scale.y));
    },
    
    //draws sprite on canvas
    _drawImage: function() {
      ctx.drawImage(this.img, this.position.x, this.position.y);
    },
    
    draw: function(resized) {
      this._updateBounds();
      
      this._drawImage();
    }
  });
  
  // sheetSprite class extends BaseSprite, allowing for sprite sheets and clipping of specific sections
  var SheetSprite = BaseSprite.extend({
    init: function(sheetImg, clipRect, x, y) {
      this._super(sheetImg, x, y);
      this.clipRect = clipRect;
      this.bounds.set(x, y, this.clipRect.w, this.clipRect.h);
    },
    
    update: function(dt) {},
    
    _updateBounds: function() {
      var w = ~~(0.5 + this.clipRect.w * this.scale.x);
      var h = ~~(0.5 + this.clipRect.h * this.scale.y);
      this.bounds.set(this.position.x - w/2, this.position.y - h/2, w, h);
    },
    
    
    _drawImage: function() { 
      ctx.save();
      ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
      ctx.drawImage(this.img, this.clipRect.x, this.clipRect.y, this.clipRect.w, this.clipRect.h, ~~(0.5 + -this.clipRect.w*0.5), ~~(0.5 + -this.clipRect.h*0.5), this.clipRect.w, this.clipRect.h);
      ctx.restore();
  
    },
    
    draw: function(resized) {
      this._super(resized);
    }
  });
  
  var Player = SheetSprite.extend({ // initializes the player's properties
    init: function() {
      this._super(spriteSheetImg, PLAYER_CLIP_RECT, CANVAS_WIDTH/2, CANVAS_HEIGHT - 70);
      this.scale.set(0.85, 0.85);
      this.lives = 3;
      this.xVel = 0;
      this.bullets = [];
      this.bulletDelayAccumulator = 0;
      this.score = 0;
    },

    reset: function() {  // resets the player's properties and calls to update highscore
      this.lives = 3;
      this.score = 0;
      this.position.set(CANVAS_WIDTH/2, CANVAS_HEIGHT - 70);
    },
    
    // Shoots a bullet from the player's position
    shoot: function() {
      var bullet = new Bullet(this.position.x, this.position.y - this.bounds.h / 2, 1, 1000);
      this.bullets.push(bullet);
    },
    
    // Handles player input for movement and shooting
    handleInput: function() {
      if (isKeyDown(LEFT_KEY)) {
        this.xVel = -175;
      } else if (isKeyDown(RIGHT_KEY)) {
        this.xVel = 175;
      } else this.xVel = 0;
      
      if (wasKeyPressed(SHOOT_KEY)) {
        if (this.bulletDelayAccumulator > 0.5) {
          this.shoot(); 
          this.bulletDelayAccumulator = 0;
        }
      }
    },
    
    // updates the player's bullets, moving them upwards and removing them
    updateBullets: function(dt) {
      for (var i = this.bullets.length - 1; i >= 0; i--) {
        var bullet = this.bullets[i];
        if (bullet.alive) {
          bullet.update(dt);
        } else {
          this.bullets.splice(i, 1);
          bullet = null;
        }
      }
    },
    
    // player class update and draw methods
    update: function(dt) {
      this.bulletDelayAccumulator += dt;
      this.position.x += this.xVel * dt;
      this.position.x = clamp(this.position.x, this.bounds.w/2, CANVAS_WIDTH - this.bounds.w/2);
      this.updateBullets(dt);
    },
    
    draw: function(resized) {
      this._super(resized); // loops through all of the player's bullets and draws each one if it's alive
      for (var i = 0, len = this.bullets.length; i < len; i++) {
        var bullet = this.bullets[i];
        if (bullet.alive) {
          bullet.draw(resized);
        }
      }
    }
  });
  
  var Bullet = BaseSprite.extend({ // Bullet class
    init: function(x, y, direction, speed) {
      this._super(bulletImg, x, y);
      this.direction = direction;
      this.speed = speed;
      this.alive = true;
    },
    
    update: function(dt) { // update method for the bullet
      this.position.y -= (this.speed * this.direction) * dt;
      
      if (this.position.y < 0) {
        this.alive = false;
      }
    },
    
    draw: function(resized) { // draw method for rendering the bullet sprite
      this._super(resized);
    }
  });
  
  var Enemy = SheetSprite.extend({ // enemy class
    init: function(clipRects, x, y) {
      this._super(spriteSheetImg, clipRects[0], x, y);
      this.clipRects = clipRects;
      this.scale.set(0.5, 0.5);
      this.alive = true;
      this.onFirstState = true;
      this.stepDelay = 1; 
      this.stepAccumulator = 0;
      this.doShoot - false;
      this.bullet = null;
    },
    
    toggleFrame: function() { //toggle between animation states for the enemy
      this.onFirstState = !this.onFirstState;
      this.clipRect = (this.onFirstState) ? this.clipRects[0] : this.clipRects[1];
    },
    
    shoot: function() { //function to create a bullet
      this.bullet = new Bullet(this.position.x, this.position.y + this.bounds.w/2, -1, 500);
    },
    
    update: function(dt) { //Udate method for the enemy's movement and behavior
      this.stepAccumulator += dt;
      
      if (this.stepAccumulator >= this.stepDelay) {
        if (this.position.x < this.bounds.w/2 + 20 && alienDirection < 0) {
        updateAlienLogic = true;
      } if (alienDirection === 1 && this.position.x > CANVAS_WIDTH - this.bounds.w/2 - 20) {
        updateAlienLogic = true;
      }
        if (this.position.y > CANVAS_WIDTH - 50) {
          reset();
        }
        
        var fireTest = Math.floor(Math.random() * (this.stepDelay + 1));
        if (getRandomArbitrary(0, 1000) <= 5 * (this.stepDelay + 1)) {
          this.doShoot = true;
        }
        this.position.x += 10 * alienDirection;
        this.toggleFrame();
        this.stepAccumulator = 0;
      }
      this.position.y += alienYDown;
      
      if (this.bullet !== null && this.bullet.alive) {
        this.bullet.update(dt);  
      } else {
        this.bullet = null;
      }
    },
    
    // draw method to render the enemy and its bullet
    draw: function(resized) {
      this._super(resized);
      if (this.bullet !== null && this.bullet.alive) {
        this.bullet.draw(resized);
      }
    }
  });
  
  var ParticleExplosion = Class.extend({
    init: function() {
      this.particlePool = [];
      this.particles = [];
    },
    
    draw: function() { //  draw the particles on the canvas and update their properties
      for (var i = this.particles.length - 1; i >= 0; i--) {
        var particle = this.particles[i];
        particle.moves++;
          particle.x += particle.xunits;
            particle.y += particle.yunits + (particle.gravity * particle.moves);
              particle.life--;
              
              if (particle.life <= 0 ) {
                  if (this.particlePool.length < 100) {
                      this.particlePool.push(this.particles.splice(i,1));
                  } else {
                      this.particles.splice(i,1);
                  }
              } else {
                  ctx.globalAlpha = (particle.life)/(particle.maxLife);
                  ctx.fillStyle = particle.color;
                  ctx.fillRect(particle.x, particle.y, particle.width, particle.height);
                  ctx.globalAlpha = 1;
              }
      }
    },
    
    //creates an explostion by generating multiple particles
    createExplosion: function(x, y, color, number, width, height, spd, grav, lif) {
    for (var i =0;i < number;i++) {
              var angle = Math.floor(Math.random()*360);
              var speed = Math.floor(Math.random()*spd/2) + spd;	
              var life = Math.floor(Math.random()*lif)+lif/2;
              var radians = angle * Math.PI/ 180;
              var xunits = Math.cos(radians) * speed;
              var yunits = Math.sin(radians) * speed;
                  
              if (this.particlePool.length > 0) {
                  var tempParticle = this.particlePool.pop();
                  tempParticle.x = x;
                  tempParticle.y = y;
                  tempParticle.xunits = xunits;
                  tempParticle.yunits = yunits;
                  tempParticle.life = life;
                  tempParticle.color = color;
                  tempParticle.width = width;
                  tempParticle.height = height;
                  tempParticle.gravity = grav;
                  tempParticle.moves = 0;
                  tempParticle.alpha = 1;
                  tempParticle.maxLife = life;
                  this.particles.push(tempParticle);
              } else {
                  this.particles.push({x:x,y:y,xunits:xunits,yunits:yunits,life:life,color:color,width:width,height:height,gravity:grav,moves:0,alpha:1, maxLife:life});
              }	
      
          }
    }
  });
  
  //initiilisies canvas and sets up 2d rendering
  function initCanvas() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    setImageSmoothing(false);
    
    spriteSheetImg = new Image();
    spriteSheetImg.src = SPRITE_SHEET_SRC;  
    preDrawImages();

    window.addEventListener('resize', resize);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }
  
  function preDrawImages() { //pree draw image
    var canvas = drawIntoCanvas(2, 8, function(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      });
      bulletImg = new Image();
      bulletImg.src = canvas.toDataURL();
  }
  
  function setImageSmoothing(value) { //sets image smoothing
    this.ctx['imageSmoothingEnabled'] = value;
    this.ctx['mozImageSmoothingEnabled'] = value;
    this.ctx['oImageSmoothingEnabled'] = value;
    this.ctx['webkitImageSmoothingEnabled'] = value;
    this.ctx['msImageSmoothingEnabled'] = value;
  }
  
  function initGame() { //initilises the game objects and varibles
    dirtyRects = [];
    aliens = [];
    player = new Player();
    particleManager = new ParticleExplosion();
    setupAlienFormation();  
    drawBottomHud();
  }
  
  function setupAlienFormation() {//sets up alien grid
    alienCount = 0;
    for (var i = 0, len = 5 * 11; i < len; i++) {
      var gridX = (i % 11);
      var gridY = Math.floor(i / 11);
      var clipRects;
      switch (gridY) {
        case 0: 
        case 1: clipRects = ALIEN_BOTTOM_ROW; break;
        case 2: 
        case 3: clipRects = ALIEN_MIDDLE_ROW; break;
        case 4: clipRects = ALIEN_TOP_ROW; break;
      }
      aliens.push(new Enemy(clipRects, (CANVAS_WIDTH/2 - ALIEN_SQUAD_WIDTH/2) + ALIEN_X_MARGIN/2 + gridX * ALIEN_X_MARGIN, CANVAS_HEIGHT/3.25 - gridY * 40));
      alienCount++;
    }
  }
  
  function reset() { //resets game
    aliens = [];
    setupAlienFormation();
    player.reset();
  }
  
  function init() {//initilises game
    initCanvas();
    keyStates = [];
    prevKeyStates = [];
    resize();
  }
  
  function isKeyDown(key) {//checks if key is held down
    return keyStates[key];
  }
  
  function wasKeyPressed(key) { //checks is key is pressed
    return !prevKeyStates[key] && keyStates[key];
  }

  function updateAliens(dt) { //updates alien logic
    if (updateAlienLogic) {
      updateAlienLogic = false;
      alienDirection = -alienDirection;
      alienYDown = 25;
    }
    
    for (var i = aliens.length - 1; i >= 0; i--) {
      var alien = aliens[i];
      if (!alien.alive) {
        aliens.splice(i, 1);
        alien = null;
        alienCount--;
        if (alienCount < 1) {
          wave++;
          setupAlienFormation();
        }
        return;
      }
      
      alien.stepDelay = ((alienCount * 20) - (wave * 10)) / 1000;
      if (alien.stepDelay <= 0.05) {
        alien.stepDelay = 0.05;
      }
      alien.update(dt);
      
      if (alien.doShoot) {
        alien.doShoot = false;
        alien.shoot();
      }
    }
    alienYDown = 0;
  }
  
  function resolveBulletEnemyCollisions() { //checks for collison between player bullets and aliens
    var bullets = player.bullets;
    
    for (var i = 0, len = bullets.length; i < len; i++) {
      var bullet = bullets[i];
      for (var j = 0, alen = aliens.length; j < alen; j++) {
        var alien = aliens[j];
        if (checkRectCollision(bullet.bounds, alien.bounds)) {
          alien.alive = bullet.alive = false;
          particleManager.createExplosion(alien.position.x, alien.position.y, 'white', 70, 5,5,3,.15,50);
          player.score += 25;
          if (player.score>highscore){
            highscore = player.score;
          }
        }
      }
    }
  }
  
  function resolveBulletPlayerCollisions() { //checks for collison between  bullets and player
    for (var i = 0, len = aliens.length; i < len; i++) {
      var alien = aliens[i];
      if (alien.bullet !== null && checkRectCollision(alien.bullet.bounds, player.bounds)) {
        if (player.lives === 0) {
          hasGameStarted = false;
        } else {
         alien.bullet.alive = false;
         particleManager.createExplosion(player.position.x, player.position.y, 'green', 100, 8,8,6,0.001,40);
         player.position.set(CANVAS_WIDTH/2, CANVAS_HEIGHT - 70);
         player.lives--;
          break;
        }
  
      }
    }
  }
  
  function resolveCollisions() { // collisions between bullets and enemies, and between bullets and the player
    resolveBulletEnemyCollisions();
    resolveBulletPlayerCollisions();
  }
  
  function updateGame(dt) {//updates game state
    player.handleInput();
    prevKeyStates = keyStates.slice();
    player.update(dt);
    updateAliens(dt);
    resolveCollisions();
  }
  
  function drawIntoCanvas(width, height, drawFunc) { //creates a temp canvas
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    drawFunc(ctx);
    return canvas;
  }
  
  function fillText(text, x, y, color, fontSize) { //fills the text
    if (typeof color !== 'undefined') ctx.fillStyle = color;
    if (typeof fontSize !== 'undefined') ctx.font = fontSize + 'px Play';
    ctx.fillText(text, x, y);
  }
  
  function fillCenteredText(text, x, y, color, fontSize) { //center text
    var metrics = ctx.measureText(text);
    fillText(text, x - metrics.width/2, y, color, fontSize);
  }
  
  function fillBlinkingText(text, x, y, blinkFreq, color, fontSize) {//draws blinking text
    if (~~(0.5 + Date.now() / blinkFreq) % 2) {
      fillCenteredText(text, x, y, color, fontSize);
    }
  }
  
  function drawBottomHud() { //draws the HUD AT THE bottom
    ctx.fillStyle = '#02ff12';
    ctx.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 2);
    fillText(player.lives + ' x ', 10, CANVAS_HEIGHT - 7.5, 'white', 20);
    ctx.drawImage(spriteSheetImg, player.clipRect.x, player.clipRect.y, player.clipRect.w, player.clipRect.h, 45, CANVAS_HEIGHT - 23, player.clipRect.w * 0.5,player.clipRect.h * 0.5);
    fillText('CREDIT: ', CANVAS_WIDTH - 115, CANVAS_HEIGHT - 7.5);
    fillCenteredText('SCORE: ' + player.score, CANVAS_WIDTH/2, 20);
    fillCenteredText('HIGHSCORE: ' + highscore, CANVAS_WIDTH/2, 40);
    fillBlinkingText('00', CANVAS_WIDTH - 25, CANVAS_HEIGHT - 7.5, TEXT_BLINK_FREQ);
  }
  
  function drawAliens(resized) { //draws each alien
    for (var i = 0; i < aliens.length; i++) {
      var alien = aliens[i];
      alien.draw(resized);
    }
  }
  
  function drawGame(resized) { //draws everything
    player.draw(resized);  
    drawAliens(resized);
    particleManager.draw();
    drawBottomHud();
  }
  
  function drawStartScreen() {// draws the start screen text
    fillCenteredText("Space Invaders", CANVAS_WIDTH/2, CANVAS_HEIGHT/2.75, '#FFFFFF', 36);
    fillBlinkingText("Press enter to play!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 500, '#FFFFFF', 36);
    fillBlinkingText("Use the arrow keys and space to move!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 1.75, 500, '#FFFFFF', 36); 
  }
  
  function animate() { //redraws the game 
    var now = window.performance.now();
    var dt = now - lastTime;
    if (dt > 100) dt = 100;
    if (wasKeyPressed(13) && !hasGameStarted) {
      initGame();
      hasGameStarted = true;
    }
    
    if (hasGameStarted) {
       updateGame(dt / 1000);  
    }
  
   
    ctx.fillStyle = 'black'; //background colour
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (hasGameStarted) {
      drawGame(false);
    } else {
      drawStartScreen();
    }
    lastTime = now;
    requestAnimationFrame(animate);
  }
  
  function resize() { //fits the current window size
    var w = window.innerWidth;
    var h = window.innerHeight;
  
     
    var scaleFactor = Math.min(w / CANVAS_WIDTH, h / CANVAS_HEIGHT);
    
    if (IS_CHROME) {
      canvas.width = CANVAS_WIDTH * scaleFactor;
      canvas.height = CANVAS_HEIGHT * scaleFactor;
      setImageSmoothing(false);
      ctx.transform(scaleFactor, 0, 0, scaleFactor, 0, 0);   
    } else {
      canvas.style.width = CANVAS_WIDTH * scaleFactor + 'px';
      canvas.style.height = CANVAS_HEIGHT * scaleFactor + 'px'; 
    }
  }
  
  function onKeyDown(e) { //
    e.preventDefault();
    keyStates[e.keyCode] = true;
  }
  
  function onKeyUp(e) {
    e.preventDefault();
    keyStates[e.keyCode] = false;
  }
  

  window.onload = function() {//starts game
    init();
    animate();
  };
