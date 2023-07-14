let totalJugador = 0;
let totalMaquina = 0;
let partidasGanadasJugador = 0;
let partidasGanadasMaquina = 0;
let partidasJugadas = 0;

const inicio = document.querySelector('.presenta');
const lista = document.querySelector('.lista');
const body = document.querySelector('.body');
const footer = document.querySelector('.footer');
const boton = document.querySelector('#Finalizar');
const unaCarta = document.querySelector('#carta');
const deten = document.querySelector('#Detener');


const cartasJugador = document.getElementById('cartas-jugador');
const cartasMaquina = document.getElementById('cartas-maquina');


document.getElementById('empezar').addEventListener('click', empezar);
document.getElementById('Detener').addEventListener('click', detenerjuga);
document.getElementById('Finalizar').addEventListener('click', function() {
    setTimeout(function() {
            partidasGanadasJugador++;
            estadisticas();
            document.getElementById("win").style.display = "inline";
    },1000);});
document.getElementById('carta').addEventListener('click', carta);
var modal = new bootstrap.Modal(document.getElementById('staticBackdrop')); 

let baraja;
//empieza
function empezar() {

    inicio.classList.remove("disabled");
    lista.classList.add("disabled");
    footer.classList.add("disabled");
    body.classList.add("disabled");
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        const resultado = JSON.parse(html);
        baraja = resultado.deck_id;
        partidasJugadas++;
        for (let i = 0; i < 2; i++) {
          carta();
          //cartama();
          
  
        }
      })
      .catch(function (err) {
        console.log('Error: ', err);
      });
  }
// sacar una carta el jugador
function carta() {
    if (totalJugador<21){
        fetch('https://deckofcardsapi.com/api/deck/' + baraja + '/draw/?count=1')
        .then(function (response) {
            return response.text();
          })
          .then(function (html) {
            const resultado = JSON.parse(html);
            const imagen = document.createElement('img');
            imagen.src = resultado.cards[0].image;
            document.getElementById('cartas').appendChild(imagen);
            totalJugador += obtenerValorCarta(resultado.cards[0]);
            cartasJugador.appendChild(imagen);
            actualizarPuntos();
            validarganador();
            if (totalJugador <21){
              cartama();
            }
            
          })
          .catch(function (err) {
            console.log('Error: ', err);
          });
    }else{
        unaCarta.classList.add("disabled");

    }
  
}

// function agregar1(){
//   fetch('https://deckofcardsapi.com/api/deck/' + baraja + '/draw/?count=1')
//         .then(function (response) {
//           return response.text();
//         })
//         .then(function (html) {
//           const resultado = JSON.parse(html);
//           const imagen = document.createElement('img');
//           imagen.src = resultado.cards[0].image;
//           cartasJugador.appendChild(imagen);

//         })
//         .catch(function (err) {
//           console.log('Error: ', err);
//         });
 
// }
//RESETEAR JUEGO
function resetear() {
  totalJugador = 0;
  totalMaquina = 0;

  document.getElementById('cartas').innerHTML = '';
  document.getElementById('cartasma').innerHTML = '';

  unaCarta.classList.remove("disabled");
  deten.classList.remove("disabled");
  boton.classList.remove("disabled");

  cartasJugador.innerHTML = '';
  cartasMaquina.innerHTML = '';

  actualizarPuntos();
  actualizarPuntosma();
  document.getElementById("win").style.display = "none";
  document.getElementById("lose").style.display = "none";
  empezar();
  
}


//la mauina elige su carta
function cartama() {
    if (totalMaquina<17 ||  totalMaquina< totalJugador){
        fetch('https://deckofcardsapi.com/api/deck/' + baraja + '/draw/?count=1')
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          const resultado = JSON.parse(html);
          const imagen = document.createElement('img');
          imagen.src = resultado.cards[0].image;
          document.getElementById('cartasma').appendChild(imagen);
          totalMaquina += obtenerValorCarta(resultado.cards[0]);
          cartasMaquina.appendChild(imagen);
          actualizarPuntosma();
          validarganador();

        })
        .catch(function (err) {
          console.log('Error: ', err);
        });
    }else{
        return;
    } 
  }
// function agregar(){
//   fetch('https://deckofcardsapi.com/api/deck/' + baraja + '/draw/?count=1')
//         .then(function (response) {
//           return response.text();
//         })
//         .then(function (html) {
//           const resultado = JSON.parse(html);
//           const imagen = document.createElement('img');
//           imagen.src = resultado.cards[0].image;
//           cartasMaquina.appendChild(imagen);

//         })
//         .catch(function (err) {
//           console.log('Error: ', err);
//         });
 
// }
function validarganador(){
  if (totalMaquina == 21) {
            setTimeout(function() {
              partidasGanadasMaquina++;
              estadisticas();
            document.getElementById("lose").style.display = "inline";
            
            }, 1000);
            
  }else if (totalMaquina > 21) {
            setTimeout(function() {
              partidasGanadasJugador++;
              estadisticas();
            document.getElementById("win").style.display = "inline";
            
            }, 1000);
            
  }else if (totalJugador == 21 ) {
                setTimeout(function() {
                  partidasGanadasJugador++;
                  estadisticas();
                  document.getElementById("win").style.display = "inline";
                  
                }, 1500);
                
  } else if (totalJugador > 21) {
                setTimeout(function() {
                  partidasGanadasMaquina++;
                  estadisticas();
                document.getElementById("lose").style.display = "inline";
                
                }, 1500);
                                
  }else {
        document.getElementById("win").style.display = "none";
        document.getElementById("lose").style.display = "none";
    }
      
}
//pasa el truno
function detenerjuga(){
    if (totalJugador<21){
        cartama();
    }else{
        deten.classList.add("disabled");
    }
    
}

function mostrarbtn() {
    if (totalJugador > 17 && totalJugador <= 20 && totalJugador != totalMaquina &&totalMaquina>=17 && totalJugador >totalMaquina ) {
      boton.classList.remove("disabled");
    } else {
      boton.classList.add("disabled");
    }
  }
//saca los calores de api 
function obtenerValorCarta(carta) {
  const valor = carta.value;
  if (valor === 'KING' || valor === 'QUEEN' || valor === 'JACK') {
    return 10;
  } else if (valor === 'ACE') {
    return 1;
  } else {
    return parseInt(valor);
  }
}
//actualiza puntos jugador
function actualizarPuntos() {  
    document.querySelector("#resultado").innerText = 'Puntos del jugador: ' + totalJugador;
    mostrarbtn();

}

//actualiza puntos maquina
function actualizarPuntosma() {  
    document.querySelector("#resultadoma").innerText = 'Puntos de maquina: ' + totalMaquina;
}
  
function estadisticas(){
  modal.show();
  document.querySelector("#partidasjug").innerText = 'Partidas jugadas: ' + partidasJugadas;
  document.querySelector("#jugadorgana").innerText = 'Partidas ganadas del jugador: ' + partidasGanadasJugador ;
  document.querySelector("#jugadorpuntos").innerText = 'Puntos del jugador: '+ totalJugador;
  document.querySelector("#maquinagana").innerText = 'Partidas ganadas por la maquina: ' + partidasGanadasMaquina;
  document.querySelector("#maquinapuntos").innerText = 'Puntos de la maquina: '+ totalMaquina;
}