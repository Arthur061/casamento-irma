function formatField(id, value) {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function calculateCRC16(payload) {
  const polynomial = 0x1021;
  let crc = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    crc ^= (payload.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function normalizeKey(chave) {
  if (chave.includes('@')) {
    return chave.trim().toLowerCase();
  }
  // Mantém apenas números e o sinal de +
  return chave.replace(/[^\d+]/g, '');
}

export function generatePix({ chave, nome, cidade, valor, txid = '***' }) {
  const chaveTratada = normalizeKey(chave);
  const nomeTratado = nome.substring(0, 25).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const cidadeTratada = cidade.substring(0, 15).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const valorString = valor.toFixed(2);
  
  let payload = 
    formatField('00', '01') +
    formatField('26',
      formatField('00', 'br.gov.bcb.pix') + 
      formatField('01', chaveTratada)
    ) +
    formatField('52', '0000') +
    formatField('53', '986') +
    formatField('54', valorString) +
    formatField('58', 'BR') +
    formatField('59', nomeTratado) +
    formatField('60', cidadeTratada) +
    formatField('62',
      formatField('05', txid)
    ) +
    '6304';

  payload += calculateCRC16(payload);

  return payload;
}