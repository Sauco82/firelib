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
  
  var square = {
    size: size,
    color:color    
  }  
 
  square.setPosition = function(x,y){
    this.x        = x;
    this.y        = y;
    this.initialX = x - this.size/2;
    this.initialY = y - this.size/2;
    this.points = [];
    this.points.push({x:this.initialX+=this.size ,y:this.initialY});
    this.points.push({x:this.initialX ,y:this.initialY+=this.size});
    this.points.push({x:this.initialX-=this.size ,y:this.initialY});
    this.points.push({x:this.initialX ,y:this.initialY-=this.size}); 
  }

  square.setPosition(x,y);
  this.objectsToPaint.push(square);
  
}

AnimationLibrary.prototype.drawObject = function(the_object) {
  var i;

  this.context.beginPath();
  this.context.moveTo(the_object.initialX,the_object.initialY);
  
  for (i=0; i<the_object.points.length; i++) {
    coordinate = the_object.points[i];
    this.context.lineTo(coordinate.x,coordinate.y);
  }
    
  this.context.closePath();

  this.context.fillStyle = the_object.color;
  
  this.context.fill();
}

AnimationLibrary.prototype.draw = function(){  
  var i,coordinate;  
  
  this.context.clearRect(0, 0, this.width, this.height);

  for (i=0; i<this.objectsToPaint.length; i++){
    this.drawObject(this.objectsToPaint[i]);
  }
  
}

AnimationLibrary.prototype.animate = function(){
  var that = this;
  interval = setInterval(function(){
    var speed1 = 10*Math.random() -5;
    var speed2 = 10*Math.random() -5;
    var speed3 = 10*Math.random() -5;
    var speed4 = 10*Math.random() -5;

    var square = that.objectsToPaint[0];
    square.setPosition(square.x+speed1,square.y+speed2);


    var square = that.objectsToPaint[1];
    square.setPosition(square.x+speed4,square.y+speed3);


    that.draw();
  }, 1000/24);
}