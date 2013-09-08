var GREEN = "hsla(72, 57%, 40%, 0.9);";
var RED = "hsla(6, 83%, 57%,1);";

function getHsla(color) {
  var h,s,l,a, colorString, hsla;

  colorString = color.substring(5,color.length-1);
  hsla = colorString.split(",");

  h = parseInt(hsla[0]);
  s = parseInt(hsla[1]);
  l = parseInt(hsla[2]);
  a = parseFloat(hsla[3]);

  return {h:h, s:s, l:l, a:a}
}

function hslaToColor(hsla){
  var colorString = "hsla(" + hsla.h + "," 
                  + hsla.s + "%,"
                  + hsla.l + "%,"
                  + hsla.a + ")";
  return colorString
}



function BaseLibrary(canvas_id){

  var canvasElement = document.getElementById(canvas_id);
  
  if (canvasElement) {
    
    this.canvas = canvasElement;
    this.context = this.canvas.getContext('2d');
    
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerX = this.width/2;
    this.centerY = this.height/2;
       
    this.shapes = [];
  }
  
}

BaseLibrary.prototype.addSquare = function(size,color,x,y){
  
  var square = {
    size: size,
    color:color,
    x: x,
    y: y,
    points: []
  } 

  var initialX = x - square.size/2;
  var initialY = y - square.size/2;

  
  square.points.push({x:initialX+=square.size , y:initialY});
  square.points.push({x:initialX , y:initialY+=square.size});
  square.points.push({x:initialX-=square.size , y:initialY});
  square.points.push({x:initialX , y:initialY-=square.size}); 
  
  this.shapes.push(square);
  
}

BaseLibrary.prototype.lighten = function(shape, percent) {
  var hsla = getHsla(shape.color);

  if (hsla.l + percent < 100) {
    hsla.l += percent;
  } else {
    hsla.l = 100;
  }

  shape.color = hslaToColor(hsla);
}


BaseLibrary.prototype.darken = function(shape, percent) {
  var hsla = getHsla(shape.color);

  if (hsla.l + percent < 0) {
    hsla.l -= percent;
  } else {
    hsla.l = 0;
  }

  shape.color = hslaToColor(hsla);
}

BaseLibrary.prototype.move = function(shape, a , b){
  var i;
  for (i=0;i<shape.points.length;i++){
    shape.points[i].x += a;
    shape.points[i].y += b;
  }
}

BaseLibrary.prototype.rotate = function(shape, radians){
  var i, cos = Math.cos(radians), sin = Math.sin(radians);

  for (i=0;i<shape.points.length;i++){
    shape.points[i].x = shape.points[i].x * cos - shape.points[i].x * sin;
    shape.points[i].y = shape.points[i].y * cos + shape.points[i].y * sin;
  }
}

BaseLibrary.prototype.drawShape = function(shape) {
  var i;

  this.context.beginPath();
  this.context.moveTo(shape.initialX,shape.initialY);
  
  for (i=0; i<shape.points.length; i++) {
    coordinate = shape.points[i];
    this.context.lineTo(coordinate.x,coordinate.y);
  }
    
  this.context.closePath();

  this.context.fillStyle = shape.color;
  
  this.context.fill();
}

BaseLibrary.prototype.draw = function(){  
  var i,coordinate;  
  
  this.context.clearRect(0, 0, this.width, this.height);

  for (i=0; i<this.shapes.length; i++){
    this.drawShape(this.shapes[i]);
  }
  
}

function Fire(canvas_id , width, height) {
  this.base = new BaseLibrary("the_canvas");
  this.width = width;
  this.height = height;
}

Fire.prototype.start = function(){
  var i,base = this.base;

  for (i=0; i<30; i++) {
    base.addSquare(30, GREEN, base.centerX, base.height);
  }  
  
  base.draw();

  this.animate();
}

Fire.prototype.move = function(){
  var i,xIncrement,yIncrement;

  for (i=0; i<this.base.shapes.length; i++){
    xIncrement = 10*Math.random() - 5;
    yIncrement = -10*Math.random();
    this.base.move(this.base.shapes[i], xIncrement, yIncrement);
    this.base.lighten(this.base.shapes[i], 1);
  }
}

Fire.prototype.animate = function(){
  var that = this;

  (function animloop(){
    requestAnimFrame(animloop);
    that.move();
    that.base.draw();
  })();
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 24);
          };
})();



