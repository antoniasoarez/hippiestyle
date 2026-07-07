function mostrarMensagem(texto, tipo) {
    const divMsg = document.getElementById('mensagem');
    divMsg.textContent = texto;
    divMsg.className = `msg ${tipo}`;
}

/**
 * Função responsável por validar as credenciais do usuário.
 */
function validarLogin() {
    // Remove os espaços com trim()
    const usuarioInput = document.getElementById('iptUsuario').value.trim();
    const senhaInput = document.getElementById('iptSenha').value.trim();

    // Recupera os dados que foram gravados no cadastro
    const usuarioCadastrado = localStorage.getItem('cadastro_usuario');
    const senhaCadastrada = localStorage.getItem('cadastro_senha');

    // Valida se há dados salvos e se batem exatamente com o que foi digitado
    if (usuarioInput === usuarioCadastrado && senhaInput === senhaCadastrada) {
        // Grava no SessionStorage a sessão atual (o usuário está logado)
        sessionStorage.setItem('usuarioLogado', usuarioInput);
        
        mostrarMensagem('Acesso liberado.', 'success');
        
        // Redireciona para a Home
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    } else {
        // Caso os dados não batam
        mostrarMensagem('Usuário ou senha inválidos.', 'error');
    }
}