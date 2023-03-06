window.addEventListener('load', init, false);

const konnyu =[
    ["W","W","W", 1 ,"W","W","W"],
    ["W", 0 ,"W","W","W", 2 ,"W"],
    ["W","W","W","W","W","W","W"],
    ["B","W","W","B","W","W","B"],
    ["W","W","W","W","W","W","W"],
    ["W","B","W","W","W", 2 ,"W"],
    ["W","W","W", 3 ,"W","W","W"]
    ];

const halado =[
    ["W","W", 0 ,"W","B","W","W"],
    ["W","W","W","W","W","W","W"],
    ["B","W","B","W", 3 ,"W","B"],
    ["W","W","W", 1 ,"W","W","W"],
    [ 2 ,"W","B","W","B","W","B"],
    ["W","W","W","W","W","W","W"],
    ["W","W","B","W", 2 ,"W","W"]
    ];

const extrem =[
    ["W","B","W","W","W","W","W","W","W","W"],
    ["W","W","W","W","W", 3 ,"W", 2 ,"W","B"],
    ["W", 0 ,"B","W","W","W","W","B","W","W"],
    ["W","W","W","W","B","W","W","W","W","W"],
    ["W", 1 ,"W","W","B", 1 ,"B","W","W","W"],
    ["W","W","W","B","B","B","W","W", 3 ,"W"],
    ["W","W","W","W","W","B","W","W","W","W"],
    ["W","W", 1 ,"W","W","W","W", 0 ,"B","W"],
    [ 3 ,"W","B","W", 0 ,"W","W","W","W","W"],
    ["W","W","W","W","W","W","W","W", 0 ,"W"]
    ];

    var player;
    var current;
    var saved;
    var ctx1;
    var ctx2;
    var bulb = new Image();
    bulb.src = 'bulb.png';
    var lights;
    var blacks;
    var currentmap;
    var savedmap;
    var duration;

function init(){
    currentmap = "";
    player = "Mumei";
    duration = 0;
    ctx1 = document.getElementById('canvas7').getContext('2d');
    ctx2 = document.getElementById('canvas10').getContext('2d');
    document.querySelector('#leirasgomb').addEventListener('click', unhide, false);
    document.querySelector('#palyagomb').addEventListener('click', unhide, false);
    document.querySelector('#palyagomb').addEventListener('click', hideres, false);
    document.querySelector('#newname').addEventListener('click', unhide, false);
    document.querySelector('#namebutton').addEventListener('click', hide, false);
    document.querySelector('#namebutton').addEventListener('click', setname, false);
    document.querySelector('#map1').addEventListener('click', startkonnyu, false);
    document.querySelector('#map2').addEventListener('click', starthalado, false);
    document.querySelector('#map3').addEventListener('click', startextrem, false);
    document.querySelector('#map4').addEventListener('click', startsave, false);
    document.querySelector('#save').addEventListener('click', save, false);
    document.querySelector('#check').addEventListener('click', checksolution, false);
    document.getElementById('canvas7').addEventListener('click', step, false);
    document.getElementById('canvas10').addEventListener('click', step, false);
    document.getElementById('results').addEventListener('click', unhide, false);
    window.setInterval(timer, 1000);
}

function timer(){
    duration++;
    var string
    if (duration > 60){
        string = "" + Math.floor(duration/60) + " p " + duration%60 + " mp";
    }else{
        string = "" + duration + " mp";
    }

    document.getElementById('time').innerHTML = string;
}

function hideres(){
    document.querySelector('#helyes').hidden=true;
    document.querySelector('#helytelen').hidden=true;
}

function setname(){
    player = document.getElementById('name').value;
    document.getElementById('player').innerHTML = player;
}

function save(){
    savedmap = currentmap;
    saved = [];
    for(let i = 0; i < current.length; i++){
        saved.push(current[i].slice())
    }
    document.getElementById('map4').hidden = false;
    document.getElementById('map4').value = "" + player + " játékának folytatása";
}

function startsave(event){
    hide(event)
    currentmap = savedmap;
    duration = 0;
    current = [];
    for(let i = 0; i < saved.length; i++){
        current.push(saved[i].slice())
    }
    blacks = [];
    calcblacks();
    draw();
    if(current.length === 7){
        gamesmall();
    }else{
        gamebig();
    }
    lights = [];
    for (let x = 0; x < current.length; x++){
        for (let y = 0; y < current.length; y++){
            if (current[x][y] === "T"){
                lights.push("" + x + y);
                for(let l = 0; l < 4; l++){
                    calculatelightline(x,y,l);
                }
            }
        }
    }
}

function startkonnyu(event){
    hide(event)
    duration = 0;
    currentmap = "Könnyű";
    current = [];
    for(let i = 0; i < konnyu.length; i++){
        current.push(konnyu[i].slice())
    }
    blacks = [];
    lights = [];
    calcblacks();
    draw();
    gamesmall();
    document.getElementById("canvas7").scrollIntoView();
}

function starthalado(event){
    hide(event)
    duration = 0;
    currentmap = "Haladó";
    current = [];
    for(let i = 0; i < halado.length; i++){
        current.push(halado[i].slice())
    }
    blacks = [];
    lights = [];
    calcblacks();
    draw();
    gamesmall();
    document.getElementById("canvas7").scrollIntoView();
}

function startextrem(event){
    hide(event)
    duration = 0;
    currentmap = "Extrém";
    current = [];
    for(let i = 0; i < extrem.length; i++){
        current.push(extrem[i].slice())
    }
    blacks = [];
    lights = [];
    calcblacks();
    draw();
    gamebig();
    document.getElementById("canvas10").scrollIntoView();
}
  
function unhide(event){
    var element= event.target.parentElement.getElementsByClassName("hide")[0];
    if  (element.hidden){
        element.hidden = false;
    }else{
        element.hidden = true;
    }
}

function hide(event){
    var element = event.target.parentElement;
    element.hidden = true; 
}
 
function draw(){
    var ctx;
    var x = current.length;
    if (x === 7){
        ctx = ctx1;
    }else{
        ctx = ctx2;
    }
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,x*100,x*100);
    for (let i = 0;i<x;i++){
        for(let j = 0;j<x;j++){
            if(current[i][j] === "B"){
                ctx.fillStyle = "black";
                ctx.fillRect(j*100,i*100,100,100);
            }
            if(current[i][j] === 0){
                ctx.fillStyle = "black";
                ctx.fillRect(j*100,i*100,100,100);
                
                ctx.font = "50px Arial";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText("0", (j*100)+50,(i*100)+65);
            }
            if(current[i][j] === 1){
                ctx.fillStyle = "black";
                ctx.fillRect(j*100,i*100,100,100);
                
                ctx.font = "50px Arial";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText("1", (j*100)+50,(i*100)+65);
            }
            if(current[i][j] === 2){
                ctx.fillStyle = "black";
                ctx.fillRect(j*100,i*100,100,100);
                
                ctx.font = "50px Arial";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText("2", (j*100)+50,(i*100)+65);
            }
            if(current[i][j] === 3){
                ctx.fillStyle = "black";
                ctx.fillRect(j*100,i*100,100,100);
                
                ctx.font = "50px Arial";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText("3", (j*100)+50,(i*100)+65);
            }
            if(current[i][j] === 4){
                ctx.fillStyle = "black";
                ctx.fillRect(j*100,i*100,100,100);
                
                ctx.font = "50px Arial";
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.fillText("4", (j*100)+50,(i*100)+65);
            }
            if (current[i][j] === "T"){
                ctx.fillStyle = "yellow";
                ctx.fillRect(j*100,i*100,100,100);
                ctx.drawImage(bulb, (j*100)+25, (i*100)+25, 50, 50 );
            }
            if (current[i][j] === "L"){
                ctx.fillStyle = "yellow";
                ctx.fillRect(j*100,i*100,100,100);
            }
        }
    }
    for (let i = 1;i<x;i++){
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.moveTo(0, i*100);
        ctx.lineTo(x*100 , i* 100);
        ctx.stroke();
    }
    for (let i = 1;i<x;i++){
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.moveTo(i*100, 0);
        ctx.lineTo(i* 100, x*100);
        ctx.stroke();
    }
    checkblacks();
}

function gamesmall(){
    document.getElementById('game').hidden = false;
    document.getElementById('canvas7').hidden = false;
    document.getElementById('canvas10').hidden = true;
    document.getElementById('save').hidden = false;
}

function gamebig(){
    document.getElementById('game').hidden = false;
    document.getElementById('canvas7').hidden = true;
    document.getElementById('canvas10').hidden = false;
    document.getElementById('save').hidden = false;
}

function step(event){
    if (current.length === 7){
        var elem = document.getElementById('canvas7');
    }else{
        var elem = document.getElementById('canvas10');
    }

    let elemleft = elem.offsetLeft + elem.clientLeft;
    let elemtop = elem.offsetTop + elem.clientTop;
    let posx = event.pageX - elemleft;
    let posy = event.pageY - elemtop;
    let y = Math.floor(posx/100);
    let x = Math.floor(posy/100);

    if (current[x][y] === "W" || current[x][y] === "L"){

        current[x][y]= "T" ;
        lights.push("" + x + y);
        for(let j = 0; j < 4; j++){
            calculatelightline(x,y,j);
        }

    }else if(current[x][y] === "T"){

        current[x][y] = "W"
        const index = lights.indexOf("" + x + y);

        if (index > -1) {
            lights.splice(index, 1);
        }

        for(let r = 0; r < current.length; r++){
            for(let c = 0; c < current.length; c++){
                if (current[r][c] == "T" || current[r][c] == "L"){
                    current[r][c] = "W";
                }
            }
        }

        for (let i = 0; i < lights.length; i++){

            let lightx = parseInt(lights[i].split('')[0]);
            let lighty = parseInt(lights[i].split('')[1]);
    
            current[lightx][lighty] = "T";
            for(let j = 0; j < 4; j++){
                calculatelightlineremove(lightx,lighty,j);
            }
        }
        draw();
    }
}

function calcblacks(){
    for(let i = 0; i < current.length; i++){
        for(let j = 0; j < current.length; j++){
            if(current[i][j]==0){
                blacks.push({
                    szam: 0,
                    posx: i,
                    posy: j
                });
            }
            if(current[i][j]==1){
                blacks.push({
                    szam: 1,
                    posx: i,
                    posy: j
                });
            }
            if(current[i][j]==2){
                blacks.push({
                    szam: 2,
                    posx: i,
                    posy: j
                });
            }
            if(current[i][j]==3){
                blacks.push({
                    szam: 3,
                    posx: i,
                    posy: j
                });
            }
            if(current[i][j]==4){
                blacks.push({
                    szam: 4,
                    posx: i,
                    posy: j
                });
            }
        }
    }
}

function calculatelightline(x,y,direction){
    if (direction == 0){
        if (current[x+1] !== undefined){
            if (current[x+1][y]=="W" || current[x+1][y]=="L"){
                current[x+1][y] = "L";
                setTimeout(() => calculatelightline(x+1,y,direction), 200)
            }
            if (current[x+1][y]=="T"){
                setTimeout(() => calculatelightline(x+1,y,direction), 200)
            }
        }
    }
    if (direction == 1){
        if (current[x][y+1]!== undefined){
            if (current[x][y+1]=="W" || current[x][y+1]=="L"){
                current[x][y+1] = "L";
                setTimeout(() => calculatelightline(x,y+1,direction), 200)
            }
            if (current[x][y+1]=="T"){
                setTimeout(() => calculatelightline(x,y+1,direction), 200)
            }
        }
    }
    if (direction == 2){
        if (current[x-1] !== undefined){
            if (current[x-1][y]=="W" || current[x-1][y]=="L"){
                current[x-1][y] = "L";
                setTimeout(() => calculatelightline(x-1,y,direction), 200)
            }
            if (current[x-1][y]=="T"){
                setTimeout(() => calculatelightline(x-1,y,direction), 200)
            }
        }
    }
    if (direction == 3){
        if (current[x][y-1]!== undefined){
            if (current[x][y-1]=="W" || current[x][y-1]=="L"){
                current[x][y-1] = "L";
                setTimeout(() => calculatelightline(x,y-1,direction), 200)
            }
            if (current[x][y-1]=="T"){
                setTimeout(() => calculatelightline(x,y-1,direction), 200)
            }
        }
    }
    draw();
}

function calculatelightlineremove(x,y,direction){
    if (direction == 0){
        if (current[x+1] !== undefined){
            if (current[x+1][y]=="W" || current[x+1][y]=="L"){
                current[x+1][y] = "L";
                calculatelightlineremove(x+1,y,direction)
            }
            if (current[x+1][y]=="T"){
                calculatelightlineremove(x+1,y,direction)
            }
        }
    }
    if (direction == 1){
        if (current[x][y+1]!== undefined){
            if (current[x][y+1]=="W" || current[x][y+1]=="L"){
                current[x][y+1] = "L";
                calculatelightlineremove(x,y+1,direction)
            }
            if (current[x][y+1]=="T"){
                calculatelightlineremove(x,y+1,direction)
            }
        }
    }
    if (direction == 2){
        if (current[x-1] !== undefined){
            if (current[x-1][y]=="W" || current[x-1][y]=="L"){
                current[x-1][y] = "L";
                calculatelightlineremove(x-1,y,direction)
            }
            if (current[x-1][y]=="T"){
                calculatelightlineremove(x-1,y,direction)
            }
        }
    }
    if (direction == 3){
        if (current[x][y-1]!== undefined){
            if (current[x][y-1]=="W" || current[x][y-1]=="L"){
                current[x][y-1] = "L";
                calculatelightlineremove(x,y-1,direction)
            }
            if (current[x][y-1]=="T"){
                calculatelightlineremove(x,y-1,direction)
            }
        }
    }
    draw();
}

function checkbulbsinsight(x,y,direction,mis){
    var mistake = mis;
    if (direction == 0){
        if (current[x+1] !== undefined){
            if (current[x+1][y]=="W" || current[x+1][y]=="L"){
                mistake += checkbulbsinsight(x+1,y,direction,mistake);
            }
            if (current[x+1][y]=="T"){
                mistake++;
            }
        }
    }
    if (direction == 1){
        if (current[x][y+1]!== undefined){
            if (current[x][y+1]=="W" || current[x][y+1]=="L"){
                mistake += checkbulbsinsight(x,y+1,direction,mistake);
            }
            if (current[x][y+1]=="T"){
                mistake++;
            }
        }
    }
    if (direction == 2){
        if (current[x-1] !== undefined){
            if (current[x-1][y]=="W" || current[x-1][y]=="L"){
                mistake += checkbulbsinsight(x-1,y,direction,mistake);
            }
            if (current[x-1][y]=="T"){
                mistake++;
            }
        }
    }
    if (direction == 3){
        if (current[x][y-1]!== undefined){
            if (current[x][y-1]=="W" || current[x][y-1]=="L"){
                mistake += checkbulbsinsight(x,y-1,direction,mistake);
            }
            if (current[x][y-1]=="T"){
                mistake++;
            }
        }
    }
    return mistake;
}

function checkblacks(){
    var ctx;
    var x = current.length;
    if (x === 7){
        ctx = ctx1;
    }else{
        ctx = ctx2;
    }
    for(let j = 0; j < blacks.length; j++){
        var lamps = 0;
        if (current[blacks[j].posx+1]!== undefined){
            if (current[blacks[j].posx+1][blacks[j].posy] == "T"){
                lamps++;
            }
        }
        if (current[blacks[j].posx][blacks[j].posy+1]!== undefined){
            if (current[blacks[j].posx][blacks[j].posy+1] == "T"){
                lamps++;
            }
        }
        if (current[blacks[j].posx-1]!== undefined){
            if (current[blacks[j].posx-1][blacks[j].posy] == "T"){
                lamps++;
            }
        }
        if (current[blacks[j].posx][blacks[j].posy-1]!== undefined){
            if (current[blacks[j].posx][blacks[j].posy-1] == "T"){
                lamps++;
            }
        }
        if (lamps == blacks[j].szam){
            
            ctx.fillStyle = "black";
            ctx.fillRect(blacks[j].posy*100,blacks[j].posx*100,100,100); 
            ctx.font = "50px Arial";
            ctx.fillStyle = 'green';
            ctx.textAlign = "center";
            ctx.fillText(blacks[j].szam, (blacks[j].posy*100)+50,(blacks[j].posx*100)+65);
        }
    }
}

function checksolution(){
    var mistake = 0;
    for(let i = 0; i < lights.length; i++){
        let lightx = parseInt(lights[i].split('')[0]);
        let lighty = parseInt(lights[i].split('')[1]);
        for(let j = 0; j < 4; j++){
            mistake += checkbulbsinsight(lightx,lighty,j,0);
        }
    }

    for(let j = 0; j < blacks.length; j++){
        var lamps = 0;
        if (current[blacks[j].posx+1]!== undefined){
            if (current[blacks[j].posx+1][blacks[j].posy] == "T"){
                lamps++;
            }
        }
        if (current[blacks[j].posx][blacks[j].posy+1]!== undefined){
            if (current[blacks[j].posx][blacks[j].posy+1] == "T"){
                lamps++;
            }
        }
        if (current[blacks[j].posx-1]!== undefined){
            if (current[blacks[j].posx-1][blacks[j].posy] == "T"){
                lamps++;
            }
        }
        if (current[blacks[j].posx][blacks[j].posy-1]!== undefined){
            if (current[blacks[j].posx][blacks[j].posy-1] == "T"){
                lamps++;
            }
        }
        if (lamps != blacks[j].szam){
            mistake++;
        }
    }

    if (mistake>0){
        document.getElementById("helytelen").hidden = false;
        document.getElementById("helyes").hidden = true;
        document.getElementById('table').innerHTML += result("Helytelen");
        setTimeout(()=> document.getElementById("helytelen").hidden = true,5000);
    }else{
        document.getElementById("helyes").hidden = false;
        document.getElementById("helytelen").hidden = true;
        document.getElementById('table').innerHTML += result("Helyes");
        document.getElementById('canvas7').hidden = true;
        document.getElementById('canvas10').hidden = true;
        document.getElementById('player').hidden = true;
        document.getElementById('time').hidden = true;
        document.getElementById('save').hidden = true;
    }
}

function result(res){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    var s = "<tr>";
    s += "<td>" + player + "</td>";
    s += "<td>" + currentmap + "</td>";
    s += "<td>" + res + "</td>";
    s += "<td>" + duration + " mp" + "</td>";
    s += "<td>" + dateTime + "</td>";
    s += "</tr>"

    return s;
}