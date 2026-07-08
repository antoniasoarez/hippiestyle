/* SISTEMA DE NOTIFICAÇÕES (TOAST) */
//METADE DOS COMENTARIO FOI FEITO PELOS DEUSESSS

/**
 * Injeta no <head> o CSS necessário para estilizar as notificações.
 * Isso é feito criando uma tag <style> e adicionando as regras dentro dela.
 * Assim, não precisamos mexer no arquivo de estilo da página.
 */
function criarEstiloNotificacao() {
    // Evita duplicar o estilo caso a função seja chamada mais de uma vez
    if (document.getElementById('estilo-notificacao')) return;

    const estilo = document.createElement('style');
    estilo.id = 'estilo-notificacao';

    estilo.textContent = `
        /* Container fixo no canto superior direito que vai empilhar as notificações */
        #container-notificacoes {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9999;
        }

        /* Estilo base de cada notificação */
        .notificacao {
            min-width: 260px;
            max-width: 320px;
            padding: 15px 18px;
            border-radius: 8px;
            color: #ffffff;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

            /* Estado inicial: fora da tela e transparente, para animar a entrada */
            opacity: 0;
            transform: translateX(120%);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }

        /* Classe adicionada logo após a criação, para disparar a animação de entrada */
        .notificacao.mostrar {
            opacity: 1;
            transform: translateX(0);
        }

        /* Classe adicionada antes de remover o elemento, para animar a saída */
        .notificacao.esconder {
            opacity: 0;
            transform: translateX(120%);
        }

        /* Cores de acordo com o tipo da notificação (seguindo a paleta da Hippiestyle) */
        .notificacao.sucesso {
            background-color: #14192b; /* azul marinho escuro */
            border: 1px solid #3a8bff;
        }

        .notificacao.erro {
            background-color: #1a1015;
            border: 1px solid #6b2b2b;
        }

        .notificacao.info {
            background-color: #0a0a10;
            border: 1px solid #14192b;
        }

        /* Botão que pode aparecer dentro da notificação (ex: "Ir para Login") */
        .notificacao button {
            display: block;
            margin-top: 10px;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            background-color: #3a8bff;
            color: #ffffff;
            font-size: 13px;
            cursor: pointer;
        }

        .notificacao button:hover {
            background-color: #1f6fe0;
        }
    `;

    document.head.appendChild(estilo);
}//aq acaba style das notificationsss

/*
 * Garante que exista na página um container para empilhar as notificações
 * Se ainda não existir, cria e adiciona no final do <body>
 */
function obterContainerNotificacoes() {
    let container = document.getElementById('container-notificacoes');

    if (!container) {
        container = document.createElement('div');
        container.id = 'container-notificacoes';
        document.body.appendChild(container);
    }

    return container;
}
//messi arabe nao ensinou isso mas e so um detalhe bobo pras notifications nao vim como alertt
/**
 * Função principal para exibir uma notificação na tela.
 * 
 * @param {string} texto - Mensagem que será exibida.
 * @param {string} tipo - 'sucesso', 'erro' ou 'info' (define a cor).
 * @param {number} duracao - Tempo em milissegundos até a notificação sumir sozinha.
 * @param {HTMLElement|null} botaoExtra - Um botão opcional para colocar dentro da notificação.
 */
function mostrarNotificacao(texto, tipo, duracao, botaoExtra) {
    // Garante que o CSS e o container já existem antes de criar a notificação
    criarEstiloNotificacao();
    const container = obterContainerNotificacoes();

    // Cria o elemento da notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;

    // Cria o texto da mensagem dentro da notificação
    const mensagem = document.createElement('p');
    mensagem.textContent = texto;
    mensagem.style.margin = '0';
    notificacao.appendChild(mensagem);

    // Se foi passado um botão extra (ex: "Ir para Login"), adiciona dentro da notificação
    if (botaoExtra) {
        notificacao.appendChild(botaoExtra);
    }

    // Adiciona a notificação no container
    container.appendChild(notificacao);


    //isso aqui foi os deuses qyue criaram, pq sem isso a notificação nao aparece com animação de entrada
    // Pequeno atraso antes de adicionar a classe "mostrar".
    // Isso é necessário para o navegador aplicar a transição de entrada corretamente.
    setTimeout(() => {
        notificacao.classList.add('mostrar');
    }, 10);

    // Depois do tempo definido, inicia a animação de saída
    const tempoParaEsconder = setTimeout(() => {
        esconderNotificacao(notificacao);
    }, duracao);

    // Retorna a notificação e o timer, caso seja necessário cancelar o desaparecimento
    // automático (por exemplo, se o usuário já clicou em um botão dentro dela)
    return { notificacao, tempoParaEsconder };
}

/**
 * Remove a notificação da tela com uma animação suave de saída.
 */
//essa aq o pai sabe
function esconderNotificacao(notificacao) {
    notificacao.classList.remove('mostrar');
    notificacao.classList.add('esconder');

    //grandes deuses sempre salvando noisss
    // Só remove o elemento do DOM depois que a animação (0.4s) terminar
    setTimeout(() => {
        notificacao.remove();
    }, 400);
}


/* LÓGICA DE CADASTRO */
//aq o pai domina
//falta so colocar pra ser obrigatorio os caracteres especiais e numeros na senha, mas isso é so um detalhe bobo
/**
 * Função principal, chamada quando o botão "Criar conta" é clicado.
 */
function criarConta() {

    // 1. Captura os valores digitados nos campos do formulário
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim(); // campo opcional
    const senha = document.getElementById('senha').value.trim();
    const confirmar = document.getElementById('confirmar').value.trim();

    // 2. Verifica se os campos obrigatórios foram preenchidos
    if (nome === '' || email === '' || senha === '' || confirmar === '') {
        mostrarNotificacao('Preencha todos os campos obrigatórios (nome, e-mail e senha).', 'erro', 4000);
        return;
    }

    // 3. Verifica se a senha e a confirmação de senha são iguais
    if (senha !== confirmar) {
        mostrarNotificacao('As senhas não coincidem. Verifique e tente novamente.', 'erro', 4000);
        return;
    }

    //messi ensinou ontem entao ta meio difff
    // 4. Busca a lista de usuários já cadastrados no localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));

    if (usuarios === null) {
        usuarios = [];
    }

    // 5. Verifica se já existe um usuário cadastrado com o mesmo e-mail
    const emailJaExiste = usuarios.some(function (usuario) {
        return usuario.email.toLowerCase() === email.toLowerCase();
    });

    if (emailJaExiste) {
        mostrarNotificacao('Já existe uma conta cadastrada com este e-mail.', 'erro', 4000);
        return;
    }

    // 6. Monta o objeto do novo usuário
    const novoUsuario = {
        nome: nome,
        email: email,
        telefone: telefone,
        senha: senha
    };

    //dammnn mt diff pedi ajuda externa 
    // 7. Adiciona o novo usuário no array de usuários
    usuarios.push(novoUsuario);

    // 8. Salva o array atualizado de volta no localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // 9. Limpa os campos do formulário
    limparFormulario();

    // 10. Mostra a notificação de sucesso com um botão para ir ao login
    exibirNotificacaoDeCadastroConcluido();
}

/**
 * Cria e exibe a notificação de sucesso do cadastro, com o botão
 * "Ir para Login" dentro dela, além do redirecionamento automático.
 */
function exibirNotificacaoDeCadastroConcluido() {

    //aprendi agora 
    // Cria o botão que ficará dentro da notificação
    const botaoLogin = document.createElement('button');
    botaoLogin.textContent = 'Ir para Login';


    //deuses....
    // Cria a notificação de sucesso, com duração de 5 segundos
    // (tempo em que ela deve sumir e redirecionar automaticamente)
    const { notificacao, tempoParaEsconder } = mostrarNotificacao(
        'Cadastro realizado com sucesso!',
        'sucesso',
        5000,
        botaoLogin
    );


    //ajuda externa de novo, pq o pai nao sabe tudo
    // Ao clicar no botão, cancela o redirecionamento automático
    // (para não rodar duas vezes) e vai direto para o login
    botaoLogin.addEventListener('click', function () {
        clearTimeout(tempoParaEsconder);
        window.location.href = 'pages/login.html';
    });

    // Redireciona automaticamente após 5 segundos, caso o usuário não clique no botão
    setTimeout(function () {
        window.location.href = 'pages/login.html';
    }, 5000);
}


//aq ja e padraio neeee
/**
 * Função auxiliar para limpar todos os campos do formulário
 * depois que o cadastro é concluído com sucesso.
 */
function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('confirmar').value = '';
}