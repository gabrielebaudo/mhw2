/* TODO: inserite il codice JavaScript necessario a completare il MHW! */

//MAIN
const elementList = document.querySelectorAll(".choice-grid div");
let freeList = [];
let selectedList = [];
setListen();

//IMPOSTA GLI HANDLER PER TUTTE LE POSSIBILI RISPOSTE
function setListen(){
    for(const elem of elementList){
        elem.addEventListener('click', onClick);
        freeList.push(elem);
    }
}

//HANDLER PER IL CLICK, CONTROLLA AD OGNI SELEZIONE SE IL TEST E COMPLETATO O NO
function onClick(event){
    const div_elem = event.currentTarget;
    const check_elem = div_elem.querySelector(".checkbox");

    //Controlliamo se esiste già un elemento nei selected associato a quella domanda, se si lo sostituiamo
    for(const elem of selectedList){
        if(elem.dataset.questionId === div_elem.dataset.questionId){
            const index = selectedList.indexOf(elem);
            selectedList.splice(index, 1);
            freeList.push(elem);
        }
    }
    selectedList.push(div_elem);
    div_elem.classList.add("selected");
    if(div_elem.classList.contains("unselected"))
        div_elem.classList.remove("unselected");
    check_elem.src = "./images/checked.png"

    //Lo rimuoviamo dai free
    const index = freeList.indexOf(div_elem);
    freeList.splice(index, 1);

    //Cambiamo la grafica a tutti i free aventi quel question id
    for(const elem of freeList){
        if(elem.dataset.questionId === div_elem.dataset.questionId){
            if(div_elem.classList.contains("selected"))
                elem.classList.remove("selected");
            elem.classList.add("unselected");
            const tick = elem.querySelector(".checkbox")
            tick.src = "./images/unchecked.png";
        }
    }

    if(isComplete()){
        endTest();
    }
}

//CONTROLLA SE TUTTE LE DOMANDE HANNO AVUTO UNA RISPOSTA
function isComplete(){
    if(selectedList.length === 3)
        return 1;
    return 0;
}

//GESTISCE TUTTE LE FUNZIONI PER LA CONCLUSIONE DEL TEST
function endTest(){
    
    blockListen();

    const personality = personalityfinder();
    display(personality);

    let button = document.querySelector(".button");
    button.addEventListener("click", buttonPress);
}

//BLOCCA GLI HANDLER PER RENDERE LE RISPOSTE IMMODIFICABILI
function blockListen(){
    for(const elem of elementList){
        elem.removeEventListener('click', onClick);
    }
}

//RESTITUISCE LA PERSONALITA CORRETTA
function personalityfinder(){
    const personality = {blep: 0, happy: 0, sleeping: 0, dopey: 0, burger: 0, cart: 0, nerd: 0, shy: 0, sleepy: 0}
    for(const elem of selectedList){
        for(const person in personality){
            if(elem.dataset.choiceId === person){
                personality[person]++;
            }   
        } 
    }
    let max = selectedList[0].dataset.choiceId;

    for(const person in personality){
        if(personality[person] > personality[max])
            max = person;
    }
    return max;
}

//STAMPA TUTTI GLI ELEMENTI NECESSARI ALLA FINE DELLA PAGINA
function display(personality){
    const container = document.getElementById('results');
    const title = document.createElement("h1");
    const description = document.createElement("p");
    const button = document.createElement("div");

    title.textContent = RESULTS_MAP[personality].title;
    container.appendChild(title);
    description.textContent = RESULTS_MAP[personality].contents;
    container.appendChild(description);
    button.textContent = "Ricomincia il quiz";
    button.classList.add("button");
    container.appendChild(button);
    container.classList.remove("hidden")
}


//HANDLER PER IL BOTTONE DI RESET, PULISCE LA PAGINA E RICHIAMA GLI ONCLICK HANDLER
function buttonPress(event){
    const button = event.currentTarget;

    for(const elem of freeList){
        elem.classList.remove("unselected"); 
    }

    for(const elem of selectedList){
        elem.classList.remove("selected"); 
        const tick = elem.querySelector(".checkbox")
        tick.src = "./images/unchecked.png"
    }

    //svuotiamo le liste
    selectedList = [];
    freeList = [];
    let result = document.getElementById("results");
    result.innerHTML = '';
    result.classList.add("hidden");
    setListen();
}