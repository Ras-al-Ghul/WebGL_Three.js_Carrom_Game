var varfov = 300;
var cammode = 1, subcammode = 0;
var camX = 0,camY = 0,camZ = 10;
var lightX = 0, lightY = 15, lightZ = 5;
var CAMERA, CANVAS, SCENE, spotLight;
var clock;
var state = 0; //0 indicates striker to be placed 1 indicates in play

var strike = 0;

var temp = 0;

var redBar, line;
var power = 0;
var theta = 0;
var score = 100;
var redFlag = 0;  //0 Red on board, 1 Red in Hole, 2 Red followed by white
var redChance = 0;
var numofticks = 0;
var velocities, arrCoins, coinPosns, processing;
var scoreset = false;

var HitSfx = new Audio('Hit.wav');
var PocketSfx = new Audio('Pocket.wav');
var AmbienceSfx = new Audio('Ambience.wav');
HitSfx.preload = 'auto';
PocketSfx.preload = 'auto';
AmbienceSfx.preload = 'auto';
AmbienceSfx.loop = true;

function getCamera(){
  var lookX,lookY,lookZ;
  switch(cammode){
    case 1:
      varfov = 300;
      camX = 0; camY = 0; camZ = 10;
      lookX = 0; lookY = 0; lookZ = 0;
      lightX = 0; lightY = 15; lightZ = 5;
      break;
    case 2:
      varfov = 0;
      camX = 0; camY = 6; camZ = 5;
      lookX = 0; lookY = -8; lookZ = -8;
      lightX = 0; lightY = 205; lightZ = 525;
      break;
    case 3:
      switch(subcammode){
        case 0:
          varfov = 0;
          camX = coinPosns[0][0]; camY = coinPosns[0][1]; camZ = coinPosns[0][2] + 4;
          lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
          lightX = 0; lightY = 15; lightZ = 5;
        break;
        case 1:
          varfov = 0;
          camX = coinPosns[1][0]; camY = coinPosns[1][1]; camZ = coinPosns[1][2] + 4;
          lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
          lightX = 0; lightY = 15; lightZ = 5;
        break;
        case 2:
          varfov = 0;
          camX = coinPosns[2][0]; camY = coinPosns[2][1]; camZ = coinPosns[2][2] + 4;
          lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
          lightX = 0; lightY = 15; lightZ = 5;
        break;
        case 3:
          varfov = 0;
          camX = coinPosns[3][0]; camY = coinPosns[3][1]; camZ = coinPosns[3][2] + 4;
          lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
          lightX = 0; lightY = 15; lightZ = 5;
        break;
        case 4:
          varfov = 0;
          camX = coinPosns[4][0]; camY = coinPosns[4][1]; camZ = coinPosns[4][2] + 4;
          lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
          lightX = 0; lightY = 15; lightZ = 5;
        break;
        case 5:
          varfov = 0;
          camX = coinPosns[5][0]; camY = coinPosns[5][1]; camZ = coinPosns[5][2] + 4;
          lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
          lightX = 0; lightY = 15; lightZ = 5;
        break;
        case 6:
          varfov = 0;
          camX = coinPosns[6][0]; camY = coinPosns[6][1]; camZ = coinPosns[6][2] + 4;
          lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
          lightX = 0; lightY = 15; lightZ = 5;
        break;
        case 7:
          varfov = 0;
          camX = coinPosns[7][0]; camY = coinPosns[7][1]; camZ = coinPosns[7][2] + 4;
          lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
          lightX = 0; lightY = 15; lightZ = 5;
        break;
        case 8:
          varfov = 0;
          camX = coinPosns[8][0]; camY = coinPosns[8][1]; camZ = coinPosns[8][2] + 4;
          lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
          lightX = 0; lightY = 15; lightZ = 5;
        break;
      }
      break;
  }

  //create the camera
  CAMERA = new THREE.PerspectiveCamera(35 + varfov, CANVAS.width / CANVAS.height, 1, 100 );
  CAMERA.position.set(camX, camY, camZ);
  CAMERA.lookAt(new THREE.Vector3(lookX, lookY, lookZ));
  if (cammode == 2){
    CAMERA.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI);
  }
}

function getSpotlight(){
  //the lights
  if (cammode == 1){
    spotLight.intensity = 5;
  }
  else if(cammode == 2){
    spotLight.intensity = 2;
  }
  spotLight.position.set( lightX, lightY, lightZ );
}

function updatePowerBar(){
  SCENE.remove(redBar);
  var ccgeometry = new THREE.BoxGeometry( 0.3, 0.1, 0.1 );
  var ccmaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
  redBar = new THREE.Mesh( ccgeometry, ccmaterial );
  redBar.position.set(3, 1.5 + power ,0);
  SCENE.add( redBar );
}

function displayScore(){
  var materialFront = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
  var materialArray = [ materialFront, materialSide ];
  var textGeom = new THREE.TextGeometry( "Hello, World!", 
  {
    size: 30, height: 4, curveSegments: 3,
    font: "helvetiker", weight: "bold", style: "normal",
    bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
    material: 0, extrudeMaterial: 1
  });
  // font: helvetiker, gentilis, droid sans, droid serif, optimer
  // weight: normal, bold
  
  var textMaterial = new THREE.MeshFaceMaterial(materialArray);
  var textMesh = new THREE.Mesh(textGeom, textMaterial );
  
  textGeom.computeBoundingBox();
  var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
  
  textMesh.position.set( -0.5 * textWidth, 50, 100 );
  textMesh.rotation.x = -Math.PI / 4;
  SCENE.add(textMesh);
}

function checkCollision(a, b){
  var m1, m2;
  if(a == 9){
    m1 = 1.5;
    m2 = 1;
  }
  else if(b == 9){
    m1 = 1;
    m2 = 1.5;
  }
  else{
    m1 = 1;
    m2 = 1;
  }
  var x1 = coinPosns[a][0];
  var y1 = coinPosns[a][1];
  var x2 = coinPosns[b][0];
  var y2 = coinPosns[b][1];
  var u_x1 = velocities[a][0];
  var u_y1 = velocities[a][1];
  var u_x2 = velocities[b][0];
  var u_y2 = velocities[b][1];

  var e=0.7;

  var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  var un_x = (x2 - x1) / d, un_y = (y2 - y1) / d;
  var ut_x = -un_y, ut_y = un_x;
  var ua_n = un_x * u_x1 + un_y * u_y1, ua_t = ut_x * u_x1 + ut_y * u_y1;
  var ub_n = un_x * u_x2 + un_y * u_y2, ub_t = ut_x * u_x2 + ut_y * u_y2;
  var va_n = (e * m2 * (ub_n - ua_n) + m1 * ua_n + m2 * ub_n) / (m1 + m2);
  var vb_n = (e * m1 * (ua_n - ub_n) + m1 * ua_n + m2 * ub_n) / (m1 + m2);
  var va_t = ua_t, vb_t = ub_t;
  var vax_n = va_n * un_x, vay_n = va_n * un_y, vax_t = va_t * ut_x, vay_t = va_t * ut_y;
  var vbx_n = vb_n * un_x, vby_n = vb_n * un_y, vbx_t = vb_t * ut_x, vby_t = vb_t * ut_y;
  velocities[a][0] = (vax_n + vax_t);
  velocities[a][1] = (vay_n + vay_t);
  velocities[b][0] = (vbx_n + vbx_t);
  velocities[b][1] = (vby_n + vby_t);    
}

function updateCoins(){
  
  var collided = new Array(10);
  for (var i = 0; i < 10; i++) {
    collided[i] = new Array(10);
    collided[i][0] = 0;
    collided[i][1] = 0;
    collided[i][2] = 0;
    collided[i][3] = 0;
    collided[i][4] = 0;
    collided[i][5] = 0;
    collided[i][6] = 0;
    collided[i][7] = 0;
    collided[i][8] = 0;
    collided[i][9] = 0;
  }

  for (var i = 0; i < 9; i++){
    for(var j = 0; j < 9; j++){

      if(velocities[i][2] == 0 || velocities[j][2] == 0){
        continue;
      }

      var xcomp = (coinPosns[i][0] - coinPosns[j][0]);
      var ycomp = (coinPosns[i][1] - coinPosns[j][1]);
      var dist = Math.sqrt((xcomp*xcomp) + (ycomp*ycomp));

      if( !collided[i][j] && i!=j && dist < 2*(0.08) && processing[i][j] == 0){
        if(!(velocities[i][0] == 0 && velocities[i][1] == 0 && velocities[j][0] == 0 && velocities[j][1] == 0)){
          HitSfx.play();
        }
        collided[i][j] = 1;
        collided[j][i] = 1;
        checkCollision(i,j);
        processing[i][j]=1;
        processing[j][i]=1;
        i -= 1;
        break;
      }
      else if(!(dist < 2*(0.08)) && i!=j && processing[i][j] == 1){
        processing[i][j]=0;
        processing[j][i]=0; 
      }

      xcomp = (coinPosns[i][0] - coinPosns[9][0]);
      ycomp = (coinPosns[i][1] - coinPosns[9][1]);
      dist = Math.sqrt((xcomp*xcomp) + (ycomp*ycomp));

      if( !collided[9][i] && dist < (0.08+0.1) && processing[9][i] == 0){
        if(!(velocities[9][0] == 0 && velocities[9][1] == 0)){
          HitSfx.play();
        }
        collided[9][i] = 1;
        collided[i][9] = 1;
        checkCollision(i,9);
        processing[i][9]=1;
        processing[9][i]=1;
        i -= 1;
        break;
      }
      else if(!(dist < 2*(0.08+0.1)) && processing[9][i] == 1){
        processing[i][9]=0;
        processing[9][i]=0; 
      }


    }
  }
  
  for (var i = 0; i < 10 ; i++){
    if(velocities[i][2] == 1){
      if(coinPosns[i][0] < -2){
        coinPosns[i][0] = -2;
        HitSfx.play();
        velocities[i][0] = -velocities[i][0];
      }
      if(coinPosns[i][1] < -2){
        coinPosns[i][1] = -2;
        HitSfx.play();
        velocities[i][1] = -velocities[i][1];
      }
      if(coinPosns[i][0] > 2){
        coinPosns[i][0] = 2;
        HitSfx.play();
        velocities[i][0] = -velocities[i][0];
      }
      if(coinPosns[i][1] > 2){
        coinPosns[i][1] = 2;
        HitSfx.play();
        velocities[i][1] = -velocities[i][1];
      }
    }
  }

  var delta = clock.getDelta();
  for(var i = 0; i < 10; i++){
    if(velocities[i][2] == 0){
      continue;
    }

    coinPosns[i][0] += (velocities[i][0]*delta);
    coinPosns[i][1] += (velocities[i][1]*delta);
    
    if(velocities[i][0] > 0){
      velocities[i][0] -= delta*0.2;
    }
    if(velocities[i][0] < 0){
      velocities[i][0] += delta*0.2;
    }
    if(velocities[i][1] > 0){
      velocities[i][1] -= delta*0.2;
    }
    if(velocities[i][1] < 0){
      velocities[i][1] += delta*0.2;
    }
    
    if(velocities[i][0] >= -0.01 && velocities[i][0] <= 0.01){
      velocities[i][0] = 0;
    }
    if(velocities[i][1] >= -0.01 && velocities[i][1] <= 0.01){
      velocities[i][1] = 0;
    }

    arrCoins[i].position.set(coinPosns[i][0],coinPosns[i][1],coinPosns[i][2]);
  }

  if(state == 1){
    var flag = 0;
    for(var i = 0; i < 10; i++){
      if(velocities[i][0] != 0 || velocities[i][1] != 0){
        flag = 0;
        break;
      }
      flag = 1;
    }
    if(flag == 1){
      state = 0;
      coinPosns[9][0] = 0; coinPosns[9][1] = 1.42; coinPosns[9][2] = 0.0;
      arrCoins[9].position.set(coinPosns[9][0],coinPosns[9][1],coinPosns[9][2]);

      var linematerial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      var linegeometry = new THREE.Geometry();
      linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0], coinPosns[9][1], 0));
      linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0] - Math.sin(theta*(Math.PI/180)), coinPosns[9][1] - Math.cos(theta*(Math.PI/180)), 0));
      line = new THREE.Line(linegeometry, linematerial);
      SCENE.add(line);

      power = 0;
      numofticks += 1;
      scoreset = false;
    }
  }

  //Update Score
  if( (Math.abs(coinPosns[9][0] - 2) <= 0.12 && Math.abs(coinPosns[9][1] + 2) <= 0.12 )/*2,-2*/
  || (Math.abs(coinPosns[9][0] + 2) <= 0.12 && Math.abs(coinPosns[9][1] + 2) <= 0.12 )/*-2, -2*/  
  || (Math.abs(coinPosns[9][0] - 2) <= 0.12 && Math.abs(coinPosns[9][1] - 2) <= 0.12 )/*2, 2*/  
  || (Math.abs(coinPosns[9][0] + 2) <= 0.12 && Math.abs(coinPosns[9][1] - 2) <= 0.12 )/*-2, 2*/  ){
    PocketSfx.play();
    if(redFlag == 1){
      coinPosns[0][0] = 0; coinPosns[0][1] = 0;
      arrCoins[0].position.set(coinPosns[0][0],coinPosns[0][1],coinPosns[0][2]);
      velocities[0][2] = 1;
      redChance = 0;
    }
    if(scoreset == false){
      score -= 20;
    }
    coinPosns[9][0] = 2.5; coinPosns[9][1] = 2.5;
    velocities[9][0] = 0;velocities[9][1] = 0;
    arrCoins[9].position.set(coinPosns[9][0],coinPosns[9][1],coinPosns[9][2]);
    strike = 2;
  }

  for( var i = 0; i < 9; i++ ){
    if( (Math.abs(coinPosns[i][0] - 2) <= 0.12 && Math.abs(coinPosns[i][1] + 2) <= 0.12 )/*2,-2*/
    || (Math.abs(coinPosns[i][0] + 2) <= 0.12 && Math.abs(coinPosns[i][1] + 2) <= 0.12 )/*-2, -2*/  
    || (Math.abs(coinPosns[i][0] - 2) <= 0.12 && Math.abs(coinPosns[i][1] - 2) <= 0.12 )/*2, 2*/  
    || (Math.abs(coinPosns[i][0] + 2) <= 0.12 && Math.abs(coinPosns[i][1] - 2) <= 0.12 )/*-2, 2*/  ){
      PocketSfx.play();
      if(i == 1 || i == 2 || i == 3 || i == 4){
        if(redFlag == 1){
          redFlag = 2;
          if(scoreset == false){
            score += 25;
          }
        }
        else{
          if(scoreset == false){
            score += 5;
          }
          redChance = 0;
        }
        switch(i){
          case 1:
            coinPosns[i][0] = -(3.5); coinPosns[i][1] = 1;
            break;
          case 2:
            coinPosns[i][0] = -(3.6); coinPosns[i][1] = 1;
            break;
          case 3:
            coinPosns[i][0] = -(3.7); coinPosns[i][1] = 1;
            break;
          case 4:
            coinPosns[i][0] = -(3.8); coinPosns[i][1] = 1;
            break;
        }
        arrCoins[i].position.set(coinPosns[i][0],coinPosns[i][1],coinPosns[i][2]);
        velocities[i][0] = 0; velocities[i][1] = 0; velocities[i][2] = 0;

        strike = 1;
      }
      else if(i == 5 || i == 6 || i == 7 || i == 8){
        if(redFlag == 1){
          redChance = 0;
          if(scoreset == false){
            score -= 20;
          }
        }
        else{
          if(scoreset == false){
            score -= 20;
          }
          redChance = 0;
        }
        switch(i){
          case 5:
            coinPosns[i][0] = -(3.5); coinPosns[i][1] = 2;
            break;
          case 6:
            coinPosns[i][0] = -(3.6); coinPosns[i][1] = 2;
            break;
          case 7:
            coinPosns[i][0] = -(3.7); coinPosns[i][1] = 2;
            break;
          case 8:
            coinPosns[i][0] = -(3.8); coinPosns[i][1] = 2;
            break;
        }

        SCENE.remove(arrCoins[i]);
        var cgeometry = new THREE.CylinderGeometry( 0.08, 0.08, 0.025, 32 );
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(coinPosns[i][0],coinPosns[i][1],coinPosns[i][2]);
        cylinder.rotateX(Math.PI/2);
        arrCoins[i] = cylinder;
        SCENE.add(arrCoins[i]);
        velocities[i][0] = 0; velocities[i][1] = 0; velocities[i][2] = 0;

        strike = 2;
      }
      else{
        if(redFlag == 0){
          numofticks = 0;
          redFlag = 1;
          redChance = 1;
          coinPosns[0][0] = -3.5; coinPosns[0][1] = 1.5;
          arrCoins[0].position.set(coinPosns[0][0],coinPosns[0][1],coinPosns[0][2]);
          velocities[i][0] = 0; velocities[i][1] = 0; velocities[i][2] = 0;
        }
        strike = 3;
      }

    }
  }

  if(redFlag == 1 && redChance == 1 && numofticks == 2){
    redChance = 0;
  }
  else if(redFlag == 1 && redChance == 0){
    redFlag = 0;
    coinPosns[0][0] = 0; coinPosns[0][1] = 0;
    arrCoins[0].position.set(coinPosns[0][0],coinPosns[0][1],coinPosns[0][2]);
    velocities[0][2] = 1;
  }

  if(cammode == 3){
    lookX = coinPosns[9][0]; lookY = coinPosns[9][1]; lookZ = coinPosns[9][2];
  }

}

var main=function() {
  alert("You play white. GOOD LUCK!!")
  //AmbienceSfx.play();
  //Processing array
  processing = new Array(10);
  for (var i = 0; i < 10; i++) {
    processing[i] = new Array(10);
    processing[i][0] = 0;
    processing[i][1] = 0;
    processing[i][2] = 0;
    processing[i][3] = 0;
    processing[i][4] = 0;
    processing[i][5] = 0;
    processing[i][6] = 0;
    processing[i][7] = 0;
    processing[i][8] = 0;
    processing[i][9] = 0;
  }

  //Coin arrays declared
  arrCoins = [10];
  coinPosns = new Array(10);
  for (var i = 0; i < 10; i++) {
    coinPosns[i] = new Array(3);
  }

  //Velocities array
  velocities = [10];  //x, y and active
  var temps = new Array(10);
  for (var i = 0; i < 10; i++) {
    velocities[i] = new Array(3);
    velocities[i][0] = velocities[i][1] = 0;  //x and y component of velocities are zero
    velocities[i][2] = 1;  //mark as active
  }

  clock = new THREE.Clock();

  CANVAS=document.getElementById("your_canvas");

  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;

  var RENDERER=new THREE.WebGLRenderer({
    antialias  : true,
    canvas : CANVAS,
  });

  //create the scene
  SCENE = new THREE.Scene();
  //scene created
  
  //create spotlight
  spotLight= new THREE.SpotLight( 0xffffff );
  //spotlight created

  //keyboard input
  window.onkeydown=function(event){
    keyUpDown(event.keyCode, 0.1);
  };
  window.onkeyup=function(event){
    keyUpDown(event.keyCode, 0);
  };

  var keyUpDown=function(keycode, sensibility) {
    switch(keycode) {

      case 32: //Space - power
          if(state == 0){
            SCENE.remove(line);
            state = 1;
            var actualpower = -power;
            velocities[9][0] = -actualpower*Math.sin(theta * (Math.PI/180));
            velocities[9][1] = -actualpower*Math.cos(theta * (Math.PI/180));
          }
        break;
      case 37: //Left
        if(coinPosns[9][0] + 0.03 < 1.3 && state == 0){
          coinPosns[9][0] += 0.03;
          arrCoins[9].position.set(coinPosns[9][0],coinPosns[9][1],coinPosns[9][2]);

          SCENE.remove(line);
          var linematerial = new THREE.LineBasicMaterial({ color: 0xff0000 });
          var linegeometry = new THREE.Geometry();
          linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0], coinPosns[9][1], 0));
          linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0] - Math.sin(theta*(Math.PI/180)), coinPosns[9][1] - Math.cos(theta*(Math.PI/180)), 0));
          line = new THREE.Line(linegeometry, linematerial);
          SCENE.add(line);
        }
        break;
      case 38: //Up
        if(power > -3){
         power -= 0.1;
        }
        break;
      case 39: //Right
        if(coinPosns[9][0] - 0.03 > -1.28 && state == 0){
          coinPosns[9][0] -= 0.03;
          arrCoins[9].position.set(coinPosns[9][0],coinPosns[9][1],coinPosns[9][2]);

          SCENE.remove(line);
          var linematerial = new THREE.LineBasicMaterial({ color: 0xff0000 });
          var linegeometry = new THREE.Geometry();
          linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0], coinPosns[9][1], 0));
          linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0] - Math.sin(theta*(Math.PI/180)), coinPosns[9][1] - Math.cos(theta*(Math.PI/180)), 0));
          line = new THREE.Line(linegeometry, linematerial);
          SCENE.add(line);
        }
        break;
      case 40: //Down
        if(power < 0){
          power += 0.1;
        }
        break;

      case 49: //num 1
        cammode = 1;  //Top View
        break;
      case 50: //num 2
        cammode = 2;  //Player Cam
        break;
      case 51: //num 3
        cammode = 3;  //Coin Cam
        break;

      case 65: //a - left rotate
        if(theta > -90 && state == 0){
          theta -= 1;
          SCENE.remove(line);
          var linematerial = new THREE.LineBasicMaterial({ color: 0xff0000 });
          var linegeometry = new THREE.Geometry();
          linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0], coinPosns[9][1], 0));
          linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0] - Math.sin(theta*(Math.PI/180)), coinPosns[9][1] - Math.cos(theta*(Math.PI/180)), 0));
          line = new THREE.Line(linegeometry, linematerial);
          SCENE.add(line);
        }
        break;
      case 68: //d - right rotate
        if(theta < 90 && state == 0){
          theta += 1;
          SCENE.remove(line);
          var linematerial = new THREE.LineBasicMaterial({ color: 0xff0000 });
          var linegeometry = new THREE.Geometry();
          linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0], coinPosns[9][1], 0));
          linegeometry.vertices.push(new THREE.Vector3(coinPosns[9][0] - Math.sin(theta*(Math.PI/180)), coinPosns[9][1] - Math.cos(theta*(Math.PI/180)), 0));
          line = new THREE.Line(linegeometry, linematerial);
          SCENE.add(line);
        }
        break;

      case 66: //back
        subcammode = (subcammode - 1 + 8) % 9;
        break;
      case 78: //next
        subcammode = (subcammode + 1) % 9;
        break;

    } //end switch keycode
  };
  //keyboard input done

  //the ground
  var planeGeometry = new THREE.PlaneGeometry(5, 5);
  var planeMaterial = new THREE.MeshPhongMaterial( {
    ambient: 0x555555,
    color: 0xdddddd,
    specular: 0x009900,
    map: THREE.ImageUtils.loadTexture('board.jpg'),
    shininess: 30 });
  var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

  planeMaterial.map.wrapS = THREE.RepeatWrapping;
  planeMaterial.map.wrapT = THREE.RepeatWrapping;
  planeMaterial.map.repeat.set(200, 200);



  planeMesh.position.set(0.01,0.0095,0); //center of the ground quad

  planeMaterial.map.repeat.x = planeMaterial.map.repeat.y = 1;
  SCENE.add(planeMesh);



  //Coin add
  for (var i=0; i<10; i++) {
    var cgeometry = new THREE.CylinderGeometry( 0.08, 0.08, 0.025, 32 );
    switch(i){
      case 0:
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(0,0,0);
        coinPosns[i][0] = 0; coinPosns[i][1] = 0; coinPosns[i][2] = 0;
        break;
      case 1:
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(0,0.2,0);
        coinPosns[i][0] = 0; coinPosns[i][1] = 0.2; coinPosns[i][2] = 0;
        break;
      case 2:
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(0,-0.2,0);
        coinPosns[i][0] = 0; coinPosns[i][1] = -0.2; coinPosns[i][2] = 0;
        break;
      case 3:
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(0.2,0,0);
        coinPosns[i][0] = 0.2; coinPosns[i][1] = 0; coinPosns[i][2] = 0;
        break;
      case 4:
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(-0.2,0,0);
        coinPosns[i][0] = -0.2; coinPosns[i][1] = 0; coinPosns[i][2] = 0;
        break;
      case 5:
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(-0.15,-0.15,0);
        coinPosns[i][0] = -0.15; coinPosns[i][1] = -0.15; coinPosns[i][2] = 0;
        break;
      case 6:
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(-0.15,0.15,0);
        coinPosns[i][0] = -0.15; coinPosns[i][1] = 0.15; coinPosns[i][2] = 0;
        break;
      case 7:
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(0.15,-0.15,0);
        coinPosns[i][0] = 0.15; coinPosns[i][1] = -0.15; coinPosns[i][2] = 0;
        break;
      case 8:
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(0.15,0.15,0);
        coinPosns[i][0] = 0.15; coinPosns[i][1] = 0.15; coinPosns[i][2] = 0;
        break;
      case 9:
        var cgeometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.025, 32 );
        var cmaterial = new THREE.MeshBasicMaterial( {color: 0x0080ff} );
        var cylinder = new THREE.Mesh( cgeometry, cmaterial );
        cylinder.position.set(0,1.42,0);
        coinPosns[i][0] = 0; coinPosns[i][1] = 1.42; coinPosns[i][2] = 0.0;

        var linematerial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        var linegeometry = new THREE.Geometry();
        linegeometry.vertices.push(new THREE.Vector3(0, 1.42, 0));
        linegeometry.vertices.push(new THREE.Vector3(0, 1.42 - 1, 0));
        line = new THREE.Line(linegeometry, linematerial);
        SCENE.add(line);

        break;
    }
    cylinder.rotateX(Math.PI/2);
    arrCoins[i] = cylinder;
    SCENE.add( cylinder );
  }
  //Coin done

  //Power bar
  var cgeometry = new THREE.CubeGeometry( 0.3, 3 , 0 );
  var cmaterial = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
  var uppowercube = new THREE.Mesh( cgeometry, cmaterial );
  uppowercube.position.set(3,0,0);
  SCENE.add( uppowercube );
  var ccgeometry = new THREE.BoxGeometry( 0.3, 0.1, 0.1 );
  var ccmaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
  redBar = new THREE.Mesh( ccgeometry, ccmaterial );
  redBar.position.set(3, 1.5 ,0);
  SCENE.add( redBar );
  //Power bar done

  var oldtime = clock.getElapsedTime();
  //RENDER LOOP
  var animate=function() {
    getCamera();
    SCENE.add(CAMERA);

    getSpotlight();
    SCENE.add(spotLight);

    updatePowerBar();
    updateCoins();
    //displayScore();

    if( clock.getElapsedTime() - oldtime >= 5){
      score -= 1;
      oldtime = clock.getElapsedTime();
      strike = 0;
    }

    if(strike == 1){
      document.getElementById('score').innerHTML = "SCORE " + score + " +5 Points !!";  
    }
    else if(strike == 2){
      document.getElementById('score').innerHTML = "SCORE " + score + " -20 Points !!";
    }
    else if(strike == 3){
      document.getElementById('score').innerHTML = "SCORE " + score + " You pocketed a RED! Pocket a WHITE in this turn to get +25 Points !!";
    }
    else{
      document.getElementById('score').innerHTML = "SCORE " + score;
    }
    requestAnimationFrame( animate );
    RENDERER.render( SCENE, CAMERA );
  };
  animate();
};
