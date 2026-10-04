# 📄 Emissão de Termo de Retirada de Mercadoria

Um aplicativo web *front-end* responsivo criado para facilitar e padronizar a emissão de **Termos de Autorização para Retirada de Mercadorias** (especificamente para o CD Alça Viária). A ferramenta permite que o usuário preencha um formulário validado e gere automaticamente um documento em PDF pronto para assinatura digital via [gov.br](https://assinador.iti.br/) ou aprovação via WhatsApp.

## ✨ Funcionalidades

- **Geração de PDF Automática:** Utiliza a biblioteca `jsPDF` para desenhar o documento do zero, formatando textos, grades e adaptando dinamicamente a escala para garantir que o termo caiba perfeitamente em uma única página A4.
- **Validação de Dados:** Máscaras automáticas e validação rigorosa com algoritmos reais para CPF e CNPJ.
- **Formatação em Tempo Real:** Máscaras para placas de veículos (maiúsculas e hifens) e valores monetários (R$).
- **Estrutura Baseada em Schema:** O formulário HTML é gerado dinamicamente via JavaScript através de uma estrutura de arrays (Schema), o que facilita a adição ou remoção de campos no futuro.
- **Tema Claro/Escuro:** Suporte nativo a *Dark Mode* de acordo com as preferências do sistema operacional do usuário.
- **Design Responsivo:** A interface se adapta perfeitamente a dispositivos móveis e desktops.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica e acessibilidade.
- **CSS3 (Vanilla):** Variáveis de ambiente (`:root`), responsividade, suporte a temas (light/dark) e "safe areas" para dispositivos móveis.
- **JavaScript (ES6+):** Lógica do formulário, validações, manipulação de DOM e injeção do PDF.
- **[jsPDF](https://github.com/parallax/jsPDF):** Biblioteca externa carregada via CDN para a construção do arquivo PDF direto no navegador do cliente.

## 🚀 Como executar o projeto

Como o projeto é construído usando tecnologias web padrão e não possui dependências de *back-end*, executá-lo é extremamente simples:

1. Faça o clone deste repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   ```
2. Navegue até a pasta do projeto.
3. Abra o arquivo `index.html` em qualquer navegador web moderno (Chrome, Firefox, Edge, Safari).
   *Ou, se preferir, sirva os arquivos através de um servidor local simples como o Live Server do VS Code.*

## 📂 Estrutura de Arquivos

- `index.html`: Estrutura principal da página, cabeçalho, rodapé e importação de scripts.
- `style.css`: Estilização completa do projeto, definição de variáveis de cores e layout em *Grid*.
- `script.js`: Coração da aplicação. Contém:
  1. A definição do *Schema* dos campos.
  2. Funções utilitárias (máscaras e tratamento de imagens).
  3. Validadores de CPF e CNPJ.
  4. Lógica de renderização da interface.
  5. Função complexa de desenho do PDF (tabelas, fontes, layouts) com ajuste automático de escala.
- `assets/`: Pasta recomendada para incluir a logo da empresa (`logo.png`) e o ícone da aba (`logo-mini.ico`).

## ✍️ Fluxo de Uso

1. O operador preenche os dados do Pedido, Cliente (Titular da NF-e) e Representante.
2. O sistema acusa caso haja campos obrigatórios em branco ou se o CPF/CNPJ inserido for inválido.
3. Ao clicar em **Gerar PDF**, o JavaScript compila os dados, converte a logo para Base64 e renderiza o layout do documento.
4. O arquivo `.pdf` é baixado automaticamente no dispositivo com o nome padronizado.
5. O PDF pode então ser enviado para o portal gov.br para assinatura eletrônica com validade jurídica.