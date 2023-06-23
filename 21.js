class Juego {
    constructor() {
      this.totalJugador = 0;
      this.totalMaquina = 0;
      this.partidasGanadasJugador = 0;
      this.partidasGanadasMaquina = 0;
      this.partidasJugadas = 0;
      this.baraja = null;
      this.variable=21;
      this.inicio = document.querySelector('.presenta');
      this.lista = document.querySelector('.lista');
      this.body = document.querySelector('.body');
      this.footer = document.querySelector('.footer');
      this.boton = document.querySelector('#Finalizar');
      this.unaCarta = document.querySelector('#carta');
      this.deten = document.querySelector('#Detener');
      this.modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
  
      document.getElementById('empezar').addEventListener('click', () => this.empezar());
      document.getElementById('Detener').addEventListener('click', () => this.detenerJugada());
      document.getElementById('Finalizar').addEventListener('click', () => this.finalizarPartida());
      document.getElementById('carta').addEventListener('click', () => this.carta());
    }
  
    empezar() {
      this.inicio.classList.remove('disabled');
      this.lista.classList.add('disabled');
      this.footer.classList.add('disabled');
      this.body.classList.add('disabled');
      fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then((response) => response.text())
        .then((html) => {
          const resultado = JSON.parse(html);
          this.baraja = resultado.deck_id;
          this.partidasJugadas++;
          for (let i = 0; i < 2; i++) {
            this.carta();
          }
        })
        .catch((err) => {
          console.log('Error: ', err);
        });
    }
  
    carta() {
      if (this.totalJugador < this.variable) {
        fetch('https://deckofcardsapi.com/api/deck/' + this.baraja + '/draw/?count=1')
          .then((response) => response.text())
          .then((html) => {
            const resultado = JSON.parse(html);
            const imagen = document.createElement('img');
            imagen.src = resultado.cards[0].image;
            document.getElementById('cartas').appendChild(imagen);
            this.totalJugador += this.obtenerValorCarta(resultado.cards[0]);
            this.actualizarPuntos();
            this.validarGanador();
            if (this.totalJugador < this.variable) {
              this.cartama();
            }
          })
          .catch((err) => {
            console.log('Error: ', err);
          });
      } else {
        this.unaCarta.classList.add('disabled');
      }
    }
  
    resetear() {
      this.totalJugador = 0;
      this.totalMaquina = 0;
  
      document.getElementById('cartas').innerHTML = '';
      document.getElementById('cartasma').innerHTML = '';
  
      this.unaCarta.classList.remove('disabled');
      this.deten.classList.remove('disabled');
      this.boton.classList.remove('disabled');
  
      this.actualizarPuntos();
      this.actualizarPuntosma();
      document.getElementById('win').style.display = 'none';
      document.getElementById('lose').style.display = 'none';
      this.empezar();
    }
  
    cartama() {
      if (this.totalMaquina < 18 || this.totalMaquina < this.totalJugador) {
        fetch('https://deckofcardsapi.com/api/deck/' + this.baraja + '/draw/?count=1')
          .then((response) => response.text())
          .then((html) => {
            const resultado = JSON.parse(html);
            const imagen = document.createElement('img');
            imagen.src = resultado.cards[0].image;
            document.getElementById('cartasma').appendChild(imagen);
            this.totalMaquina += this.obtenerValorCarta(resultado.cards[0]);
            this.actualizarPuntosma();
            this.validarGanador();
          })
          .catch((err) => {
            console.log('Error: ', err);
          });
      } else {
        return;
      }
    }
  
    detenerJugada() {
      if (this.totalJugador < this.variable) {
        this.cartama();
      } else {
        this.deten.classList.add('disabled');
      }
    }
  
    finalizarPartida() {
      setTimeout(() => {
        this.partidasGanadasJugador++;
        this.estadisticas();
        document.getElementById('win').style.display = 'inline';
      }, 500);
    }
  
    validarGanador() {
      if (this.totalMaquina == this.variable ){
        setTimeout(() => {
          this.partidasGanadasMaquina++;
          this.estadisticas();
          document.getElementById('lose').style.display = 'inline';
        }, 500);
      } else if (this.totalMaquina >this.variable) {
        setTimeout(() => {
          this.partidasGanadasJugador++;
          this.estadisticas();
          document.getElementById('win').style.display = 'inline';
        }, 500);
      } else if (this.totalJugador ==this.variable) {
        setTimeout(() => {
          this.partidasGanadasJugador++;
          this.estadisticas();
          document.getElementById('win').style.display = 'inline';
        }, 500);
      } else if (this.totalJugador >this.variable) {
        setTimeout(() => {
          this.partidasGanadasMaquina++;
          this.estadisticas();
          document.getElementById('lose').style.display = 'inline';
        }, 500);
      } else {
        document.getElementById('win').style.display = 'none';
        document.getElementById('lose').style.display = 'none';
      }
    }
  
    mostrarBtn() {
      if (
        this.totalJugador > 17 &&
        this.totalJugador <= 20 &&
        this.totalJugador != this.totalMaquina &&
        this.totalMaquina >= 17 &&
        this.totalJugador > this.totalMaquina
      ) {
        this.boton.classList.remove('disabled');
      } else {
        this.boton.classList.add('disabled');
      }
    }
  
    obtenerValorCarta(carta) {
      const valor = carta.value;
      if (valor === 'KING' || valor === 'QUEEN' || valor === 'JACK') {
        return 10;
      } else if (valor === 'ACE') {
        return 1;
      } else {
        return parseInt(valor);
      }
    }
  
    actualizarPuntos() {
      document.querySelector('#resultado').innerText = 'Puntos del jugador: ' + this.totalJugador;
      this.mostrarBtn();
    }
  
    actualizarPuntosma() {
      document.querySelector('#resultadoma').innerText = 'Puntos de maquina: ' + this.totalMaquina;
    }
  
    estadisticas() {
      this.modal.show();
      document.querySelector('#partidasjug').innerText = 'Partidas jugadas: ' + this.partidasJugadas;
      document.querySelector('#jugadorgana').innerText = 'Partidas ganadas del jugador: ' + this.partidasGanadasJugador;
      document.querySelector('#jugadorpuntos').innerText = 'Puntos del jugador: ' + this.totalJugador;
      document.querySelector('#maquinagana').innerText = 'Partidas ganadas por la maquina: ' + this.partidasGanadasMaquina;
      document.querySelector('#maquinapuntos').innerText = 'Puntos de la maquina: ' + this.totalMaquina;
    }
  }
  
const juego = new Juego();
  