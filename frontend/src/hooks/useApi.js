import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farmacia_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ── AUTH ──
export const loginApi = (username, senha) =>
  api.post('/auth/login', { username, senha }).then(r => r.data);

export const logoutApi = () =>
  api.post('/auth/logout').then(r => r.data);

export const registrarUsuarioApi = (username, senha) =>
  api.post('/auth/registrar', { username, senha }).then(r => r.data);

// ── GET ──
export const getMedicamentos = () => api.get('/medicamentos').then(r => r.data);
export const getClientes     = () => api.get('/clientes').then(r => r.data);
export const getVendas       = () => api.get('/vendas').then(r => r.data);

// ── POST ──
export const postMedicamento = (dados) =>
  api.post('/medicamentos', dados).then(r => r.data);

export const postCliente = (dados) =>
  api.post('/clientes', dados).then(r => r.data);

export const postVenda = (idCliente, idMedicamento, quantidade) =>
  api.post('/vendas', null, {
    params: { idCliente, idMedicamento, quantidade }
  }).then(r => r.data);

// ── DELETE ──
export const deleteMedicamento = (id) => api.delete(`/medicamentos/${id}`);
export const deleteCliente     = (id) => api.delete(`/clientes/${id}`);

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
