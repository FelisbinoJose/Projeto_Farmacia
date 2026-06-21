import axios from 'axios';

const BASE = 'http://localhost:8080/api';

// ── GET ──
export const getMedicamentos = () => axios.get(`${BASE}/medicamentos`).then(r => r.data);
export const getClientes     = () => axios.get(`${BASE}/clientes`).then(r => r.data);
export const getVendas       = () => axios.get(`${BASE}/vendas`).then(r => r.data);

// ── POST ──
export const postMedicamento = (dados) =>
  axios.post(`${BASE}/medicamentos`, dados).then(r => r.data);

export const postCliente = (dados) =>
  axios.post(`${BASE}/clientes`, dados).then(r => r.data);

export const postVenda = (idCliente, idMedicamento, quantidade) =>
  axios.post(`${BASE}/vendas`, null, {
    params: { idCliente, idMedicamento, quantidade }
  }).then(r => r.data);

// ── DELETE ──
export const deleteMedicamento = (id) => axios.delete(`${BASE}/medicamentos/${id}`);
export const deleteCliente     = (id) => axios.delete(`${BASE}/clientes/${id}`);

// ── Helpers UI ──
export function getEmoji(nome = '', classificacao = '') {
  if (classificacao === 'CONTROLADO') return '⚠️';
  const n = nome.toLowerCase();
  if (n.includes('vitamin') || n.includes('suplemento') || n.includes('omega')) return '🌿';
  if (n.includes('antibi')  || n.includes('amoxicil')   || n.includes('ciprofl')) return '🧬';
  if (n.includes('creme')   || n.includes('pomada')     || n.includes('derm'))    return '🧴';
  if (n.includes('analg')   || n.includes('paracet')    || n.includes('ibupro')   || n.includes('dipiro')) return '🩹';
  if (n.includes('xarope')  || n.includes('tosse')      || n.includes('gripe'))   return '🤧';
  return '💊';
}

const UTILIDADES = {
  paracetamol: 'Analgésico e antitérmico. Alivia dores leves a moderadas e reduz a febre.',
  ibuprofeno:  'Anti-inflamatório. Indicado para dores, febre e inflamações.',
  amoxicilina: 'Antibiótico de amplo espectro. Trata infecções bacterianas diversas.',
  dipirona:    'Analgésico e antitérmico de rápida ação.',
  loratadina:  'Antialérgico. Alivia rinite, urticária e alergias.',
  vitamina:    'Suplemento vitamínico. Repõe nutrientes essenciais.',
  omega:       'Auxilia na saúde cardiovascular e cognitiva.',
};

export function getUtilidade(med) {
  if (med.utilidade) return med.utilidade;
  const n = (med.nomeComercial || '').toLowerCase();
  for (const [k, v] of Object.entries(UTILIDADES)) {
    if (n.includes(k)) return v;
  }
  return 'Uso conforme orientação do farmacêutico ou médico.';
}

export function formatarData(d) {
  if (!d) return '—';
  try {
    const dt = new Date(d);
    dt.setDate(dt.getDate() + 1);
    return dt.toLocaleDateString('pt-BR');
  } catch { return d; }
}

export function formatarPreco(v) {
  return 'R$ ' + Number(v).toFixed(2).replace('.', ',');
}
