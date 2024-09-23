const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');


const requestHandler = (req, res) => {
  const { url, method } = req;


  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Bem-vindo à Página Inicial</h1>');
    res.end();
  }
  
 
  else if (url === '/sobre' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Sobre</h1><p>Esta é a página sobre.</p>');
    res.end();
  }
  
  
  else if (url === '/enviar-dados' && method === 'POST') {
    let body = '';

    
    req.on('data', chunk => {
      body += chunk.toString(); 
    });

    
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`<h1>Dados recebidos com sucesso!</h1><p>${body}</p>`);
      res.end();
    });
  }

  
  else if (url === '/upload' && method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = './uploads';
    form.keepExtensions = true;

    
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write('<h1>Erro no upload do arquivo.</h1>');
        res.end();
        return;
      }

     
      const oldPath = files.file.path;
      const newPath = path.join(form.uploadDir, files.file.name);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.write('<h1>Erro ao mover o arquivo.</h1>');
          res.end();
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Upload realizado com sucesso!</h1>');
        res.end();
      });
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h1>404 - Página não encontrada</h1>');
    res.end();
  }
};


const server = http.createServer(requestHandler);


const PORT = 3000;


server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
