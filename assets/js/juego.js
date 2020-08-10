// 2C = Two of Trébores
// 2D = Two of Diamantes
// 2H = Two of Corazones
// 2S = Two of Espadas
const $btnNuevo = document.querySelector('#btnNuevo');
const $btnPedir = document.querySelector('#btnPedir');
const $btnDetener = document.querySelector('#btnDetener');
const $smalls = document.querySelectorAll('small');
const $divJugador = document.querySelector('#jugador-cartas');
const $divComputadora = document.querySelector('#computadora-cartas');

let puntosJugador = 0;
puntosComputadora = 0;

let deck = [];
const tipos = ['C', 'D', 'H', 'S'];
const especiales = ['A', 'J', 'Q', 'K'];

const crearDeck = () => {
    for (let i = 2; i <= 10; i++) {
        for (const tipo of tipos) {
            deck.push(`${i}${tipo}`);
        }
    }

    for (const tipo of tipos) {
        for (const esp of especiales) {
            deck.push(`${esp}${tipo}`);
        }
    }

    deck = _.shuffle(deck);
    return deck;
};

crearDeck();

const takeOne = () => {
    if (deck.length === 0) {
        return;
    }

    const carta = deck.pop();
    return carta;
};

// const valorCarta = (carta, tipo) => {
//     let valor = carta.substring(0, carta.length - 1);

//     if (!isNaN(valor)) {
//         valor = Number(valor);
//     } else {
//         if (valor === 'A') {
//             if (tipo) {
//                 const valorA = prompt('Ingrese el valor de A puede ser 1 o 10');
//                 valor = Number(valorA);
//             } else {
//                 valor = Math.random() > 0.5 ? 1 : 0;
//             }
//         } else {
//             valor = 10;
//         }
//         // valor = valor === 'A' ? 11 : 10;
//     }

//     // valor = !isNaN(valor) ? Number(valor) : valor === 'A' ? 11 : 10;
//     return valor;

//     // console.log(puntos);
// };

const valorCarta = (carta) => {
    let valor = carta.substring(0, carta.length - 1);
    valor = !isNaN(valor) ? Number(valor) : valor === 'A' ? 11 : 10;
    return valor;
};

// COMPUTADORA
const turnoComputadora = (puntosMinimos) => {
    do {
        const carta = takeOne();
        puntosComputadora += valorCarta(carta);
        $smalls[1].innerHTML = puntosComputadora;

        // crear carta
        const cartaimg = document.createElement('img');
        cartaimg.classList.add('carta');
        cartaimg.src = `assets/cartas/${carta}.png`;
        $divComputadora.append(cartaimg);

        if (puntosMinimos >= 21) break;
    } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

    if (puntosComputadora === puntosMinimos) {
        console.warn('Empate');
    } else if (puntosMinimos > 21) {
        console.warn('Gana Computadora');
    } else if (puntosComputadora > 21) {
        console.warn('Gana Jugador');
    } else if (puntosMinimos < puntosComputadora) {
        console.warn('Gana Computadora');
    }
    $btnNuevo.classList.add('show');
};

$btnPedir.addEventListener('click', () => {
    const carta = takeOne();
    // crear carta
    const cartaimg = document.createElement('img');
    cartaimg.classList.add('carta');
    cartaimg.src = `assets/cartas/${carta}.png`;
    $divJugador.append(cartaimg);
    puntosJugador += valorCarta(carta);
    $smalls[0].innerHTML = puntosJugador;

    if (puntosJugador > 21) {
        console.warn('Perdio');
        turnoComputadora(puntosJugador);
        $btnDetener.disabled = true;
        $btnPedir.disabled = true;
    } else if (puntosJugador === 21) {
        console.warn('WIN');
        turnoComputadora(puntosJugador);
        $btnDetener.disabled = true;
        $btnPedir.disabled = true;
    }
});

$btnDetener.addEventListener('click', () => {
    $btnDetener.disabled = true;
    $btnPedir.disabled = true;
    turnoComputadora(puntosJugador);
});

$btnNuevo.addEventListener('click', () => {
    $btnDetener.disabled = false;
    $btnPedir.disabled = false;
    btnDetener.classList.remove('hide');
    $btnPedir.classList.remove('hide');
    $btnNuevo.classList.remove('show');
    $btnNuevo.classList.add('hide');
    $smalls[0].innerHTML = 0;
    $smalls[1].innerHTML = 0;
    deck = [];
    deck = crearDeck();
    $divComputadora.innerHTML = '';
    $divJugador.innerHTML = '';

    puntosJugador = 0;
    puntosComputadora = 0;
});
