class Helix{
  constructor(x, y, r, turns, pointsPerTurn){
    this.x =  x;
    this.y = y;
    this.r = r; 
    this.turns = turns; 
    this.pointsPerTurn = pointsPerTurn;
    this.points = [];
    this.bounds ={
      top: height,
      bottom: -height,
      left: width,
      right: -width,
    }

    this.angleIncrement = TWO_PI / pointsPerTurn;
    let i = 0;
    for (let a = 0; a < TWO_PI * turns; a += this.angleIncrement) {
      let point = createVector(this.xSpiral(a), this.ySpiral(a));
      this.points.push({
        angle: a, 
        x: point.x,
        y: point.y, 
        i: i
      });
      // Set bounds
      if(point.x + this.x > this.bounds.right) this.bounds.right = point.x + this.x
      if(point.x + this.x < this.bounds.left) this.bounds.left = point.x + this.x
      if(point.y + this.y < this.bounds.top) this.bounds.top = point.y + this.y
      if(point.y + this.y > this.bounds.bottom) this.bounds.bottom = point.y + this.y
      this.width = this.bounds.right - this.bounds.left;
      this.height = this.bounds.bottom - this.bounds.top;
      i++;
    }
    console.log(this.bounds);
    rect(this.bounds.left, this.bounds.top, this.width, this.height);
  }

  draw(){
    // Create Helix
    push();
    translate(this.x, this.y);
    stroke(0);
    strokeWeight(1.5);
    noFill();
    beginShape();
    
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];
      vertex(point.x, point.y);
    }
    endShape();
    pop();
  }

  drawPoint(point){
    noStroke();
    fill(degrees(point.angle%TWO_PI), 100, 100);
    push();
    translate(this.x, this.y);
    ellipse(point.x, point.y, 15, 15);
    pop();
  }

  isOverY(y){
    return y > this.bounds.top && y < this.bounds.bottom;
  }

  xSpiral(t) {
    return this.r * 1.5 * sin(t);
  }

  ySpiral(t) {
    return this.r * cos(t) - t * 4;
  }
}
