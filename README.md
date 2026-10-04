# 📄 Gerador de Termo de Retirada de Mercadoria

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![jsPDF](https://img.shields.io/badge/jsPDF-Client_Side-success?style=for-the-badge)

Uma aplicação web ágil e segura desenvolvida para a emissão de **Termos de Autorização para Retirada de Mercadoria**. Este sistema permite vincular um representante autorizado a uma Nota Fiscal Eletrônica (NF-e) específica, gerando automaticamente um documento PDF estruturado para controle logístico e comercial.

## ✨ Funcionalidades

* **Geração de PDF no Client-Side:** Utiliza a biblioteca [jsPDF](https://github.com/parallax/jsPDF) para montar o documento diretamente no navegador. O processamento local garante que dados sensíveis de clientes e notas fiscais não precisem transitar por servidores externos.
* **Opções de Validação Flexíveis:** O termo gerado prevê espaço para assinatura eletrônica oficial via **gov.br** ou registro de confirmação direta via **WhatsApp**, adaptando-se ao fluxo de atendimento.
* **Validações e Máscaras em Tempo Real:** 
  * Validação algorítmica de CPFs e CNPJs.
  * Formatação automática de moeda (R$) para o valor da nota fiscal.
  * Aplicação de máscaras para placas de veículos e documentos.
* **Suporte a Temas (Light / Dark Mode):** Interface responsiva que se adapta automaticamente às preferências de tema do sistema do usuário, proporcionando conforto visual.
* **Layout Adaptável:** Construído com CSS Grid e Flexbox, garantindo usabilidade perfeita em desktops, tablets e smartphones (Mobile First).

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando tecnologias web fundamentais (Vanilla), com foco em performance e ausência de dependências complexas:

* **HTML5:** Estrutura semântica e formulários acessíveis.
* **CSS3:** Estilização baseada em variáveis (Custom Properties) para fácil manutenção e temas dinâmicos.
* **JavaScript (ES6+):** Lógica de negócios, validação de inputs, formatação de dados e manipulação do DOM.
* [**jsPDF (2.5.1)**](https://github.com/parallax/jsPDF)**:** Engine de geração do arquivo PDF.

## 🚀 Como Executar o Projeto

Como a aplicação é estritamente *client-side* (Front-end), você não precisa configurar servidores ou bancos de dados.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/renaldopetlim/nome-do-seu-repositorio.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd nome-do-seu-repositorio
   ```

3. **Execute:**
   Basta abrir o arquivo principal (`index_2.html` ou `index.html`) diretamente no seu navegador.

*💡 Pode ser facilmente hospedado em plataformas gratuitas de arquivos estáticos como GitHub Pages, Vercel ou Netlify.*

## 📋 Fluxo de Uso

1. O usuário preenche os dados do **Cliente/Titular** (incluindo número do pedido, NF-e, orçamento e valor).
2. Insere os dados do **Representante (Outorgado)** que fará a retirada (Nome, CPF, Cód. RCA e Placa do Veículo).
3. Define as informações da **Retirada** (Data, Hora e Local).
4. Opcionalmente, preenche os dados de confirmação via WhatsApp.
5. Clica em **"Gerar PDF"**. O sistema checa a integridade dos dados e faz o download automático de um arquivo nomeado `Termo_Retirada_Pedido_[Numero].pdf`.
6. O PDF gerado é enviado para assinatura eletrônica (gov.br) ou arquivado como comprovante de atendimento via WhatsApp.

## 👨‍💻 Desenvolvedor

Desenvolvido com dedicação por **Renaldo Petlim**.

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/renaldopetlim)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/renaldopetlim/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/renaldopetlim/)