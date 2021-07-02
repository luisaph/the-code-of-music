function setup() {
  createCanvas(620, 200);
  // angleMode(DEGREES);
}

function draw() {
  stroke(0);
  noFill();
  push();
  let a = sin(frameCount/15)*5;
  beginShape();
  translate(20, height/2);
  vertex(0, 80);
  bezierVertex(a, 20, a, -20, 0, -80);
  endShape();
  pop();
  
  fill(255, 30);
  noStroke();
  rect(0, 0, 30, height);
  fill(255);
  rect(30, 0, width-30, height);
  
  
  noStroke();
  fill(0);
  
  translate(40, 0);
  let m = 20;
  let n = 20;
  let w = width/n;
  let s = 10;
  
  for(let j=0; j<n; j++){  
    for(let i=0; i<n; i++){  
      let x = m + w*i;
      x = x+sin(frameCount/15 - i)*s;
      let y = m + w*j
      ellipse(x, y, s/3, s/3);
    }
  }
}