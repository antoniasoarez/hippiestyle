/* ==========================================
   SISTEMA DE NOTIFICAÇÕES (TOAST INTEGRADO)
   ========================================== */
function obterContainerNotificacoes() {
    let container = document.getElementById('container-notificacoes');
    if (!container) {
        container = document.createElement('div');
        container.id = 'container-notificacoes';
        document.body.appendChild(container);
    }
    return container;
}

function mostrarNotificacao(texto, tipo) {
    const container = obterContainerNotificacoes();
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;
    
    // Injeta estilos inline dinâmicos idênticos aos criados na função de estilo
    notificacao.style.minWidth = "260px";
    notificacao.style.padding = "14px 18px";
    notificacao.style.borderRadius = "6px";
    notificacao.style.color = "#ffffff";
    notificacao.style.fontSize = "13px";
    notificacao.style.backgroundColor = "#0a0a10";
    notificacao.style.border = tipo === "sucesso" ? "1px solid #3a8bff" : tipo === "erro" ? "1px solid #ffb4ab" : "1px solid #14192b";
    notificacao.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    notificacao.style.opacity = "0";
    notificacao.style.transform = "translateX(120%)";

    const msg = document.createElement('p');
    msg.textContent = texto;
    msg.style.margin = "0";
    msg.style.textAlign = "left";
    notificacao.appendChild(msg);

    container.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.opacity = "1";
        notificacao.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
        notificacao.style.opacity = "0";
        notificacao.style.transform = "translateX(120%)";
        setTimeout(() => { notificacao.remove(); }, 400);
    }, 4000);
}

/* ==========================================
   PERSISTÊNCIA E SINCRONIZAÇÃO DE DADOS
   ========================================== */
let usuariosGerais = JSON.parse(localStorage.getItem('usuarios')) || [];
let usuarioAtivoIndex = usuariosGerais.length - 1; 
let usuarioLogado = usuariosGerais[usuarioAtivoIndex];

function verificarSessaoERenderizar() {
    if (!usuarioLogado) {
        let msg = document.getElementById("msgRedirecionamento");
        if (msg) msg.textContent = "Área restrita. Faça login primeiro.";
        setTimeout(() => { window.location.href = '../index.html'; }, 2000);
        return;
    }

    // Injeta os dados cadastrados reais
    document.getElementById('user-name').textContent = `@${usuarioLogado.nome.toLowerCase().replace(/\s+/g, '')}`;
    document.getElementById('user-email').textContent = usuarioLogado.email.toLowerCase();
    document.getElementById('user-phone').textContent = usuarioLogado.telefone || "não informado";

    // Carrega Foto de Perfil se existir
    if (usuarioLogado.fotoPerfil) {
        document.getElementById('avatar-img').src = usuarioLogado.fotoPerfil;
        document.getElementById('avatar-img').style.display = 'block';
        document.getElementById('avatar-placeholder').style.display = 'none';
    }

    // Carrega Endereço se existir
    if (usuarioLogado.endereco) {
        document.getElementById('txt-endereco').innerHTML = `${usuarioLogado.endereco}<br>${usuarioLogado.cidade || ''}`;
    }

    renderizarProdutosDoCarrinhoNoPerfil();
}

/* ==========================================
   SINCRONIZAÇÃO DAS COMPRAS (CARRINHO)
   ========================================== */
function renderizarProdutosDoCarrinhoNoPerfil() {
    const listaProdutos = document.getElementById('lista-produtos-perfil');
    const totalTxt = document.getElementById('total-perfil-txt');
    const cart = JSON.parse(localStorage.getItem('hippiestyle_cart')) || [];

    if (!listaProdutos) return;

    if (cart.length === 0) {
        listaProdutos.innerHTML = "<p style='text-align:left; color:#55608a;'>Seu carrinho está vazio.</p>";
        totalTxt.textContent = "total do carrinho: r$ 0,00";
        return;
    }

    listaProdutos.innerHTML = "";
    let somaTotal = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        somaTotal += subtotal;
        
        const row = document.createElement('div');
        row.className = 'order-row';
        row.innerHTML = `
            <div class="order-details">
                <img class="product-thumb" src="${item.img || 'https://via.placeholder.com/40x50'}" alt="${item.name}">
                <div>
                    <p class="product-title">${item.name.toLowerCase()}</p>
                    <p class="order-sub">qtd: ${item.qty}</p>
                </div>
            </div>
            <div class="order-status">
                <span class="price">${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
        `;
        listaProdutos.appendChild(row);
    });

    totalTxt.textContent = `total do carrinho: ${somaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}

/* ==========================================
   MUDANÇA DE FOTO DE PERFIL (FILE READER)
   ========================================== */
document.getElementById('upload-avatar').addEventListener('change', function(e) {
    const arquivo = e.target.files[0];
    if (arquivo) {
        const leitor = new FileReader();
        leitor.onload = function(event) {
            const base64Imagem = event.target.result;
            
            // Salva na memória do usuário ativo
            usuarioLogado.fotoPerfil = base64Imagem;
            usuariosGerais[usuarioAtivoIndex] = usuarioLogado;
            localStorage.setItem('usuarios', JSON.stringify(usuariosGerais));

            // Renderiza na tela imediatamente
            document.getElementById('avatar-img').src = base64Imagem;
            document.getElementById('avatar-img').style.display = 'block';
            document.getElementById('avatar-placeholder').style.display = 'none';
            
            mostrarNotificacao("foto de perfil atualizada!", "sucesso");
        };
        leitor.readAsDataURL(arquivo);
    }
});

/* ==========================================
   EDIÇÃO DE ENDEREÇO EM TEMPO REAL
   ========================================== */
const btnEditarEndereco = document.getElementById('btn-editar-endereco');
const formEndereco = document.getElementById('form-endereco');
const boxVisualEndereco = document.getElementById('box-endereco-visual');

btnEditarEndereco.addEventListener('click', function() {
    if (formEndereco.style.display === 'none') {
        // Entra no modo de edição
        formEndereco.style.display = 'flex';
        boxVisualEndereco.style.display = 'none';
        btnEditarEndereco.textContent = 'salvar endereço';
        
        // Preenche os inputs com o que já existe
        document.getElementById('input-endereco').value = usuarioLogado.endereco || "";
        document.getElementById('input-cidade').value = usuarioLogado.cidade || "";
    } else {
        // Salva as alterações
        const novoEnd = document.getElementById('input-endereco').value.trim();
        const novaCit = document.getElementById('input-cidade').value.trim();

        if (novoEnd === "") {
            mostrarNotificacao("o campo de endereço não pode ficar vazio.", "erro");
            return;
        }

        usuarioLogado.endereco = novoEnd;
        usuarioLogado.cidade = novaCit;
        usuariosGerais[usuarioAtivoIndex] = usuarioLogado;
        localStorage.setItem('usuarios', JSON.stringify(usuariosGerais));

        // Atualiza a visualização estática
        document.getElementById('txt-endereco').innerHTML = `${novoEnd}<br>${novaCit}`;
        
        formEndereco.style.display = 'none';
        boxVisualEndereco.style.display = 'block';
        btnEditarEndereco.textContent = 'editar endereço';
        
        mostrarNotificacao("dados de entrega atualizados!", "sucesso");
    }
});

/* ==========================================
   LOGOUT
   ========================================== */
document.getElementById('btn-logout').addEventListener('click', function() {
    mostrarNotificacao("encerrando sessão...", "info");
    setTimeout(() => { window.location.href = '../index.html'; }, 1500);
});

document.addEventListener('DOMContentLoaded', verificarSessaoERenderizar);