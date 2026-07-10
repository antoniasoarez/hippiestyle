# Hippiestyle 🌀

Hippiestyle é um site de e-commerce fictício de moda streetwear, inspirado em coleções de artistas (Matuê, lilgiela33). O projeto foi desenvolvido em **HTML, CSS e JavaScript puro (vanilla)**, sem frameworks ou bibliotecas externas, utilizando `localStorage` e `sessionStorage` do navegador para simular autenticação de usuários e persistência do carrinho de compras.

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Páginas](#páginas)
- [Funcionalidades](#funcionalidades)
- [Sistema de autenticação](#sistema-de-autenticação)
- [Sistema de notificações (Toast)](#sistema-de-notificações-toast)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Próximos passos](#próximos-passos)

## Sobre o projeto

O Hippiestyle simula uma loja virtual completa, permitindo que o usuário:

- Crie uma conta e faça login;
- Navegue por coleções de produtos organizadas por artista;
- Adicione produtos ao carrinho;
- Visualize e gerencie seu carrinho de compras;
- Acesse um perfil pessoal.

Toda a persistência de dados (usuários cadastrados, sessão ativa e itens do carrinho) é feita no navegador, usando `localStorage` e `sessionStorage` — não há back-end ou banco de dados real.

## Estrutura de pastas

```
HIPPIESTYLE/
├── index.html              # Página de login (porta de entrada do site)
├── README.md
├── pages/
│   ├── cadastro.html       # Criação de conta
│   ├── carrinho.html       # Carrinho de compras
│   ├── home.html           # Página inicial (coleções em destaque)
│   ├── perfil.html         # Perfil do usuário logado
│   └── produtos.html       # Catálogo de produtos por coleção
├── script/
│   ├── cadastro.js         # Lógica de criação de conta
│   ├── carrinho.js         # Lógica do carrinho de compras
│   ├── home.js             # Lógica da página inicial
│   ├── login.js            # Lógica de autenticação
│   ├── perfil.js           # Lógica da página de perfil
│   └── produtos.js         # Lógica do catálogo e "adicionar ao carrinho"
├── style/
│   ├── cadastro.css
│   ├── carrinho.css
│   ├── home.css
│   ├── login.css
│   ├── perfil.css
│   ├── produtos.css
│   └── style.css           # Estilos globais/compartilhados
└── src/
    └── images/              # Imagens dos produtos e coleções
```

## Páginas

| Página | Descrição |
|---|---|
| `index.html` | Tela de login. Ponto de entrada do site. |
| `pages/cadastro.html` | Formulário de criação de conta (nome, e-mail, telefone, senha). |
| `pages/home.html` | Página inicial com destaque das coleções (Matuê e lilgiela33). |
| `pages/produtos.html` | Catálogo completo de produtos, separado por coleção/artista. |
| `pages/carrinho.html` | Lista de produtos adicionados ao carrinho, com total da compra. |
| `pages/perfil.html` | Área do usuário logado. |

## Funcionalidades

### Cadastro de usuário
- Validação de campos obrigatórios (nome, e-mail e senha).
- Validação de força de senha (mínimo 8 caracteres, letra, número e caractere especial).
- Validação de formato de e-mail.
- Verificação de e-mail já cadastrado.
- Validação de telefone (11 dígitos).
- Usuários salvos em `localStorage` na chave `usuarios`.

### Login
- Validação das credenciais contra os usuários salvos em `localStorage`.
- Sessão do usuário logado salva em `sessionStorage` na chave `usuarioLogado` (dura enquanto a aba estiver aberta).
- Redirecionamento automático para a Home após login bem-sucedido.

### Home e Produtos
- Exibição das coleções por artista (Matuê e lilgiela33).
- Links diretos das coleções da Home para as respectivas seções do catálogo (`produtos.html#colecao-matue`, `produtos.html#colecao-lilgiela33`).
- Botão de acesso rápido ao **Perfil**, fixo no canto superior direito da tela, presente na Home e em Produtos:
  - Se o usuário estiver logado (`sessionStorage.usuarioLogado`), o botão leva direto para `perfil.html`.
  - Se não estiver logado, exibe uma notificação de aviso e redireciona para `cadastro.html`.

### Carrinho de compras
- Produtos adicionados via botão "adicionar ao carrinho" em `produtos.html`.
- Cada produto adicionado é salvo em `localStorage` na chave `hippiestyle_cart`, com `id`, `name`, `price`, `qty`, `img` e `description`.
- Se o produto já estiver no carrinho, a quantidade (`qty`) é incrementada automaticamente.

## Sistema de autenticação

O projeto usa duas camadas de armazenamento no navegador:

- **`localStorage.usuarios`**: array persistente com todos os usuários cadastrados (fica salvo mesmo após fechar o navegador).
- **`sessionStorage.usuarioLogado`**: guarda o nome do usuário logado apenas durante a sessão atual da aba (é apagado ao fechar a aba/navegador).

> ⚠️ **Observação:** por usar `sessionStorage`, o usuário precisa refazer login toda vez que abrir uma nova aba/sessão do navegador, mesmo já tendo uma conta cadastrada.

## Sistema de notificações (Toast)

Todas as páginas com interação (login, cadastro, home, produtos) utilizam um sistema de notificações "toast" padronizado, com a mesma identidade visual:

- Aparecem no canto superior direito da tela, empilhadas.
- Cores diferentes para sucesso (azul elétrico `#3a8bff`) e erro (vinho `#6b2b2b`).
- Animação de entrada e saída suave.
- Duração configurável (padrão de 4 segundos).

Funções principais: `criarEstiloNotificacao()`, `obterContainerNotificacoes()` e `mostrarNotificacao(texto, tipo, duracao)`.

## Como rodar o projeto

Por ser um projeto 100% front-end (sem back-end), basta:

1. Clonar ou baixar a pasta do projeto.
2. Abrir o arquivo `index.html` diretamente no navegador,

   **ou** (recomendado, para evitar problemas com caminhos relativos):

3. Rodar um servidor local simples, por exemplo com a extensão **Live Server** do VS Code, clicando com o botão direito em `index.html` → "Open with Live Server".

Não é necessário instalar dependências — não há `package.json` nem build step.

## Tecnologias utilizadas

- **HTML5** — estrutura semântica das páginas.
- **CSS3** — estilização, com fonte customizada [Metal Mania](https://fonts.google.com/specimen/Metal+Mania) via Google Fonts e paleta escura/streetwear.
- **JavaScript (Vanilla)** — toda a lógica de autenticação, carrinho e notificações, sem frameworks.
- **Web Storage API** (`localStorage` e `sessionStorage`) — persistência de dados no navegador.

## Próximos passos

Algumas melhorias que podem ser implementadas no projeto:

- [ ] Migrar o login para `localStorage`, caso se deseje manter a sessão entre fechamentos do navegador.
- [ ] Implementar a página `perfil.html` com edição de dados do usuário.
- [ ] Finalizar a lógica de remoção/edição de itens no carrinho.
- [ ] Adicionar validação de formulário de newsletter na Home.
- [ ] Unificar o sistema de notificações (toast) em um único arquivo JS compartilhado, evitando duplicação de código entre `login.js`, `cadastro.js`, `home.js` e `produtos.js`.

---

Hippiestyle© — projeto desenvolvido para fins de estudo.