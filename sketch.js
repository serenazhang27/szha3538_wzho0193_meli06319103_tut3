//array to store SpiralCircle objects
let spiralCircles = [];
let circleDiameter = 200;
let time = 0;

//Create canvas to fit window size
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(2, 85, 122);// Set the background color

  // set up spacing and offsets for spiral circles in grid
  let xSpacing = circleDiameter + 15;
  let ySpacing = circleDiameter + 15;
  let xOffset = -width / 2; 
  
 // SpiralCircle objects in a grid
  for (let y = circleDiameter / 2; y <= height + circleDiameter; y += ySpacing) {
    for (let x = xOffset; x <= width + circleDiameter; x += xSpacing) {
      let spiralCircle = new SpiralCircle(x, y, circleDiameter);
      spiralCircles.push(spiralCircle);
    }
    xOffset += circleDiameter / 2; 
  }
}

function draw() {
  background(2, 85, 122); // background color
  //translate(-100, -100)
  time += 0.05; // Increment time for smooth movement

  for (let i = 0; i < spiralCircles.length; i++) {
    spiralCircles[i].display(time); // Pass `time` to animate each SpiralCircle
  }
}

//  create a spiralCircle class to make circle display and animations
class SpiralCircle {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = diameter / 2; // Added radius property for use in spirals


    // pre-generate random colours for the dots to aviod the strobe
    this.dotColors = [];
    let dotCount = 40;
    for (let i = 0; i < dotCount; i++) {
      this.dotColors.push(color(random(255), random(100), random(255))); // Store random red colours
    }

    this.diametColors = [];
    let numCircles = 10;
    for (let i = 0; i < numCircles; i++) {
      this.diametColors.push(color(random(255), random(255), random(250)));// Store random colors for each layer
    }
  }

  // draw these shapes with animation
  display(time) {
    this.drawPattern(time);
    this.drawOuterRing(time);
    this.drawDynamicSpirals(time);
  }

  // Draw inner circles with dynamic
  drawInnerCircles() {
    let sizes = [45, 25, 10];

    // draw black circle
    fill(0);
    noStroke();
    circle(this.x, this.y, sizes[0]);

    //draw cyan circle
    fill(0, 255, 100);
    noStroke();
    circle(this.x, this.y, sizes[1]);

    //draw white circle
    fill(255);
    noStroke();
    circle(this.x, this.y, sizes[2]);
  }

  // Draw outer circles with dynamic
  drawOuterRing(time) {
    let outerDotCount = 32;
    let outerRadius = (this.diameter + 60) / 2.35;
    let colors = [
      color(255, 0, 0), //Red   
      color(255, 165, 0), //Orange
      color(255, 255, 0)  //Yellow
    ];

    // draw the dots on the outer ring
    for (let j = 0; j < outerDotCount; j++) {
      let angle = map(j, 0, outerDotCount, 0, TWO_PI);
      let offset = cos(time + j * 0.1) * 10; //use'cos()'for radial movement
      let outerDotX = this.x + cos(angle) * (outerRadius + offset);
      let outerDotY = this.y + sin(angle) * (outerRadius + offset);

      fill(colors[j % colors.length]);
      noStroke();
      ellipse(outerDotX, outerDotY, 10, 8); // Reference:https://p5js.org/reference/p5/ellipse/
    }
    
    // Draw the smaller circles around the outer ring
    this.drawEightCircles(outerRadius);
  }

  //draw eight smaller circles around the outer radius
  drawEightCircles(outerRadius) {
    let outerCircleCount = 6;

    for (let i = 0; i < outerCircleCount; i++) {
      let angle = map(i, 0, outerCircleCount, 0, TWO_PI);
      let outerX = this.x + cos(angle) * outerRadius;
      let outerY = this.y + sin(angle) * outerRadius;

      this.drawThreeCircles(outerX, outerY);
    }
  }

  // draw three concentric circles with different sizes
  drawThreeCircles(x, y) {
    let sizes = [20, 13, 5];

    fill(255, 69, 0); // Orange
    noStroke();
    circle(x, y, sizes[0]);

    fill(0); // Black
    noStroke();
    circle(x, y, sizes[1]);

    fill(255); //White
    noStroke();
    circle(x, y, sizes[2]);
  }
  
  //create the dynamic spiral
  drawDynamicSpirals(time) {
    let spiralSize = this.radius * 0.8;
    let angleStep = TWO_PI / 20; // change this for tighter spirals
    let angleOffset = PI / 190; // shift the spiral

    stroke(255, 0, 0); // Solid red line
    strokeWeight(3.5);
    noFill();

    beginShape(); // Begin shape for drawing the spiral 
    for (let i = 0; i < 20; i++) {
      let angle = i * angleStep + time * 0.5 + angleOffset;
      let spiralX = this.x + cos(angle) * spiralSize * (i / 20);
      let spiralY = this.y + sin(angle) * spiralSize * (i / 20);
      vertex(spiralX, spiralY);
    }
    endShape();
  }

  // Draw the main pattern
  drawPattern(time) {
    let numCircles = 10;
    let dotCount = 40;

    for (let i = 0; i < numCircles; i++) {
      let currentDiameter = this.diameter - i * 30;

      fill(this.diametColors[i]);
      noStroke();
      ellipse(this.x, this.y, currentDiameter);
      

    // draw dots around the circle with use sin() and cos() to create smooth radial movement
      for (let j = 0; j < dotCount; j++) {
        let angle = map(j, 0, dotCount, 0, TWO_PI);
        let offset = sin(time + j * 0.1) * 5;
        let dotX = this.x + cos(angle) * (currentDiameter / 2 + offset);
        let dotY = this.y + sin(angle) * (currentDiameter / 2 + offset);

        fill(this.dotColors[j]); // use pre-generated colors for the inside dots
        ellipse(dotX, dotY, 6); // use ellipse to draw the dots
      }
    }

    this.drawInnerCircles();// draw the inner circles
  }
}