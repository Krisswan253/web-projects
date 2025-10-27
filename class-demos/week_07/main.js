// adding event listener based on the window when the size changes 


window.onload = () =>{
    document.body.addEventListener('resize', ()=>{

        let p= document.createElement ('p');
         let p2= document.createElement ('p');
         let p3 = document.createElement ('p');

        p.innerHTML = "window inner width" + window.innerWidth;
         p2.innerHTML = "body inner width" + document.getElementById('body').clientWidth
         p3.innerHTML = "screen width" + screen.width


        document.getElementById('content').appendChild('p')
        document.getElementById('content').appendChild('p2')
        document.getElementById('content').appendChild('p3')
    
    })
}