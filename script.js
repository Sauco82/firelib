/** Request animframe **/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 24);
          };
})();


/** Color functions **/
function Hsla(h,s,l,a) {
  this.h = h;
  this.s = s;
  this.l = l;
  this.a = a;
}

Hsla.prototype.color = function(){
  var colorString = "hsla(" + this.h + "," 
                  + this.s + "%,"
                  + this.l + "%,"
                  + this.a + ")";
  return colorString
}

Hsla.prototype.lighten = function(percent) {
  if ((this.l + percent) < 100) {
    this.l += percent;
  } else {
    this.l = 100;
  }
  return this.l
}

Hsla.prototype.darken = function(percent) {
  if ((this.l - percent) > 0) {
    this.l -= percent;
  } else {
    this.l = 0;
  }
  return this.l
}

/** Main colors **/
var GREEN = new Hsla(72, 57, 40, 0.9);
var RED = new Hsla(6, 83, 57, 1);

/** Canvas helper **/
function CanvasHelper(canvas_id){

  var canvasElement = document.getElementById(canvas_id);
  
  if (canvasElement) {
    
    this.canvas = canvasElement;
    this.context = this.canvas.getContext('2d');
    
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerX = this.width/2;
    this.centerY = this.height/2;

    this.elements = [];

    this.working = false;
       
  }
  
}

CanvasHelper.prototype.start = function(){
  this.working = true;
  this.animate();
}

CanvasHelper.prototype.stop = function(){
  this.working = false;
}

CanvasHelper.prototype.animate = function(){  
  var i,that = this;  

  this.context.clearRect(0, 0, this.width, this.height);

  for (i=0; i<that.elements.length; i++){
    that.elements[i].draw();    
  }
  
  if (that.working) {
    requestAnimationFrame(function(){that.animate();});
  }
}

/** Fire **/
function Fire(width, height, myCanvas,x,y){
  var i,particle;

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.myCanvas = myCanvas;
  this.particles = [];  

  this.left = x-width/2;
  this.right = x+width/2;
  this.bottom = y;
  this.top = y-height;

  for (i = 0; i < 70; i++) {
    particle = new FireParticle(15, GREEN, this.x, this.y);
    this.particles.push(particle);
  };
  
}

Fire.prototype.draw = function(){  
  var i,coordinate;    

  for (i=0; i<this.particles.length; i++){
    this.particles[i].draw(this.myCanvas.context);
  }

  this.move();  
}

Fire.prototype.move = function(){
  var i,xIncrement,yIncrement;

  for (i=0; i<this.particles.length; i++){

    if (this.particles[i].inBoundaries(this.left, this.right, this.bottom, this.top)){
      xIncrement = 14*Math.random() - 7;
      yIncrement = -10*Math.random();
      this.particles[i].x += xIncrement;
      this.particles[i].y += yIncrement;
      this.particles[i].angle += 0.01;    
      this.particles[i].hsla.lighten(0.7);
    } else {
      this.particles[i] = new FireParticle(15, GREEN, this.x, this.y);
    }

  }
}

/** Fire Particle **/
function FireParticle(size,hsla,x,y){
  this.size = size;
  this.hsla = new Hsla(hsla.h, hsla.s, hsla.l, hsla.a);
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.points = [];
  
  //yeah, there are easier ways to get a square
  this.points.push({x: 0 , y: 0});
  this.points.push({x: size , y: 0});
  this.points.push({x: size , y: size});
  this.points.push({x: 0 , y: size});
}

FireParticle.prototype.draw = function(context) {
  var i;

  context.save();
  context.translate(this.x,this.y);
  context.rotate(this.angle)
  context.beginPath();

  for (i=0; i<this.points.length; i++) {
    coordinate = this.points[i];
    context.lineTo(coordinate.x,coordinate.y);
  }
    
  context.closePath();

  context.fillStyle = this.hsla.color();
  
  context.fill();
  context.restore();
}

FireParticle.prototype.inBoundaries = function(left, right, bottom, top){
  return this.x >= left && this.x <= right && this.y <= bottom && this.y >= top
}