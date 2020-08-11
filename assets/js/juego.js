(() => {
    'use strict';

    const $btnNuevo = document.querySelector('#btnNuevo'),
        $btnPedir = document.querySelector('#btnPedir'),
        $btnDetener = document.querySelector('#btnDetener'),
        $smalls = document.querySelectorAll('small'),
        $divCartas = document.querySelectorAll('.divCartas'),
        $nomberJugador = document.querySelector('#nomberJugador'),
        tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [],
        nombreJugador = '';

    let deck = [];

    const preguntarNombre = async () => {
        const { value: name } = await Swal.fire({
            title: 'Ingrese su nombre por favor',
            icon: 'info',
            input: 'text',
            showCloseButton: false,
            showCancelButton: false,
            inputAttributes: {
                mainlength: 5,
                autocapitalize: 'off',
                autocorrect: 'off',
            },
            allowEscapeKey: false,
            allowOutsideClick: false,
        });

        return await name;
    };

    const inicializarJuego = (numJugadores = 1) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i <= numJugadores; i++) {
            puntosJugadores.push(0);
        }

        $smalls.forEach((small) => (small.innerHTML = 0));
        $divCartas.forEach((div) => (div.innerHTML = ''));

        $btnDetener.disabled = false;
        $btnPedir.disabled = false;
        btnDetener.classList.remove('hide');
        $btnPedir.classList.remove('hide');
        $btnNuevo.classList.remove('show');
        $btnNuevo.classList.add('hide');
    };

    const crearDeck = () => {
        deck = [];

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
        return _.shuffle(deck);
    };

    const takeOne = () => {
        if (deck.length === 0) {
            return;
        }

        return deck.pop();
    };

    const valorCarta = async (carta, tipo) => {
        let valor = carta.substring(0, carta.length - 1);

        if (!isNaN(valor)) {
            valor = Number(valor);
        } else {
            if (valor === 'A') {
                if (tipo) {
                    do {
                        const { value: valorA } = await Swal.fire({
                            title: 'Ingrese el valor de A puede ser 1 u 11',
                            icon: 'info',
                            input: 'text',
                            showCloseButton: false,
                            showCancelButton: false,
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                        });
                        // const valorA = prompt('Elije');
                        valor = Number(valorA);
                    } while (![1, 11].includes(valor));
                } else {
                    valor = Math.random() > 0.5 ? 1 : 0;
                }
            } else {
                valor = 10;
            }
        }

        return valor;
    };

    // Turno: 0 = primer jugador y último sera la computadora
    const acumularPuntos = async (carta, turno, tipo) => {
        puntosJugadores[turno] += await valorCarta(carta, tipo);
        $smalls[turno].innerHTML = puntosJugadores[turno];
        return puntosJugadores[turno];
    };

    const crearCarta = (carta, turno) => {
        const cartaimg = document.createElement('img');
        cartaimg.classList.add('carta');
        cartaimg.src = `assets/cartas/${carta}.png`;
        $divCartas[turno].append(cartaimg);
    };

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        if (puntosComputadora === puntosMinimos) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Empate',
            });
        } else if (puntosMinimos < puntosComputadora && 21 >= puntosComputadora) {
            Swal.fire({
                icon: 'error',
                title: '!Perdiste :(¡',
                text: 'Gano la computadora',
            });
        } else if (puntosMinimos > 21) {
            Swal.fire({
                icon: 'error',
                title: '!Perdiste :(¡',
                text: 'Gano la computadora',
            });
        } else if (puntosComputadora > 21) {
            Swal.fire({
                icon: 'success',
                title: '!Win¡',
                text: `Gano ${nombreJugador}`,
            });
        }
    };

    // COMPUTADORA
    const turnoComputadora = async (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = takeOne();
            puntosComputadora = await acumularPuntos(carta, puntosJugadores.length - 1, false);
            crearCarta(carta, puntosJugadores.length - 1);
        } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

        determinarGanador();
        $btnNuevo.classList.add('show');
    };

    $btnPedir.addEventListener('click', async () => {
        const carta = takeOne();
        // crear carta
        const puntosJugador = await acumularPuntos(carta, 0, true);
        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            turnoComputadora(puntosJugador);
            $btnDetener.disabled = true;
            $btnPedir.disabled = true;
        } else if (puntosJugador === 21) {
            turnoComputadora(puntosJugador);
            $btnDetener.disabled = true;
            $btnPedir.disabled = true;
        }
    });

    $btnDetener.addEventListener('click', () => {
        $btnDetener.disabled = true;
        $btnPedir.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    $btnNuevo.addEventListener('click', async () => {
        let nombre = nombreJugador.length === 0 ? await preguntarNombre() : nombreJugador;

        if (nombre.length >= 3) {
            nombreJugador = nombre;
            $nomberJugador.innerHTML = nombreJugador;
            inicializarJuego();
        }
    });
})();
