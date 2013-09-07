function AnimationLibrary(canvas_id){

  var canvasElement = document.getElementById(canvas_id);
  
  if (canvasElement) {
    
    this.canvas = canvasElement;
    this.context = this.canvas.getContext('2d');
    
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerX = this.width/2;
    this.centerY = this.height/2;
       
    this.objectsToPaint = [];
  }
  
}

AnimationLibrary.prototype.addSquare = function(size,color,x,y){
  var halfSize = size/2;
  var currentX = x - halfSize;
  var currentY = y - halfSize;
  //the square is stored in memory to be drawn later on
  var square = {
    size: size,
    color:color,
    x:x,
    y:y,
    points:[],
    initialX:currentX,
    initialY:currentY
  }  
  square.points.push({x:currentX+=size ,y:currentY});
  square.points.push({x:currentX ,y:currentY+=size});
  square.points.push({x:currentX-=size ,y:currentY});
  square.points.push({x:currentX ,y:currentY-=size}); 
 
  this.objectsToPaint.push(square)
  
}

AnimationLibrary.prototype.draw = function(){  
  var i,coordinate;
  var square = this.objectsToPaint[0];
  
  this.context.clearRect(0, 0, this.width, this.height);
  this.context.beginPath();
  this.context.moveTo(square.initialX,square.initialY);
  
  for (i=0; i<square.points.length; i++) {
    coordinate = square.points[i];
    this.context.lineTo(coordinate.x,coordinate.y);
  }
    
  this.context.closePath();

  this.context.fillStyle = square.color;
  
  this.context.fill();
}

AnimationLibrary.animate = function(){

}