'use strict';

$(window).load(function(){
 
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
        
    var Width,
        Height,
        i,
        circles, 
        playerTimer,
        circlesTimer,
        score, 
        colors,    
        circle,
        player,
        gameStarted;
     
    setCanvasSize();
    
    start();
    
    function start(){
        
        circles = [];       
        score = 0;        
        gameStarted = false;
        
        colors = ['gray', 'skyblue', 'orange', 'chocolate', 'coral', 'limegreen', 'cyan', 'khaki', 'salmon', 'skyblue', 'burlywood', 'mediumpurple', 'goldenrod'];
        
        player = {         
        
            color: "red",
            borderColor: "black",
            size:10,
            defaultSpeed: 8,
            speed: 8,
            x:500,
            y:200              

    }

        //before the game starts show the animation
        generateCircles();
        playerTimer = setInterval(draw, 30); 
        circlesTimer = setInterval(generateCircles, 2000); 
             
    }
    
    $("#canvas").on('mousedown touchstart',function(){   
            
        if(gameStarted){
            
            player.speed = -player.defaultSpeed;
            
        }
            
    });
    
    $("#canvas").on('mouseup touchend', function(){   
            
        if(gameStarted){
            
            player.speed = player.defaultSpeed;
            
        }
            
    });
    
    $(window).keydown(function(e){   
    
       if(e.keyCode === 32){
           
           if(gameStarted === false){
                              
               startGame();    
           }
           else{
               stopGame();
           }
           
       }
        
    });

    function startGame(){
                
        clearInterval(playerTimer);
        clearInterval(circlesTimer);
        ctx.clearRect(0, 0, Width, Height);
        circles = [];
        player.y = 0;
        player.speed = player.defaultSpeed;
        
        generateCircles();
        playerTimer = setInterval(draw, 30); 
        circlesTimer = setInterval(generateCircles, 2000); 
        gameStarted = true;
        score = 0;
        
    }
    
    function stopGame(){
        
        clearInterval(playerTimer);
        clearInterval(circlesTimer);
        gameStarted = false;
        
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.arc(player.x, player.y, 50, 0, 360);
        ctx.stroke();
        
        showStartMsg("Game Over");
        
    }
       
    function draw(){
        
        //clear canvas
        ctx.clearRect(0, 0, Width, Height);
          
        //It iks outside the condition, for the startup aniatiom
        if(circles.length > 0){
                      
            drawCircles();
                        
        } 
        
        if(gameStarted){
            
            drawLine();
            
            //draw player 
            ctx.beginPath();
            if(gameStarted) player.y += player.speed; 
            ctx.fillStyle = player.color;
            ctx.arc(player.x, player.y, player.size, 0, 360);
            ctx.fill();

            ctx.beginPath();        
            ctx.strokeStyle = player.borderColor;
            ctx.arc(player.x, player.y, player.size+1, 0, 360);
            ctx.stroke();
            
           // shakeCircles();
            
            updateScore(); 
        
            //check for collissions
            checkCollission();
                        
        }
        
        else{
            
            showStartMsg("Circle Escape");
            
        }
        
    }

    function checkCollission(){
        
        
        if(circles.length > 1){
            
            for(i=circles.length-1; i>0; i--){
                
                //circle timeout
                if((circles[i].x) < 0){

                    circles.splice(i,1);                    
                    score++;

                }
                
                //Colission with player
                var r1 = player.size;
                var r2 = circles[i].size;
                var x1 = player.x;
                var y1 = player.y;
                var x2 = circles[i].x;
                var y2 = circles[i].y;
                
                var r1r2 = Math.abs(Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2)));
                 
                if(r1r2 < Math.abs(r1+r2)){
                    
                   stopGame();
                }
                
                
            }            
        }
        
        //TOP SCREEEN SCREEN
        if((player.y - player.size/2) < 0){
            
            stopGame();
        }
        
        //BOTTOM SCREEEN SCREEN
        else if((player.y + player.size/2) > Height){
            
            stopGame();
        }
        

        
    }
    
    function generateRandom(min, max){
        
         return Math.floor(Math.random() * (max - min + 1)) + min;
    }
 
    function generateCircles(){
        
        for(i = 0; i < 6; i++){
            
            circles.push({size: generateRandom(20, 60), y: generateRandom(0,Height), x: generateRandom(Width, Width + 500), color: colors[generateRandom(0, colors.length-1)], speed: generateRandom(6,11)});    
            
        }
        
    }
    
    function drawCircles() {
                
        for(length = circles.length-1, i = length; i >= 0; i--){
                   
            circles[i].x -= circles[i].speed;
            
            if(score > 50) circles[i].y += generateRandom(-2, 2);
            else if(score > 80 && circles[i].size > 20) circles[i].size += generateRandom(-1, 1);
            
            ctx.beginPath();
            ctx.fillStyle = circles[i].color;
            ctx.arc(circles[i].x, circles[i].y, circles[i].size, 0, 360);
            ctx.fill();
            
        }
       
    }
    
    function drawLine() {
        
        for(length = circles.length-1, i = length; i > 0; i--){
              
                ctx.strokeStyle = circles[i].color;
                ctx.beginPath();
                ctx.moveTo(player.x, player.y); 
                ctx.lineTo(circles[i].x, circles[i].y);                               
                ctx.stroke();    
           
        }
       
    }
    
    function shakeCircles(){

        for(i = circles.length - 1; i > 0; i--){
            
//            if(circles[i].size >= 20 && circles[i].size <= 40) circles[i].size++;
//            else  circles[i].size--; 
            
            circles[i].color = colors[generateRandom(0, circles.length)];
            
        }   
    }
               
    function setCanvasSize(){
        
        Width = $("body").width();
        Height = $("body").height();
                  
        $("#canvas").attr("width", Width);
        $("#canvas").attr("height", Height);
     
    }
    
    function updateScore(){
        
        ctx.fillStyle = "black";
        ctx.font = "bolder 40px Cursive";
        ctx.fillText("Score : " + score, 50, 50);
         
    }
    
    function showStartMsg(msg){
        
        ctx.fillStyle = "#373737";
        ctx.font = "bolder 100px Cursive";        
        ctx.fillText(msg, Width/2 - (100 * msg.length)/4, Height/2);
        
        ctx.fillStyle = "green";
        ctx.font = "bolder 30px Cursive";
        var mesg = "Press SPACEBAR to start";
        ctx.fillText(mesg, Width/2 - (30 * mesg.length)/4, 2 * Height/3);
        
    }
    
        
});
	
