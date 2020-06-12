        // Reglas del Juego
        /*
        1- Si las cartas del jugador suman 22 o más automaticamente pierde el juego y pierde 100 puntos
        2- Si el jugador suma 21 automaticamente gana el juego y gana 200 puntos
        3- Si el jugador se mantiene abajo de 22 puntos y el dealer sobrepasa los 21 puntos el jugador gana 100 puntos
        4- Si el jugador y el dealer empatan el jugador no pierde ningun punto
        5- Si el jugador no sobrepasa los 22 puntos pero el dealer tiene más puntos que el jugador igual sin sobrepasar los 22 puntos el dealer gana y el jugador pierde 100 puntos
        6- Si el dealer suma 21 automaticamente el jugador pierde 200 puntos
        */

        //Se dan de alta las varibales de las cartas
        var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
        var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        // Aquí se declara el valor inicial de los puntos del usuario
        let userMoney = 0
        //Se dan de alta los arreglos de player, dealer
        var deck = new Array();
        var players = new Array();
        var dealers = new Array();


        //Esta funcion crea la baraja con cada una de las posibilidades con un for bidimensional
        function createDeck()
        {
            deck = new Array();
            for (var i = 0 ; i < values.length; i++)
            {
                for(var x = 0; x < suits.length; x++)
                {
                    var weight = parseInt(values[i]);
                    //Si el valor es una letra se cambia a 10 ya que es la regla de las cartas
                    if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                        weight = 10;
                    //En caso de A se considera 11 en Black Jack
                    if (values[i] == "A")
                        weight = 11;
                    var card = { Value: values[i], Suit: suits[x], Weight: weight };
                    deck.push(card);
                }
            }
        }

        //Se crea al jugador
        function createPlayer()
        {
            players = new Array();
            var hand = new Array();
            var player = { Name: 'Player0', ID: 0, Points: 0, Hand: hand };
            players.push(player);

        }
        //Se crea el dealer
        function createDealer()
        {
            dealers = new Array();
            var handDealer = new Array();
            var dealer = { Name: 'Dealer', ID: 1, Points: 0, Hand: handDealer };
            dealers.push(dealer);

        }

        //Se crean todos los tags para la estructura de la vista del Dealer
        function createDealerUI()
        {
            document.getElementById('dealers').innerHTML = '';

                var div_dealer = document.createElement('div');
                var div_dealerid= document.createElement('div');
                var div_hand_Dealer = document.createElement('div');
                var div_points_dealer = document.createElement('div');

                div_points_dealer.className = 'points_D';
                div_points_dealer.id = 'points_D';
                div_dealer.id = 'dealer_';
                div_dealer.className = 'dealer';
                div_hand_Dealer.id = 'hand_dealer';

                div_dealerid.innerHTML = 'Dealer';
                div_dealer.appendChild(div_dealerid);
                div_dealer.appendChild(div_hand_Dealer);
                div_dealer.appendChild(div_points_dealer);
                document.getElementById('dealers').appendChild(div_dealer);

        }

        //Se crean todos los tags para la estructura de la vista del Jugador
        function createPlayerUI()
        {
            document.getElementById('players').innerHTML = '';

                var div_player = document.createElement('div');
                var div_playerid = document.createElement('div');
                var div_hand = document.createElement('div');
                var div_points = document.createElement('div');

                div_points.className = 'points';
                div_points.id = 'points_0';
                div_player.id = 'player_0';
                div_player.className = 'player';
                div_hand.id = 'hand_0';

                div_playerid.innerHTML = 'Jugador';
                div_player.appendChild(div_playerid);
                div_player.appendChild(div_hand);
                div_player.appendChild(div_points);
                document.getElementById('players').appendChild(div_player);

        }

        //Funcion para que el usuario ingrese el dinero con el que va a jugar
        function loadMoney()
        {
          var dinero = prompt("Ingrese el dinero con el que jugará", "0.00");
          if (dinero != null)
          {
            userMoney = parseFloat(dinero,10);
            if(userMoney <= 0){
              alert("Lo siento, la cantidad ingresada no es válida, inténtalo de nuevo.");
              userMoney = 0;
              return;
            }
            document.getElementById("txtUserMoney").innerHTML = "Puntos: $" + dinero;
            document.getElementById("txtUserMoney").style.display = "block";
          }
        }

        //Hace el shuffle de la baraja en 1000 iteraciones
        function shuffle()
        {
            for (var i = 0; i < 1000; i++)
            {
                var location1 = Math.floor((Math.random() * deck.length));
                var location2 = Math.floor((Math.random() * deck.length));
                var tmp = deck[location1];

                deck[location1] = deck[location2];
                deck[location2] = tmp;
            }
        }

        //Funcion maestra donde inicia el juego
        function startblackjack()
        {
            if(userMoney == 0){
              $.alert({
                  title: 'Ingresa dinero',
                  content: 'Para poder jugar necesitas tener más que $0.00.',
                  type: 'red',
                  typeAnimated: true,
                  buttons: {
                      tryAgain: {
                          text: 'Cerrar',
                          btnClass: 'btn-red',
                          action: function(){
                          }
                      },
                  }
              });
              return;
            }
            document.getElementById('start-panel').style.display = "none";
            document.getElementById('game-panel').style.display = "block";
            //En caso de que vuelva a empezar se restaurant los tags
            document.getElementById('btnStart').value = 'Jugar Otra vez';
            document.getElementById('btnUserMoney').style.cursor = "not-allowed";
            document.getElementById('btnUserMoney').style.backgroundColor = "grey";
            document.getElementById('stay').style.cursor = "";
            document.getElementById('stay').style.backgroundColor = "";
            document.getElementById('hit').style.cursor = "";
            document.getElementById('hit').style.backgroundColor = "";

            //Crea la baraja
            createDeck();

            //Mezcla Baraja
            shuffle();

            //Crea Jugador
            createPlayer();

            //Crea Dealer
            createDealer();

            //Crea los tags para dealer y jugador
            createPlayerUI();
            createDealerUI();

            //Asigna cartas a jugadores
            dealHands();
            document.getElementById('player_0').classList.add('active');
        }

        //Crea el juego de cartas del jugador y el dealer
        function dealHands()
        {

            for(var i = 0; i < 2; i++)
            {
                    //Se mete al for porque el jugador necesita dos cartas
                    var card = deck.pop();
                    players[0].Hand.push(card);
                    renderCard(card, 0);
                    updatePoints();
            }

            //Solamente se mete una sola vez para crear la primera carta del dealer
            cardDealer = deck.pop();
            dealers[0].Hand.push(cardDealer);
            var handDealer = document.getElementById('hand_dealer');
            handDealer.appendChild(getCardUI(cardDealer));
            updatePointsDealer();
        }

        //Se crea la carta
        function renderCard(card, player)
        {
            var hand = document.getElementById('hand_' + player);
            hand.appendChild(getCardUI(card));
        }

        //La carta se forma con los datos de la carta para poner el icono y numero
        function getCardUI(card)
        {
            var el = document.createElement('div');
            var icon = '';
            if (card.Suit == 'Hearts'){
              el.className = 'cardRed';
              icon='&hearts;';
            }
            else if (card.Suit == 'Spades'){
              icon = '&spades;';
              el.className = 'card';
            }
            else if (card.Suit == 'Diamonds'){
              el.className = 'cardRed';
              icon = '&diams;';
            }
            else{
              icon = '&clubs;';
              el.className = 'card';
            }

            el.innerHTML = card.Value + '<br/>' + icon;
            return el;
        }

        // Regresa el numero de puntos dependiendo de la suma del jugador
        function getPoints()
        {
            var points = 0;
            for(var i = 0; i < players[0].Hand.length; i++)
            {
                points += players[0].Hand[i].Weight;
            }
            players[0].Points = points;
            return points;
        }

        // Regresa el numero de puntos dependiendo de la suma del dealer
        function getPointsDealers()
        {
            var points = 0;
            for(var i = 0; i < dealers[0].Hand.length; i++)
            {
                points += dealers[0].Hand[i].Weight;
            }
            dealers[0].Points = points;
            return points;
        }


        //Actualiza el numero total de la suma de las cartas del jugador
        function updatePoints()
        {
            getPoints();
            document.getElementById('points_0').innerHTML = players[0].Points;

        }

        //Actualiza el numero total de la suma de las cartas del dealer
        function updatePointsDealer()
        {
            getPointsDealers();
            document.getElementById('points_D').innerHTML = dealers[0].Points;

        }

        //Activado por boton de pedir otra tarjeta
        function hitMe()
        {
            var card = deck.pop();
            players[0].Hand.push(card);
            renderCard(card, 0);
            updatePoints();
            check();
        }

        //Activado por boton el jugador se queda con su mano de juego
        function stay()
        {
                document.getElementById('btnUserMoney').style.cursor = "";
                document.getElementById('btnUserMoney').style.backgroundColor = "";
                document.getElementById('stay').style.cursor = "not-allowed";
                document.getElementById('stay').style.backgroundColor = "grey";
                document.getElementById('hit').style.cursor = "not-allowed";
                document.getElementById('hit').style.backgroundColor = "grey";
                end();

        }

        //Fin del juego
        function end()
        {
            //Verifica que el dealer tenga minimo 17 hasta que los tenga como requisito de suma de cartas
            while(dealers[0].Points < 17)
            {
                console.log("entro");
                var cardDealer = deck.pop();
                dealers[0].Hand.push(cardDealer);
                var handDealer = document.getElementById('hand_dealer');
                handDealer.appendChild(getCardUI(cardDealer));
                updatePointsDealer();
                check();
            }
            //Verifica si el jugador gana si su numero es mayor que el del dealer o dealer es mayor que 21 y jugador menor que 22
            if ((players[0].Points > dealers[0].Points || 21< dealers[0].Points )&& players[0].Points < 22)
            {
                userMoney += 100
                console.log(`Dinero: `,userMoney)
                document.getElementById('txtUserMoney').innerHTML = `Puntos: $${userMoney}`
                $.confirm({
                    title: '¡Felicidades!',
                    content: 'Ganaste + $100.00',
                    type: 'green',
                    typeAnimated: true,
                    buttons: {
                        tryAgain: {
                            text: 'Jugar otra vez',
                            btnClass: 'btn-green',
                            action: function(){
                            }
                        },
                    }
                });

            }else if(players[0].Points == dealers[0].Points){

                document.getElementById('parrafo').innerHTML = 'Empate';
                document.getElementById("id01").style.display = "block";
            }else{
                userMoney -= 100
                console.log(`Dinero: `, userMoney)
                document.getElementById('txtUserMoney').innerHTML = `Puntos: $${userMoney}`
                console.log(players[0].Points);
                console.log(dealers[0].Points);
                $.alert({
                    title: 'Perdiste',
                    content: 'Resulta en -$100.00.',
                    type: 'red',
                    typeAnimated: true,
                    buttons: {
                        tryAgain: {
                            text: 'Cerrar',
                            btnClass: 'btn-red',
                            action: function(){
                            }
                        },
                    }
                });
            }


        }

        //Verifica cuando al momento de pedir una carta es mayor a 21, pierdes el juego.
        function check()
        {
            if (players[0].Points > 21)
            {
                userMoney -= 100
                console.log(`Dinero: `, userMoney)
                document.getElementById('txtUserMoney').innerHTML = `Puntos: $${userMoney}`
                $.alert({
                    title: 'Perdiste',
                    content: 'Resulta en -$100.00.',
                    type: 'red',
                    typeAnimated: true,
                    buttons: {
                        tryAgain: {
                            text: 'Cerrar',
                            btnClass: 'btn-red',
                            action: function(){
                            }
                        },
                    }
                });
                document.getElementById('btnUserMoney').style.cursor = "";
                document.getElementById('btnUserMoney').style.backgroundColor = "";
                document.getElementById('stay').style.cursor = "not-allowed";
                document.getElementById('stay').style.backgroundColor = "grey";
                document.getElementById('hit').style.cursor = "not-allowed";
                document.getElementById('hit').style.backgroundColor = "grey";
            }
        }

        window.addEventListener('load', function(){
            createDeck();
            shuffle();
            createPlayer();
        });
