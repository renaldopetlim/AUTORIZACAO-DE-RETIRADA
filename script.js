/* ==========================================================================
   1. ESTRUTURA DE DADOS E SCHEMA DO FORMULÁRIO
   ========================================================================== */
const SCHEMA = [
  ['Identificação', [
    ['pedido', 'Nº do pedido'],
    ['emissao', 'Data de emissão', 'date']
  ]],
  ['2. Cliente — titular da nota fiscal (outorgante)', [
    ['cliente', 'Cliente (razão social / nome)', 'text', 'full'],
    ['doc', 'CNPJ / CPF'],
    ['nfe', 'NF-e Nº'],
    ['orc', 'Orçamento Nº'],
    ['valor', 'Valor total da nota fiscal (R$)'],
    ['prazo', 'Prazo de pagamento']
  ]],
  ['3. Representante autorizado à retirada (outorgado)', [
    ['rep', 'Nome completo', 'text', 'full'],
    ['repcpf', 'CPF'],
    ['rca', 'Cód. RCA'],
    ['placa', 'Veículo — placa']
  ]],
  ['4. Retirada', [
    ['dret', 'Data da retirada', 'date'],
    ['hret', 'Hora', 'time'],
    ['local', 'Local / doca (CD Alça Viária)', 'text', 'full']
  ]],
  ['Confirmação por WhatsApp (opcional)', [
    ['zap', 'WhatsApp / contato do cadastro'],
    ['zapdh', 'Data / hora da confirmação', 'datetime-local']
  ]]
];

const REQ = [
  'pedido', 'emissao', 'cliente', 'doc', 'orc', 
  'valor', 'prazo', 'rep', 'repcpf', 'dret'
];

/* ==========================================================================
   2. FUNÇÕES UTILITÁRIAS E HELPER DOM
   ========================================================================== */
const $ = (id) => document.getElementById(id);
const getValue = (id) => ($(id).value || '').trim();
const onlyDigits = (str) => str.replace(/\D/g, '');

const maskCPF = (str) => str.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
const maskCNPJ = (str) => str.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');

const formatDate = (str) => {
  if (!str) return '';
  const parts = str.split('T');
  const dateRev = parts[0].split('-').reverse().join('/');
  return parts.length > 1 ? `${dateRev} ${parts[1]}` : dateRev;
};

const getToday = () => {
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzOffset).toISOString().slice(0, 10);
};

/**
 * Converte a imagem da pasta assets para Base64 dinamicamente
 */
function getBase64ImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}

/* ==========================================================================
   3. VALIDAÇÕES SENSÍVEIS (CPF / CNPJ)
   ========================================================================== */
function validateCPF(str) {
  const s = onlyDigits(str);
  if (s.length !== 11 || /^(\d)\1+$/.test(s)) return false;
  
  for (let t = 9; t < 11; t++) {
    let r = 0;
    for (let i = 0; i < t; i++) r += s[i] * (t + 1 - i);
    if ((r * 10 % 11) % 10 != s[t]) return false;
  }
  return true;
}

function validateCNPJ(str) {
  const s = onlyDigits(str);
  if (s.length !== 14 || /^(\d)\1+$/.test(s)) return false;
  
  for (let t = 12; t < 14; t++) {
    let r = 0, p = t - 7;
    for (let i = 0; i < t; i++) {
      r += s[i] * p--;
      if (p < 2) p = 9;
    }
    if ((r * 10 % 11) % 10 != s[t]) return false;
  }
  return true;
}

function validateForm() {
  let ok = true;
  let firstInvalid = null;

  document.querySelectorAll('.msg').forEach((m) => (m.textContent = ''));
  document.querySelectorAll('input').forEach((i) => i.classList.remove('bad'));

  const setBad = (id, text) => {
    ok = false;
    $(id).classList.add('bad');$(`m_${id}`).textContent = text;
    firstInvalid = firstInvalid || $(id);
  };

  REQ.forEach((id) => {
    if (!getValue(id)) setBad(id, 'Campo obrigatório');
  });

  const docDigits = onlyDigits(getValue('doc'));
  if (docDigits) {
    const isValid = docDigits.length === 11 
      ? validateCPF(docDigits) 
      : docDigits.length === 14 
        ? validateCNPJ(docDigits) 
        : false;
        
    if (!isValid) setBad('doc', 'CPF/CNPJ inválido');
  }

  if (getValue('repcpf') && !validateCPF(getValue('repcpf'))) {
    setBad('repcpf', 'CPF inválido');
  }

  if (firstInvalid) {
    firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  return ok;
}

/* ==========================================================================
   4. RENDERIZAÇÃO DO FORMULÁRIO E EVENTOS
   ========================================================================== */
function renderForm() {
  $('f').innerHTML = SCHEMA.map(([title, fields]) => `
    <fieldset>
      <legend>${title}</legend>
      <div class="g">
        ${fields.map(([id, label, type, fullClass]) => `
          <div class="${fullClass || ''}">
            <label for="${id}">${label}${REQ.includes(id) ? ' *' : ''}</label>
            <input id="${id}" type="${type || 'text'}" autocomplete="off">
            <div class="msg" id="m_${id}"></div>
          </div>
        `).join('')}
      </div>
    </fieldset>
  `).join('');
}

function attachInputEvents() {
  $('doc').addEventListener('input', (e) => {
    const d = onlyDigits(e.target.value).slice(0, 14);
    e.target.value = d.length <= 11 ? maskCPF(d) : maskCNPJ(d);
  });

  $('repcpf').addEventListener('input', (e) => {
    e.target.value = maskCPF(onlyDigits(e.target.value).slice(0, 11));
  });

  $('valor').addEventListener('input', (e) => {
    const d = onlyDigits(e.target.value);
    if (!d) {
      e.target.value = '';
      return;
    }
    e.target.value = (parseInt(d, 10) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  });

  $('placa').addEventListener('input', (e) => {
    e.target.value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '')
      .slice(0, 8);
  });

  ['cliente', 'rep'].forEach((id) => {
    $(id).addEventListener('blur', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
  });
}

function resetForm() {
  document.querySelectorAll('input').forEach((i) => (i.value = ''));
  $('emissao').value = getToday();
  $('dret').value = getToday();$('local').value = 'CD Alça Viária';
  $('st').textContent = '';
  document.querySelectorAll('.bad').forEach((i) => i.classList.remove('bad'));
  document.querySelectorAll('.msg').forEach((m) => (m.textContent = ''));
}

/* ==========================================================================
   5. CONSTRUÇÃO DO PDF (jsPDF) - OTIMIZADO PARA 1 PÁGINA COM FONTE MAIOR
   ========================================================================== */
function buildPDF(scaleFactor, logoBase64) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  
  const W = 210, M = 14, CW = W - 2 * M;
  const COLOR_NAVY = [23, 38, 77];
  const COLOR_ORANGE = [240, 122, 10];
  const COLOR_GRAY = [90, 98, 112];
  let y = 0;

  const checkOverflow = (height) => {
    if (y + height > 272) {
      doc.addPage();
      y = 28;
    }
  };

  const renderBar = (text) => {
    checkOverflow(9.5 * scaleFactor);
    doc.setFillColor(...COLOR_NAVY);
    doc.rect(M, y, CW, 5.8 * scaleFactor, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8 * scaleFactor); // Aumentado (era 8.2)
    doc.setTextColor(255, 255, 255);
    doc.text(text, M + 2.5, y + 4.1 * scaleFactor);
    y += 5.8 * scaleFactor;
  };

  const renderParagraph = (text, size = 8.8, gap = 1.8, style = 'normal', color = [40, 40, 40]) => {
    size *= scaleFactor; // Aumentado padrão (era 8.4)
    gap *= scaleFactor;  // Reduzido espaçamento desnecessário (era 2.2)
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    
    const lines = doc.splitTextToSize(text, CW);
    checkOverflow(lines.length * size * 0.38 + gap);
    doc.text(lines, M, y + 3 * scaleFactor);
    y += lines.length * size * 0.38 + gap;
  };

  const renderGrid = (items, height = 10.2) => {
    height *= scaleFactor;
    checkOverflow(height);
    
    const totalWeight = items.reduce((acc, item) => acc + (item[2] || 1), 0);
    let x = M;

    items.forEach(([label, value, weight = 1]) => {
      const colWidth = (CW * weight) / totalWeight;
      
      doc.setDrawColor(190, 198, 215);
      doc.setFillColor(245, 247, 251);
      doc.rect(x, y, colWidth, height, 'FD');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5 * scaleFactor); // Aumentado (era 6.0)
      doc.setTextColor(...COLOR_NAVY);
      doc.text(label, x + 2, y + 3.2 * scaleFactor);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5 * scaleFactor); // Aumentado (era 9.0)
      
      let formattedText = doc.splitTextToSize(value || '', colWidth - 4);
      if (formattedText.length > 1) {
        doc.setFontSize(7.8 * scaleFactor); // Aumentado (era 7.2)
        formattedText = doc.splitTextToSize(value || '', colWidth - 4).slice(0, 2);
      }
      
      doc.setTextColor(25, 25, 25);
      doc.text(formattedText, x + 2, y + (formattedText.length > 1 ? 6.2 : 7.8) * scaleFactor);
      x += colWidth;
    });

    y += height;
  };

  // --- CABEÇALHO DO PDF ---
  doc.setFillColor(...COLOR_NAVY);
  doc.rect(0, 0, W, 23, 'F');
  doc.setFillColor(...COLOR_ORANGE);
  doc.rect(0, 23, W, 1.2, 'F');

  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', M, 2.8, 40, 17, undefined, 'FAST');
    } catch (e) {
      console.warn('Não foi possível inserir a imagem no PDF:', e);
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text('DOCUMENTO DE CONTROLE COMERCIAL / LOGÍSTICO', W - M, 10, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.text('Preenchimento digital · Confirmação por gov.br ou WhatsApp', W - M, 15.5, { align: 'right' });
  
  y = 33; // Ganho de 5mm no topo

  // --- CORPO DO DOCUMENTO ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5 * scaleFactor); // Aumentado (era 12)
  doc.setTextColor(...COLOR_NAVY);
  doc.text('TERMO DE AUTORIZAÇÃO PARA RETIRADA DE MERCADORIA', W / 2, y, { align: 'center' });
  
  doc.setFontSize(8.5 * scaleFactor); // Aumentado (era 8)
  doc.setTextColor(...COLOR_ORANGE);
  doc.text('CONFIRMAÇÃO DO CLIENTE · CD ALÇA VIÁRIA', W / 2, y + 4.5 * scaleFactor, { align: 'center' });
  y += 7.5 * scaleFactor;

  renderGrid([['Nº DO PEDIDO', getValue('pedido')], ['DATA DE EMISSÃO', formatDate(getValue('emissao'))]]);
  y += 1.8 * scaleFactor;

  renderBar('1. DA DISTRIBUIDORA (EMITENTE / DEPOSITÁRIA)');
  y += 0.8 * scaleFactor;
  renderParagraph('DISTRIBUIDORA SÃO PAULO — O ATACADO DA CONSTRUÇÃO, inscrita no CNPJ/MF sob o nº 13.424.484/0001-48, com Centro de Distribuição situado na Alça Viária, Marituba/PA (“CD Alça Viária”), responsável pela guarda e liberação da mercadoria.');

  renderBar('2. DO CLIENTE — TITULAR DA NOTA FISCAL (OUTORGANTE)');
  renderGrid([
    ['CLIENTE (RAZÃO SOCIAL / NOME)', getValue('cliente'), 2.6],
    ['CNPJ / CPF', getValue('doc'), 1.5],
    ['NF-e Nº', getValue('nfe'), 1.1],
    ['ORÇAMENTO Nº', getValue('orc'), 1.1]
  ]);
  renderGrid([
    ['VALOR TOTAL DA NOTA FISCAL (R$)', getValue('valor')],
    ['PRAZO DE PAGAMENTO', getValue('prazo')]
  ]);
  y += 1.8 * scaleFactor;

  renderBar('3. DO REPRESENTANTE AUTORIZADO À RETIRADA (OUTORGADO)');
  renderGrid([
    ['NOME COMPLETO', getValue('rep'), 2.8],
    ['CPF', getValue('repcpf'), 1.5],
    ['CÓD. RCA', getValue('rca'), 1],
    ['VEÍCULO — PLACA', getValue('placa'), 1.3]
  ]);
  y += 1.8 * scaleFactor;

  renderBar('4. DO OBJETO E DA FINALIDADE');
  y += 0.8 * scaleFactor;
  renderParagraph('O CLIENTE acima identificado AUTORIZA o representante a retirar, junto ao CD Alça Viária da Distribuidora São Paulo, a mercadoria referente à NF-e de sua titularidade, para posterior entrega. A confirmação do cliente ocorre por uma de duas formas de validação — assinatura eletrônica (gov.br) ou contato direto por WhatsApp —, assegurando o consentimento expresso do cliente e prevenindo a utilização indevida de seu cadastro.');
  
  renderGrid([
    ['DATA DA RETIRADA', formatDate(getValue('dret')), 1.2],
    ['HORA', getValue('hret'), 0.8],
    ['LOCAL / DOCA (CD ALÇA VIÁRIA)', getValue('local'), 2]
  ]);
  y += 1.8 * scaleFactor;

  renderBar('5. DA FUNDAMENTAÇÃO LEGAL E DA ASSINATURA ELETRÔNICA (GOV.BR)');
  y += 0.8 * scaleFactor;
  renderParagraph('a) A circulação e o transporte da mercadoria estão acobertados pela NF-e e pelo respectivo DANFE (Ajuste SINIEF nº 07/2005 e RICMS/PA).', 8.5, 1.0);
  renderParagraph('b) A autorização configura mandato do cliente ao representante para retirada e entrega, nos termos dos arts. 653 e seguintes da Lei nº 10.406/2002 (Código Civil).', 8.5, 1.0);
  renderParagraph('c) A confirmação por assinatura eletrônica avançada gov.br tem validade jurídica (Lei nº 14.063/2020), é verificável em validar.iti.gov.br e consta somente na via digital; a via impressa é cópia para arquivo.', 8.5, 1.8);

  renderBar('6. DAS RESPONSABILIDADES E DA VALIDADE');
  y += 0.8 * scaleFactor;
  renderParagraph('a) A Distribuidora São Paulo somente libera a retirada mediante este termo confirmado pelo cliente (gov.br ou WhatsApp), prevenindo utilização indevida de cadastro.', 8.5, 1.0);
  renderParagraph('b) Efetuada a retirada, o representante assume a guarda e o transporte, respondendo por avarias e extravio até a entrega ao cliente destinatário.', 8.5, 1.0);
  renderParagraph('c) Autorização específica para a NF-e, o representante e o cliente aqui identificados, restrita à data e hora da retirada; produz efeitos após a confirmação do cliente (gov.br ou WhatsApp).', 8.5, 1.8);

  renderBar('CONFIRMAÇÃO DO CLIENTE (TITULAR DA NF-e)');
  y += 0.8 * scaleFactor;
  renderParagraph('Opção 1 — Assinatura eletrônica gov.br', 9.2, 1.0, 'bold', COLOR_NAVY);

  // --- ESPAÇO RESERVADO PARA ASSINATURA GOV.BR ---
  // Ajustado dinamicamente para 18mm para garantir visualização limpa sem estourar página
  const govBoxHeight = 18 * scaleFactor;
  checkOverflow(govBoxHeight + 2);
  doc.setDrawColor(...COLOR_GRAY);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.rect(M, y + 0.5 * scaleFactor, CW, govBoxHeight);
  doc.setLineDashPattern([], 0);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.2 * scaleFactor);
  doc.setTextColor(...COLOR_GRAY);
  doc.text('Espaço reservado para a assinatura eletrônica gov.br do CLIENTE (titular da NF-e)', W / 2, y + (govBoxHeight / 2) + 0.5, { align: 'center' });
  y += govBoxHeight + 2.5 * scaleFactor;

  renderParagraph('Validade jurídica (Lei nº 14.063/2020) · autenticidade em validar.iti.gov.br · assinatura apenas na via digital.', 7.4, 1.5, 'normal', COLOR_GRAY);
  renderParagraph('Opção 2 — Confirmação direta por WhatsApp (sem gov.br)', 9.2, 1.0, 'bold', COLOR_NAVY);
  renderParagraph('A Distribuidora São Paulo contata o cliente pelo WhatsApp cadastrado, que confirma as informações deste termo.', 8.5, 1.5);

  renderGrid([
    ['WHATSAPP / CONTATO DO CADASTRO', getValue('zap'), 1.4],
    ['DATA / HORA DA CONFIRMAÇÃO', formatDate(getValue('zapdh'))]
  ]);

  // --- BLOCO DE ASSINATURAS MANUAIS ---
  y += 12 * scaleFactor; // Espaçamento dinâmico proporcional ao invés de fixo para prevenir estouro
  checkOverflow(12);

  const colWidth = (CW - 10) / 2;
  doc.setDrawColor(...COLOR_NAVY);
  doc.setLineWidth(0.3);

  const signBlocks = [
    [M, 'DISTRIBUIDORA SÃO PAULO — EXPEDIÇÃO / RETIRADA', 'Assinatura posterior na via impressa, se necessária'],
    [M + colWidth + 10, 'REPRESENTANTE RETIRANTE', 'Assinatura por extenso · nome legível (sem rubrica)']
  ];

  signBlocks.forEach(([x, title, subtitle]) => {
    doc.line(x, y, x + colWidth, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8 * scaleFactor);
    doc.setTextColor(...COLOR_NAVY);
    doc.text(title, x + colWidth / 2, y + 3.5 * scaleFactor, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5 * scaleFactor);
    doc.setTextColor(...COLOR_GRAY);
    doc.text(subtitle, x + colWidth / 2, y + 7.0 * scaleFactor, { align: 'center' });
  });

  // --- RODAPÉ FIXO ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLOR_ORANGE);
    doc.setLineWidth(0.4);
    doc.line(M, 283, W - M, 283);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.0);
    doc.setTextColor(...COLOR_GRAY);
    doc.text('Distribuidora São Paulo · CNPJ 13.424.484/0001-48 · CD Alça Viária — Marituba/PA', M, 287);
    doc.text(`Autorização de retirada confirmada pelo cliente (gov.br ou WhatsApp).   ${i}/${totalPages}`, W - M, 287, { align: 'right' });
  }

  return doc;
}

function buildAutoFitPDF(logoBase64) {
  // Tenta gerar a partir de uma escala maior (1.15 -> 115% do tamanho padrão) até 0.60
  for (let k = 1.15; k >= 0.60; k -= 0.01) {
    const pdfDoc = buildPDF(k, logoBase64);
    if (pdfDoc.getNumberOfPages() === 1) return pdfDoc;
  }
  return buildPDF(0.60, logoBase64);
}
/* ==========================================================================
   6. INICIALIZAÇÃO E EVENTOS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderForm();
  attachInputEvents();
  resetForm();

  $('clr').onclick = resetForm;

  $('go').onclick = async () => {
    const statusEl = $('st');
    statusEl.style.color = '';

    if (!validateForm()) {
      statusEl.style.color = 'var(--err)';
      statusEl.textContent = 'Corrija os campos destacados.';
      return;
    }

    try {
      statusEl.textContent = 'Gerando PDF...';

      let logoBase64 = null;
      try {
        logoBase64 = await getBase64ImageFromUrl('assets/logo.png');
      } catch (e) {
        console.warn('Não foi possível carregar a imagem assets/logo.png. Gerando sem logo.', e);
      }

      const pdfDoc = buildAutoFitPDF(logoBase64);
      const cleanPedido = getValue('pedido').replace(/[^\w-]+/g, '_');
      const filename = `Termo_Retirada_Pedido_${cleanPedido}.pdf`;

      let downloadsAPI = null;
      try {
        if (typeof claude !== 'undefined' && claude.use) {
          downloadsAPI = await claude.use('downloads');
        }
      } catch (e) {}

      if (downloadsAPI) {
        await downloadsAPI.save({
          filename: filename,
          data: pdfDoc.output('blob')
        });
        statusEl.style.color = 'var(--ok)';
        statusEl.textContent = 'PDF gerado. Agora é só assinar no gov.br.';
      } else {
        pdfDoc.save(filename);
        statusEl.style.color = 'var(--ok)';
        statusEl.textContent = 'PDF gerado com sucesso!';
      }
    } catch (err) {
      statusEl.style.color = 'var(--err)';
      statusEl.textContent = (err && err.code === 'declined')
        ? 'Download cancelado.'
        : `Não foi possível gerar o PDF: ${err.message || err}`;
    }
  };
});