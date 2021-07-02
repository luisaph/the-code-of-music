// added:
// plow and phigh (boundaries to pick a random point)
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
        i: i,
        r: 15
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
    rect(this.bounds.left, this.bounds.top, this.width, this.height);

    this.plow = this.points[0];
    this.phigh = this.points[this.points.length-1];
    
  }

  draw(){
    // Create Helix
    push();
    translate(this.x, this.y);
    strokeWeight(1.5);
    noFill();

    stroke(60);
    beginShape();
    for (let i = 0; i <= this.plow.i; i++){
      let point = this.points[i];
      vertex(point.x, point.y);
    }
    endShape();
    
    stroke(0);
    beginShape();
    for (let i = this.plow.i; i <= this.phigh.i; i++){
      let point = this.points[i];
      vertex(point.x, point.y);
    }
    endShape();
    
    stroke(60);
    beginShape();
    for (let i = this.phigh.i; i < this.points.length; i++){
      let point = this.points[i];
      vertex(point.x, point.y);
    }
    endShape();
    

    // Draw limits
    fill(0);
    noStroke();
    text(' min ',this.plow.x, this.plow.y + 8);
    ellipse(this.plow.x, this.plow.y, this.plow.r/2, this.plow.r/2);
    text(' max ',this.phigh.x, this.phigh.y + 8);
    ellipse(this.phigh.x, this.phigh.y, this.phigh.r/2, this.phigh.r/2);
    pop();
  }

  drawPoint(point){
    noStroke();
    fill(degrees(point.angle%TWO_PI), 100, 100); 
    push();
    translate(this.x, this.y);
    ellipse(point.x, point.y, point.r, point.r);
    pop();
  }

  isOverPoint(point, targetPoint){
    let x = point.x - this.x;
    let y = point.y - this.y;
    return( x > targetPoint.x - targetPoint.r &&
            x < targetPoint.x + targetPoint.r &&
            y > targetPoint.y - targetPoint.r &&
            y < targetPoint.y + targetPoint.r
          ) 
  }

  closestPointTo(origin, dest){
    // To avoid jumping between turns: 
    // added constraint to closest point: look at where the previous position was, 
    // pick solution that's closest to current position? 
    // should I add these together? 
    let min = this.height * this.width;
    let found = null;
    for (let i = 0; i < this.points.length; i++){
      // let d = abs(origin.i - i) + dist(dest.x, dest.y, this.points[i].x, this.points[i].y);
      let d = abs(origin.i - i)*2 + dist(dest.x-this.x, dest.y-this.y, this.points[i].x, this.points[i].y);
      if(d < min){
        min = d;
        found = this.points[i];
      }
    }
    return found;
  }

  isOverY(y){
    return y > this.bounds.top && y < this.bounds.bottom;
  }

  xSpiral(t) {
    return this.r * 1.5 * sin(t);
  }

  ySpiral(t) {
    return this.r * cos(t) - t * 6;
  }
}
