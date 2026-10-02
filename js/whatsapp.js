/**
 * whatsapp.js — R.P.A Produções Eventos e Festas
 * Coleta dados do formulário, valida, monta mensagem e abre WhatsApp
 * Número: 5511940282493 (conforme info.txt)
 */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5511940282493';

  const form       = document.getElementById('orcamento-form');
  const submitBtn  = document.getElementById('submit-btn');
  const formError  = document.getElementById('form-error');

  if (!form) return;

  /* ── Validação de campo individual ─────────────────────── */
  function validateField(field) {
    const val = field.value.trim();
    if (field.hasAttribute('required') && !val) {
      field.classList.add('error');
      field.classList.remove('success');
      return false;
    }
    if (field.type === 'email' && val) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      field.classList.toggle('error', !ok);
      field.classList.toggle('success', ok);
      return ok;
    }
    field.classList.remove('error');
    if (val) field.classList.add('success');
    return true;
  }

  /* ── Feedback em tempo real ─────────────────────────────── */
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  /* ── Coleta de dados ────────────────────────────────────── */
  function getCheckedServices() {
    const checked = Array.from(form.querySelectorAll('input[name="servicos"]:checked'));
    return checked.length > 0
      ? checked.map(c => c.value).join(', ')
      : 'Não especificado';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  function formatTime(timeStr) {
    if (!timeStr) return '';
    return timeStr;
  }

  /* ── Monta a mensagem WhatsApp ──────────────────────────── */
  function buildMessage(data) {
    const lines = [
      'Olá, R.P.A Produções! Gostaria de solicitar um orçamento.',
      '',
      '*Dados do cliente*',
      `Nome: ${data.nome}`,
      `WhatsApp: ${data.whatsapp}`,
      data.email ? `E-mail: ${data.email}` : null,
      '',
      '*Informações do evento*',
      `Tipo de evento: ${data.tipoEvento}`,
      data.dataEvento ? `Data: ${formatDate(data.dataEvento)}` : null,
      data.horario    ? `Horário: ${formatTime(data.horario)}` : null,
      data.convidados ? `Convidados (aprox.): ${data.convidados}` : null,
      data.local      ? `Local: ${data.local}` : null,
      '',
      '*Serviços de interesse*',
      data.servicos,
      '',
      data.mensagem ? '*Detalhes adicionais*' : null,
      data.mensagem || null,
      '',
      'Gostaria de saber mais detalhes e receber um orçamento.',
    ];

    return lines.filter(l => l !== null).join('\n');
  }

  /* ── Submit ─────────────────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    formError.classList.add('hidden');
    formError.textContent = '';

    // Valida campos obrigatórios
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      formError.textContent = 'Por favor, preencha os campos obrigatórios antes de continuar.';
      formError.classList.remove('hidden');
      // Scroll até o primeiro erro
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Coleta dados
    const data = {
      nome:       document.getElementById('nome').value.trim(),
      whatsapp:   document.getElementById('whatsapp').value.trim(),
      email:      document.getElementById('email').value.trim(),
      tipoEvento: document.getElementById('tipo-evento').value,
      dataEvento: document.getElementById('data-evento').value,
      horario:    document.getElementById('horario').value,
      convidados: document.getElementById('convidados').value.trim(),
      local:      document.getElementById('local').value.trim(),
      servicos:   getCheckedServices(),
      mensagem:   document.getElementById('mensagem').value.trim(),
    };

    const message = buildMessage(data);
    const encoded = encodeURIComponent(message);
    const url     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    // Feedback visual no botão
    const originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="animate-pulse">📤 Abrindo WhatsApp...</span>`;

    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }, 600);
  });

})();
