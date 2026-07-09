// Função unificada para gerenciar mensagens de feedback na tela (Sucesso/Erro)
function mostrarMensagem(texto, tipo) {
  var mensagem = document.getElementById("mensagem");
  if (!mensagem) return; // Evita erros caso o elemento falte na árvore DOM

  mensagem.innerText = texto;
  mensagem.className = tipo; // Aplica a classe correspondente para estilização (.sucesso ou .erro)

  // Desfaz a alteração visual após 2.5 segundos limpando a área
  setTimeout(function () {
    mensagem.innerText = "";
    mensagem.className = "";
  }, 2500);
}

// Lógica de Integração: Envia as propriedades estruturadas para o banco persistente do navegador
function addCarrinho(id, name, price, img, description) {
  // Busca a lista atualizada ou gera um array vazio de controle se for o primeiro item
  var carrinho = JSON.parse(localStorage.getItem('hippiestyle_cart')) || [];

  // Tenta localizar se o produto clicado já existe dentro da listagem através do ID único
  var produtoExistente = carrinho.find(function (item) {
    return item.id === id;
  });

  if (produtoExistente) {
    // Se já existir na lista, incrementa a quantidade nativa preservando a integridade dos dados
    produtoExistente.qty += 1;
  } else {
    // Se for um item inédito, monta o objeto completo esperado pela tela de fechamento de pedido
    var novoProduto = {
      id: id,
      name: name,
      price: price,
      qty: 1,
      img: img,
      description: description
    };
    carrinho.push(novoProduto);
  }

  // Salva o novo estado consolidado do array de volta ao localStorage do navegador
  localStorage.setItem('hippiestyle_cart', JSON.stringify(carrinho));

  // Aciona a mensagem de feedback azul elétrico herdada do CSS padrão
  mostrarMensagem(name + " foi adicionado ao carrinho com sucesso!", "sucesso");
}