/**
 * Função para exibir mensagens na tela.
 * Recebe o texto e o tipo ('error' ou 'success')
 */
function mostrarMensagem(texto, tipo) {
    const divMsg = document.getElementById('mensagem');
    divMsg.textContent = texto;
    divMsg.className = `msg ${tipo}`;
}

/**
 * Função principal que valida o cadastro.
 * É chamada no clique do botão "Cadastrar".
 */
function validarCadastro() {
    // Captura os valores e utiliza trim() para remover espaços nas bordas
    const usuario = document.getElementById('iptUsuario').value.trim();
    const senha = document.getElementById('iptSenha').value.trim();

    // 1. Validação: Campos obrigatórios
    if (usuario === '' || senha === '') {
        mostrarMensagem('Erro: Usuário e senha são obrigatórios.', 'error');
        return; // Interrompe a execução
    }

    // 2. Validação: Senha precisa ter caractere especial
    // Utilizamos uma Expressão Regular (Regex) para verificar a presença de símbolos
    const regexEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!regexEspecial.test(senha)) {
        mostrarMensagem('Erro: A senha precisa de pelo menos um caractere especial (!, @, #, etc).', 'error');
        return;
    }

    // Se passou pelas validações, salvamos no LocalStorage
    // O exercício pede para não usar BD. Usamos o LocalStorage para simular a criação.
    localStorage.setItem('cadastro_usuario', usuario);
    localStorage.setItem('cadastro_senha', senha);

    mostrarMensagem('Cadastro realizado! Redirecionando...', 'success');

    // Redireciona automaticamente para o login após 1.5 segundos
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}