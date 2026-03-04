import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBqg-Be1DC9O6SH5rXGbMjDds0wG9rolRc",
    authDomain: "galinho-fbdb2.firebaseapp.com",
    projectId: "galinho-fbdb2",
    storageBucket: "galinho-fbdb2.firebasestorage.app",
    messagingSenderId: "1088809563797",
    appId: "1:1088809563797:web:7c250b6913198f1f700d9c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


let saldo = 0;
let din_apostado = 0;
let currentUID = null;
let bloqueado = false;

async function criarUsuarioDB(uid) {
    await setDoc(doc(db, "users", uid), {
        saldo: 0,
        din_apostado: 0,
        rodadaGratisUsada: false
    });
}

async function carregarDados(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
}

async function salvarDados() {
    if (!currentUID) {
        console.warn("Tentativa de salvar sem UID definido!");
        return;
    }

    try {
        await updateDoc(doc(db, "users", currentUID), {
            saldo,
            din_apostado
        });
        console.log("Dados salvos:", { saldo, din_apostado });
    } catch (err) {
        console.error("Erro ao salvar no Firestore:", err);
    }
}


async function fazerCadastro(email, senha) {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    await criarUsuarioDB(cred.user.uid);
    alert("Usuário criado!");
    currentUID = cred.user.uid;
    logando();
    guilhermeLogou(cred.user);
}

async function fazerLogin(email, senha) {
    const cred = await signInWithEmailAndPassword(auth, email, senha);
    currentUID = cred.user.uid;
    
    if (guilhermeLogou(cred.user)) {
        return;
    }
    const dados = await carregarDados(currentUID);

    saldo = dados.saldo;
    din_apostado = dados.din_apostado;

    atualizarTela();
    logando()
}


function atualizarTela() {
    document.getElementById("saldo").textContent =
        "Saldo: R$" + saldo.toFixed(2);

    document.getElementById("din-apostado").textContent =
        "Dinheiro apostado: R$" + din_apostado.toFixed(2);

    salvarDados();
}


document.getElementById("fazerCadastro")
.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senhaRegistro").value;
    await fazerCadastro(email, senha);
});

document.getElementById("fazerLogin")
.addEventListener("click", async () => {
    const email = document.getElementById("usuario").value;
    const senha = document.getElementById("senhaLogin").value;
    await fazerLogin(email, senha);
});



//? DIVS
const menu             = document.getElementById("menu");
const jogo             = document.getElementById("jogo");
const aposta1          = document.getElementById("aposta1");
const aposta2          = document.getElementById("aposta2");
const aposta3          = document.getElementById("aposta3");
const banner           = document.getElementById("ad");
const apostar_dinheiro = document.getElementById("apostar-dinheiro");
const popup_erro       = document.getElementById("popup_erro");
const mensagem_erro    = document.getElementById("mensagem-erro");
const popup_perdeu     = document.getElementById("popup_perdeu");
const popup_ganhou     = document.getElementById("popup_ganhou");
const DivLogin         = document.getElementById("login");
const DivRegistro      = document.getElementById("registro");
const popup_gratis     = document.getElementById("popup_gratis");

//? LISTENER
document.querySelector(".botao").addEventListener("click", jogar);
document.querySelectorAll(".botaovolta").forEach(btn => {
    btn.addEventListener("click", voltar);
});
document.querySelector(".botaoConta").addEventListener("click", abrirLogin);
document.querySelector(".botaoReg").addEventListener("click", abrirRegistro);
document.getElementById("bt-dobrar-aposta").addEventListener("click", fdobrar_aposta);
document.querySelector(".botaogirar").addEventListener("click", girar);
document.getElementById("bt-apostar").addEventListener("click", fapostar);
document.querySelectorAll(".botaovolta2").forEach(btn => {
    btn.addEventListener("click", fechapopup);
});
document.getElementById("bt-ok").addEventListener("click", fapostarok);
document.getElementById("rodada_gratis").addEventListener("click", rodadagratis)

//? COISAS
const botaogirar = document.querySelector(".botaogirar");


//? FUNCOES

function jogar(){
    aposta1.innerHTML = "";
    aposta2.innerHTML = "";
    aposta3.innerHTML = "";
    
    menu.style.display     = "none";
    jogo.style.display     = "flex";  
    DivLogin.style.display = "none";
};

function voltar(){
    menu.style.display        = "flex";
    jogo.style.display        = "none";  
    DivLogin.style.display    = "none";
    DivRegistro.style.display = "none";
};

function abrirLogin(){
    DivLogin.style.display = "flex";
    menu.style.display     = "none";
};

function abrirRegistro(){
    DivLogin.style.display    = "none";
    DivRegistro.style.display = "flex";
}

function logando(){
    DivLogin.style.display = "none";
    DivRegistro.style.display = "none";
    jogar();
}

const imgs_ad = [
    "/imgs/restaurante.png",
    "/imgs/subwaymoney.jpeg",
    "/imgs/galinhoad.png"
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

    if (bloqueado) {
        mensagem_erro.textContent = "galinho não quer que voce aposte, sai daqui guilherme";
        popup_erro.style.display = "flex";
        return;
    }

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
            atualizarTela();
            setTimeout( () => {
                popup_ganhou.style.display = "none";
            }, 2000)
        }

        else{
            console.log('perdeu kkk');
            popup_perdeu.style.display = "flex";
            din_apostado = din_apostado * 0.4;
            atualizarTela();
            setTimeout( () => {
                popup_perdeu.style.display = "none";
            }, 2000)
        };
       }, 2000);
    }
    else {
        mensagem_erro.innerHTML = "pobre sem dinheiro kkk </br> mínimo pra apostar: R$10";
        popup_erro.style.display = "flex";
        apostar_dinheiro.style.display = "none";
    }
};

function aleatorio(){
    const img = document.createElement('img');
    const num = Math.floor(Math.random() * 13);

    const imagens = [
        "galinho.png",
        "vaca.png",
        "coelho.png",
        "cavalo.png",
        "pato.png",
        "ovelha.png",
        "porco.png",
        "vaca.png",
        "coelho.png",
        "cavalo.png",
        "pato.png",
        "ovelha.png",
        "porco.png"
    ];

    img.src = "/imgs/" + imagens[num];
    img.dataset.tipo = imagens[num]; 
    return img;
};

function fapostar(){
    apostar_dinheiro.style.display = "flex";
    popup_erro.style.display = "none";
}

function fapostarok(){

    if (bloqueado) {
        mensagem_erro.textContent = "nem tenta guilherme KKKKK";
        popup_erro.style.display = "flex";
        return;
    }

    const input = document.getElementById("quantia-apostar");
    const quantia_apostar = parseFloat(input.value);

    if (quantia_apostar > 0) {
        din_apostado += quantia_apostar;
        atualizarTela();
        input.value = "";
        fechapopup();
    }
};

function fdobrar_aposta(){
    console.log('dobra aposta');
    if (saldo >= 2 * din_apostado && saldo > 0){
        saldo -= din_apostado;
        din_apostado = 2 * din_apostado;
        atualizarTela();
    } else {
        mensagem_erro.textContent = "Dinheiro insuficiente"
        popup_erro.style.display = "flex";
        apostar_dinheiro.style.display = "none";
    }
}; 

function fechapopup(){
    apostar_dinheiro.style.display = "none";
    popup_erro.style.display = "none";
}

function guilhermeLogou(user) {
    if (user.email.toLowerCase().startsWith("gui")){
        saldo = 0;
        din_apostado = 0;

        bloqueado = true; 

        atualizarTela();

        mensagem_erro.textContent = "voce nao pode apostar guilherme :/ sai daqui e vai trabalhar";
        popup_erro.style.display = "flex";

        return true;
    }
    return false;
}

async function rodadagratis(){
    if (!currentUID) return;

    const dados = await carregarDados(currentUID);

    if (dados.rodadaGratisUsada) {
        mensagem_erro.textContent = "ja ganhou a rodada gratis idiota aproveitador quem vc acha q a gente eh pra da dinheiro assim de graca";
        popup_erro.style.display = "flex";
        return;
    }

    saldo += 10;

    await updateDoc(doc(db, "users", currentUID), {
        rodadaGratisUsada: true,
        saldo: saldo  
    });

    popup_gratis.style.display = "flex";
    atualizarTela();

    setTimeout(() => {
        popup_gratis.style.display = "none";
    }, 2000);
}
