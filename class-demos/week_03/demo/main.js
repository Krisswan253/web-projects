window.onload= () =>{
    const moveDiv= document.getElementById('move');

    //getting first button

    const rotateButton=document.getElementById('rotate');


    //adjust angle of the div

    let angle= 0;

    //rotate the moveDiv using css js
    rotateButton.addEventListener('click',()=>{
     
        //grab the roation using style 
       // moveDiv.style.transform= "rotate("+ angle + "deg)"
    
       //shorthand to inject varaibles into strings
    

       //setinterval takes in 2 params: callback function (interval elaspses), amount of time before interval happens again in milliseconds

      intervalId = setInterval(()=>{
         angle++ //increase moveDiv by 1
        moveDiv.style.transform=`rotate(${angle}deg)`

        leftPos += speed;
        if (leftPos >= window.innerWidth || leftPos <0){
            speed*= -1
        }
        moveDiv.style.left= leftPos;

       },10);
    });
     stopButton.addEventListener('click',()=>{
        const stopButton = document.getElementById('stop')
    let angle = 0;
    let intervalId;
   
    });

    
    setInterval( ()=>{

    let date= new Date()
    time.textContent =
    date.getHours()%12 +
    ":" + 
    date.getMinutes() +
     ":" + 
    date.getSeconds()
    }, 1000)

};

