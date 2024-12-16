const fs = require('fs');
const venom = require('venom-bot');
const express = require('express');
const app = express();

// Configurações de servidor
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos (ex: imagens)
app.use(express.static('public'));

// QR Code setup com Venom
venom
  .create(
    'sessionName',
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log(asciiQR);

      const matches = base64Qr.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return new Error('String base64 inválida');
      }

      const imageBuffer = new Buffer.from(matches[2], 'base64');
      fs.writeFile('public/out.png', imageBuffer, 'binary', (err) => {
        if (err) {
          console.error('Erro ao salvar o QR Code:', err);
        } else {
          console.log('QR Code salvo como out.png');
        }
      });
    },
    undefined,
    { logQR: false }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.error('Erro ao iniciar o Venom:', erro);
  });

// Função para iniciar o bot e responder mensagens
function start(client) {
  console.log('Venom-Bot iniciado e conectado!');

  client.onMessage((message) => {
    console.log('Mensagem recebida:', message.body);

    if (message.from === '5511912345678@c.us') { // Substitua pelo seu número
      client.sendText(message.from, 'Você enviou: ' + message.body);
    }
  });

  // Enviar mensagem para você mesmo como teste
  const myNumber = '551797493516@c.us'; // Substitua pelo seu número
  client
    .sendText(myNumber, 'Testando mensagem para meu próprio número.')
    .then(() => {
      console.log('Mensagem enviada com sucesso!');
    })
    .catch((err) => {
      console.error('Erro ao enviar mensagem:', err);
    });
}

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
