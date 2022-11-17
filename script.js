let addbtn = document.querySelector(".add-btn");
let modalcont = document.querySelector(".modal-cont");
let maincont = document.querySelector(".main-cont");
let addflag = false;
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

modalcont.addEventListener("keydown", (e) => {
    let key = e.key;
    if(key == "Shift"){
        createTicket();
    }
})

function createTicket(){
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color"></div>
        <div class="ticket-id">#12334</div>
        <div class="task-area">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio dolorum eos optio praesentium
            voluptate dicta quasi? Accusamus exercitationem omnis voluptatibus, reprehenderit, quos libero dicta
            quaerat modi unde possimus, magnam repellendus!
        </div>    
    `;
    maincont.appendChild(ticketCont);
}