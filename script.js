let addbtn = document.querySelector(".add-btn");

let removebtn = document.querySelector(".remove-btn");

let modalcont = document.querySelector(".modal-cont");

let maincont = document.querySelector(".main-cont");

let textareacont = document.querySelector(".textarea-cont");

let allprioritycolor = document.querySelectorAll(".priority-color");

let colors = ['lightpink', 'lightgreen', 'yellow', 'black'];

let modalprioritycolor = colors[colors.length-1];

let toolboxcolors = document.querySelectorAll(".color");

let addflag = false;
let removeflag = false;

let lockclass = "fa-lock";
let unlockclass = "fa-unlock";

let ticketArr = [];

if(localStorage.getItem("jira-tickets")){
    //Retrive and display tickets
    ticketArr = JSON.parse(localStorage.getItem("jira-tickets"));
    ticketArr.forEach((ticketobj) => {
        createTicket(ticketobj.ticketcolor, ticketobj.tickettask, ticketobj.ticketid); 
    })
}

for(let i=0;i<toolboxcolors.length;i++){
    toolboxcolors[i].addEventListener("click", (e) => {
        let currtoolboxcolor = toolboxcolors[i].classList[0];

        let filteredticket = ticketArr.filter((ticketobj, idx) => {
            return currtoolboxcolor == ticketobj.ticketcolor;
        })
        
        //Remove previous tickets

        let allticketscont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allticketscont.length;i++){
            allticketscont[i].remove();
        }

        //Display new filteredtickets

        filteredticket.forEach((ticketobj, idx) => {
            createTicket(ticketobj.ticketcolor, ticketobj.tickettask, ticketobj.ticketid);
        })
    })

    toolboxcolors[i].addEventListener("dblclick", (e) => {
         //Remove previous tickets

        let allticketscont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allticketscont.length;i++){
            allticketscont[i].remove();
        }

        ticketArr.forEach((ticketobj, idx) => {
        createTicket(ticketobj.ticketcolor, ticketobj.tickettask, ticketobj.ticketid);
        })
    })
}

//listener for modal priority coloring

allprioritycolor.forEach((colorEle, idx) => {
    colorEle.addEventListener("click", (e) => {
        allprioritycolor.forEach((othercolor, idx) => {
            othercolor.classList.remove("border");
        })
        colorEle.classList.add("border");

        modalprioritycolor = colorEle.classList[0];
    })
})
addbtn.addEventListener("click", (e) => {
    //Display Modal
    //Generate Ticket

    //addflag == true, Modal Display
    //addflag ==false, modal none

    addflag = !addflag;
    if(addflag){
        modalcont.style.display = "flex";
    }else{
        modalcont.style.display = "none";
    }
})

removebtn.addEventListener("click", (e) => {
    removeflag = !removeflag;
})

modalcont.addEventListener("keydown", (e) => {
    let key = e.key;
    if(key == "CapsLock"){
        createTicket(modalprioritycolor, textareacont.value);
        setmodaltodefault();
        addflag = false;
    }
})

function createTicket(ticketcolor, tickettask, ticketid){
    let id = ticketid || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketcolor}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="task-area">${tickettask}</div> 
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>   
    `;
    maincont.appendChild(ticketCont);

    //create objet of ticket and add to array
    if(!ticketid) {
        ticketArr.push({ticketcolor, tickettask, ticketid: id});
        localStorage.setItem("jira-tickets", JSON.stringify(ticketArr));
    }

    handleremoval(ticketCont, id);
    handlelock(ticketCont, id);
    handlecolor(ticketCont, id);
}

function handleremoval(ticket, id){
    //if remove true then remove else not
    ticket.addEventListener("click", (e) => {
        if(!removeflag) return;

        let idx = getticketidx(id);
        //DB removal
        ticketArr.splice(idx, 1);
        let strticketsarr = JSON.stringify(ticketArr);
        localStorage.setItem("jira-tickets", strticketsarr);
        ticket.remove();// UI removal
    })
}
   
function handlelock(ticket, id){
    let lockticketele = ticket.querySelector(".ticket-lock");
    let ticketlock = lockticketele.children[0];
    let tickettaskarea = ticket.querySelector(".task-area");

    ticketlock.addEventListener("click", (e) => {
        let ticketidx = getticketidx(id);

        if(ticketlock.classList.contains(lockclass)){
            ticketlock.classList.remove(lockclass);
            ticketlock.classList.add(unlockclass);
            tickettaskarea.setAttribute("contenteditable", "true");
        }else{
            ticketlock.classList.remove(unlockclass);
            ticketlock.classList.add(lockclass);
            tickettaskarea.setAttribute("contenteditable", "false");
        }

        //modify data in local storage(Ticket task)
        ticketArr[ticketidx].tickettask = tickettaskarea.innerText;
        localStorage.setItem("jira-tickets", JSON.stringify(ticketArr));
    })
}

function handlecolor(ticket, id){
    let ticketcolor = ticket.querySelector(".ticket-color");
    ticketcolor.addEventListener("click", (e) => {
        //get ticketidx from ticketarr
        let ticketidx = getticketidx(id);
        let currticketcolor = ticketcolor.classList[1];
        //get ticket color index
        //if the currenttickercolor matches with the color array idx then true
        let matchingcoloridx = colors.findIndex((color) => {
            return currticketcolor == color;
        })
        matchingcoloridx++;
        let newticketcoloridx = matchingcoloridx%colors.length;
        let newticketcolor = colors[newticketcoloridx];

        ticketcolor.classList.remove(currticketcolor);
        ticketcolor.classList.add(newticketcolor);

        //modify data in local storage(priority color change)
        ticketArr[ticketidx].ticketcolor = newticketcolor;
        localStorage.setItem("jira-tickets", JSON.stringify(ticketArr));
    })    
}

function getticketidx(id){
    let ticketidx = ticketArr.findIndex((ticketobj) => {
        return ticketobj.ticketid == id;
    })
    return ticketidx;
}

function setmodaltodefault(){
    modalcont.style.display = "none";
    textareacont.value = "";
    modalprioritycolor = colors[colors.length-1];

    allprioritycolor.forEach((othercolor, idx) => {
        othercolor.classList.remove("border");
    })

    allprioritycolor[allprioritycolor.length-1].classList.add("border");
}

// SIDEBAR

const menuBtn = document.getElementById('menu');
const sidebar = document.querySelector('.box');
const shadow = document.querySelector('.box-shadow');
const body = document.querySelector('body');

menuBtn.addEventListener('click', ()=> {
    sidebar.style.left = '0';
    shadow.style.display = 'block';
    body.style.overflow = 'hidden';
})

shadow.addEventListener('click', ()=> {
    sidebar.style.left = '-300px';
    shadow.style.display = 'none';
    body.style.overflow = 'scroll';
})
