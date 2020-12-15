let conto = 0;

function più(){
    conto += 1;
    document.getElementById('para').innerHTML = conto;

    if(conto<0){
        document.getElementById('para').style.color = 'red';
    }else{
        document.getElementById('para').style.color = 'black'; 
    }
    
}

function meno(){
    conto -= 1;
    document.getElementById('para').innerHTML = conto;
    
    if(conto<0){
        document.getElementById('para').style.color = 'red';
    }else{
        document.getElementById('para').style.color = 'black'; 
    }
}

