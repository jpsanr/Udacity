//classe referente ao menu iniciar 
class MenuInciar
{
    constructor()
    {
        this.contador = 1;
        this.atualizarMenu(1);
        this.situacao = "inicio"; 
    }
    
    //Texto de boas Vindas
    textoInicial()
    {
        ctx.fillStyle = "#333333";
        ctx.fillRect(0, 0, 505, 606);
        
        ctx.font = "30px Arial";
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText("Bem Vindo ao Jão's Game !!", 75, 75);
        ctx.font = "15px Arial";
        ctx.fillText("*Use fone de ouvidos", 175, 105);
    }
    

    //Metodo que desenha os botoes do menu iniciar
        //Recebe a possição do botão, texto e se esta selecionado para mudar a cor
    retanguloOpcao(x, y, texto, selecionado=false)
    {
        let cor = (selecionado === false) ? "#FFFFFF" : "#0D59FF";  
        
        ctx.fillStyle = cor;
        ctx.strokeStyle = cor;
        ctx.strokeRect(x, y, 150, 55);

        ctx.font = "30px Arial";
        ctx.fillText(texto, x+40, y+38);
    }
    
    
    //Metodo que redesenha o menu --> Equivalente ao render()
    atualizarMenu(botao)
    {
        switch (botao)
        {
            case 1:
            this.textoInicial();
            
            this.retanguloOpcao(175, 150,"Fácil", true);
            this.retanguloOpcao(175, 250, "Médio");
            this.retanguloOpcao(175, 350, "Difícil");
            break;
            
            case 2:
            this.textoInicial();
            
            this.retanguloOpcao(175, 150,"Fácil");
            this.retanguloOpcao(175, 250, "Médio", true);
            this.retanguloOpcao(175, 350, "Difícil");
            break;
            case 3:
            this.textoInicial();
            
            this.retanguloOpcao(175, 150,"Fácil");
            this.retanguloOpcao(175, 250, "Médio");
            this.retanguloOpcao(175, 350, "Difícil", true);
            break;
            
        }
        
    }
    
    //Trata os inputs
    handleInput(allowedKeys)
    {
        if(allowedKeys === "up")
        {
            (this.contador == 1) ? this.contador =3 : this.contador--;
            this.atualizarMenu(this.contador);
        }
        
        if(allowedKeys === "down")
        {
            (this.contador == 3) ? this.contador =1 : this.contador++;
            this.atualizarMenu(this.contador);
            
        }
        if(allowedKeys === "enter")
        {
            const dificuldade = {
                1: 'facil',
                2: 'medio',
                3: 'dificil',
            };
            console.log(`Dificuldade: ${dificuldade[this.contador]}`);
            console.log(this.contador);
            
            this.situacao = "jogar";
            
            //return this.contador;
            
            
            
        }
        console.log(`contador = ${this.contador}`);
        
    }
}

class NumeroAleatorio
{
    //Gera um num aleatório dado um range max - min
    gerarNumero(max, min=1)
    {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
}

//Classe que gera os sons do game 
class Beep
{
    constructor()
    {
        this.context = new AudioContext();
        this.oscillator;
        this.contextGain;
        //this.tempo = 1;
        
    };
    
    gerarBeep(tempo =1, type='triangle') //type = tipo da onda sonora -> triangular , dente de serra , senoidal, quadrada
    {
        this.oscillator = this.context.createOscillator();
        this.contextGain = this.context.createGain();
        
        this.oscillator.connect(this.contextGain);
        this.contextGain.connect(this.context.destination);
        this.oscillator.start(0);
        this.oscillator.type = type;
        
        this.contextGain.gain.exponentialRampToValueAtTime(
            0.00001, this.context.currentTime + tempo
        );
        
    }
    
    gerarMusicaVitoria()
    {    
        const audio = new Audio('songs/pacman_intermission.wav');
        audio.play();   
    }
    
    gerarMusicaFracasso()
    {
        const audio = new Audio('songs/pacman_death.wav');
        audio.play();   
    }
    
}

//Classe para ser herdada pelo player e enemy
class Component {
    constructor(x, y,sprite,  speed=5) {
        this.x = x;  
        this.y = y;
        this.sprite = sprite; //figura
        this.speed = speed;
    }
    
    render() 
    {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);  
    }  
       
}


class Enemy extends Component {
    constructor(x, y, sprite, speed) {
        super(x, y, sprite);
        this.speed = speed;
    }
    
    
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    update(dt, player)
    { 
        (this.x > 500) ? this.x = -50  : this.x += this.speed * dt;  /*verifica se o inimigo está no final do mapa
        se sim retorna ao inicio */
        
        //Verifica se houve colissão
        if( player.x - 70 < this.x && 
            player.x + 70 > this.x &&
            player.y - 42 < this.y &&
            player.y + 42 > this.y )
            {
                player.fracasso();
            }
        }
        
    }
    
    class Player extends Component
    {
        constructor(x, y, sprite, speed=100) {
            super(x, y, sprite); //herda valores do Componente
            this.speed = speed;
            this.flag = "vivo";  //verifica os status do jogador - vivo , morto, venceu
        }
        
        handleInput(allowedKeys)
        {
            var situacao ; //normal ou parede
            
            if(allowedKeys === "up")
            {
                if (this.y <= 75)
                {
                    this.y += -75;  
                    this.vitoria();
                    //situacao = 'parede';
                }
                else
                {
                    situacao = 'normal';
                    this.y += -75;  
                } 
            }
            
            if(allowedKeys === "down")
            {
                if (this.y >= 450)
                {
                    situacao = 'parede';
                }
                else
                {
                    situacao = 'normal';
                    this.y += 75;  
                } 
                
                
            }
            
            if(allowedKeys === "left")
            {
                if(this.x > 0)
                {
                    situacao = 'normal';
                    this.x += -100;     
                    
                }
                else
                {
                    situacao = 'parede';
                } 
                
            }
            
            if(allowedKeys === "right") 
            {
                if(this.x < 400)
                {
                    situacao = 'normal';
                    this.x += 100;      
                    
                }
                else
                {
                    situacao = 'parede';
                } 
                
                
            }
            if(allowedKeys === "enter")
            {
                location.reload();
                
                
                
            }
            
            (situacao === "parede") ? new Beep().gerarBeep(1, 'sawtooth') : new Beep().gerarBeep(1, 'triangle');
            
            
            console.log(`posição x: ${this.x}`);
            console.log(`posição y: ${this.y}`);
            
            
            
        }
        
        vitoria()
        {
            this.flag = "venceu";
            new Beep().gerarMusicaVitoria();
        }
        
        fracasso()
        {   
            console.log("MORREU!");
            this.flag = "morto";
            new Beep().gerarMusicaFracasso();
        }
        
        
    }
    
    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player
    
    function iniciarJogo(numInimigos=5)
    {
        
        player = new Player(200,450, "images/char-boy.png", 100);
        
        

        //Gerando os inimigos randomicamente 
            //tanto a posição como a velocidade
        let allEnemies = [];
        for ( i=0 ; i<numInimigos; i++)
        {
            const random = new NumeroAleatorio();
            const posY = random.gerarNumero(225,75);
            const speed = random.gerarNumero(200, 50);
            allEnemies.push(new Enemy(-50, posY, 'images/enemy-bug.png', speed));
            console.log(`Inimigo ${i} : y= ${posY} , Velocidade = ${speed}`);  
        }
        
        return allEnemies;
    }
        
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            13: 'enter',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        
        if(statusJogo === "inicio") 
        {
            menuIniciar.handleInput(allowedKeys[e.keyCode]) 
        }
        else 
        {
            player.handleInput(allowedKeys[e.keyCode]);
        }
    });
    
    