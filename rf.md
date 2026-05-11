# Documentação de Requisitos Funcionais - MeVêUm

## 1. Gestão da Loja e Configurações (O "Tenant")
* **RF01:** O sistema deve permitir o cadastro e autenticação (Login/Logout) do administrador da loja.
* **RF02:** O lojista deve poder configurar os dados da loja (Nome, Logo, Subdomínio/Slug, e Número do WhatsApp recebedor).
* **RF03:** O lojista deve poder configurar a grade de **Horário de Funcionamento** (dias da semana, horário de abertura e fechamento).
* **RF04:** O lojista deve poder cadastrar **Áreas de Entrega e Taxas** (por bairro, CEP ou raio de km).
* **RF05:** O lojista deve poder selecionar quais **Formas de Pagamento** aceita (Pix, Cartão na entrega, Dinheiro).
* **RF06:** O lojista deve ter um botão de "Pausa" para fechar a loja manualmente, independentemente do horário configurado.

## 2. Gestão do Catálogo de Produtos
* **RF07:** O lojista deve poder criar, editar, ordenar, inativar e excluir **Categorias** (ex: Entradas, Pratos Principais, Bebidas).
* **RF08:** O lojista deve poder criar, editar, inativar e excluir **Produtos** (Nome, Descrição, Preço Base, Imagem e Categoria).
* **RF09:** O lojista deve poder criar **Grupos de Complementos** (ex: "Escolha seu ponto da carne", "Adicionais na Pizza").
* **RF10:** O lojista deve poder definir regras para os Grupos de Complementos, estabelecendo quantidade mínima (obrigatoriedade) e máxima de seleção.
* **RF11:** O lojista deve poder vincular os Grupos de Complementos a produtos específicos.

## 3. Experiência do Cliente (Cardápio Digital)
* **RF12:** O sistema deve carregar o cardápio correto baseado no identificador do tenant (ex: `meveum.com.br/bellaroma`).
* **RF13:** O sistema deve exibir no topo se a loja está **Aberta ou Fechada** (validando o RF03 e RF06). Se fechada, deve bloquear novas adições ao carrinho.
* **RF14:** O cliente deve poder buscar produtos por nome usando uma barra de pesquisa.
* **RF15:** O cliente, ao clicar em um produto, deve visualizar os detalhes e selecionar os complementos respeitando as regras de mínimo e máximo (RF10).

## 4. Carrinho e Checkout (Fechamento do Pedido)
* **RF16:** O cliente deve poder adicionar itens ao carrinho, alterar as quantidades ou remover itens.
* **RF17:** O cliente deve poder selecionar o tipo de recebimento: **Delivery** ou **Retirada no Balcão**.
* **RF18:** Se Delivery, o cliente deve inserir o endereço e o sistema deve calcular a taxa de entrega automaticamente (baseado no RF04).
* **RF19:** O sistema deve somar o preço base dos produtos, o valor dos complementos extras e a taxa de entrega para exibir o **Valor Total**.
* **RF20:** O cliente deve selecionar a forma de pagamento. Se for "Dinheiro", o sistema deve exibir um campo perguntando se precisa de troco (e para quanto).
* **RF21:** O cliente deve poder adicionar uma observação geral ao pedido (ex: "Tocar a campainha, cachorro bravo").
* **RF22:** Ao finalizar, o sistema deve compilar todos esses dados em um texto estruturado e disparar a abertura do WhatsApp Web/App direto para o número da loja.

## 5. Gestão de Pedidos (Painel do Lojista)
* **RF23:** O lojista deve ter um painel (estilo Kanban) com as colunas de status: Novo, Em Preparo, Saiu para Entrega, Finalizado e Cancelado.
* **RF24:** O lojista deve poder mover os pedidos entre essas colunas para atualizar o próprio controle interno.