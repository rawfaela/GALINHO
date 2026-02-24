//? DIVS
const menu = document.getElementById("menu");
const jogo = document.getElementById("jogo");
const aposta1 = document.getElementById("aposta1");
const aposta2 = document.getElementById("aposta2");
const aposta3 = document.getElementById("aposta3");
const banner = document.getElementById("ad");
const divapostado = document.getElementById("din-apostado");
const divsaldo = document.getElementById("saldo");
const apostar_dinheiro = document.getElementById("apostar-dinheiro");
const popup_erro = document.getElementById("popup_erro");
const mensagem_erro = document.getElementById("mensagem-erro");
const popup_qualquer = document.querySelector(".popup");
const popup_perdeu = document.getElementById("popup_perdeu");
const popup_ganhou = document.getElementById("popup_ganhou");

//? COISAS
const botaogirar = document.querySelector(".botaogirar");
let saldo = 0;
let din_apostado = 0;

//? FUNCOES

function jogar(){
    aposta1.innerHTML = "";
    aposta2.innerHTML = "";
    aposta3.innerHTML = "";
    
    menu.style.display = "none";
    jogo.style.display = "flex";  
};

function voltar(){
    menu.style.display = "flex";
    jogo.style.display = "none";  
};

function attTela(){
    divapostado.textContent = "Dinheiro apostado: R$" + din_apostado.toFixed(2);
    divsaldo.textContent = "Saldo: R$" + saldo.toFixed(2);    
};
attTela();

const imgs_ad = [
    "/sistema/templates/imgs/galinho/agrosys.jpg",
    "/sistema/templates/imgs/galinho/subwaymoney.jpeg",
    "/sistema/templates/imgs/galinho/galinhoad.png"
]
let pos = 0;
const imgElement = document.createElement("img");
imgElement.src = imgs_ad[pos];
imgElement.style.width = '100%';
banner.appendChild(imgElement);

let intervalo = setInterval(() => {
    pos = (pos + 1) % imgs_ad.length; 
    imgElement.src = imgs_ad[pos];    
}, 2000);


function girar(){
    if (din_apostado >= 10){
    botaogirar.style.visibility = "hidden";

    aposta1.classList.add("girando");
    aposta2.classList.add("girando");
    aposta3.classList.add("girando");

    let intervalo = setInterval(() => {
        aposta1.innerHTML = "";
        aposta2.innerHTML = "";
        aposta3.innerHTML = "";

        aposta1.appendChild(aleatorio());
        aposta2.appendChild(aleatorio());
        aposta3.appendChild(aleatorio());
    }, 100);
    setTimeout(() => {
        clearInterval(intervalo);

        aposta1.innerHTML = "";
        aposta2.innerHTML = "";
        aposta3.innerHTML = "";

        aposta1.appendChild(aleatorio());
        aposta2.appendChild(aleatorio());
        aposta3.appendChild(aleatorio());

        aposta1.classList.remove("girando");
        aposta2.classList.remove("girando");
        aposta3.classList.remove("girando");

        botaogirar.style.visibility = "visible";

        const img1 = aposta1.querySelector("img");
        const img2 = aposta2.querySelector("img");
        const img3 = aposta3.querySelector("img");
    
        if (img1.dataset.tipo === img2.dataset.tipo && img2.dataset.tipo === img3.dataset.tipo) {
            if (img1.dataset.tipo === 'galinho.png') {
                console.log('ganhou galinho');
                saldo += din_apostado * 3 - din_apostado;
            } else {
                console.log('ganhou normal');
                saldo += din_apostado * 1.5 - din_apostado;
            }
            popup_ganhou.style.display = "flex";
            attTela();
            setTimeout( () => {
                popup_ganhou.style.display = "none";
            }, 2000)
        }

        else{
            console.log('perdeu kkk');
            popup_perdeu.style.display = "flex";
            din_apostado = din_apostado * 0.4;
            attTela();
            setTimeout( () => {
                popup_perdeu.style.display = "none";
            }, 2000)
        };
       }, 2000);
    }
    else {
        mensagem_erro.textContent = "pobre sem dinheiro kkk <br> mínimo pra apostar: R$10";
        popup_erro.style.display = "flex";
    }
};

function aleatorio(){
    const img = document.createElement('img');
    const num = Math.floor(Math.random() * 7);

    const imagens = [
        "galinho.png",
        "vaca.png",
        "coelho.png",
        "cavalo.png",
        "pato.png",
        "ovelha.png",
        "porco.png"
    ];

    img.src = "/sistema/templates/imgs/galinho/" + imagens[num];
    img.dataset.tipo = imagens[num]; 
    return img;
};

function fapostar(){
    apostar_dinheiro.style.display = "flex";
}

function fapostarok(){
    const input = document.getElementById("quantia-apostar");
    const quantia_apostar = parseFloat(input.value);

    if (quantia_apostar > 0) {
        din_apostado += quantia_apostar;
        attTela();
        input.value = "";
        fechapopup();
    }
    
    
};

function fdobrar_aposta(){
    console.log('dobra aposta');
    if (saldo >= 2 * din_apostado && saldo > 0){
        saldo -= din_apostado;
        din_apostado = 2 * din_apostado;
        attTela();
    } else {
        mensagem_erro.textContent = "Dinheiro insuficiente"
        popup_erro.style.display = "flex";
    }
}; 

function fechapopup(){
    apostar_dinheiro.style.display = "none";
    popup_erro.style.display = "none";
}