<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agente de Tarefas</title>
  <style>
    body {
      background-color: black;
      color: limegreen;
      font-family: monospace;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    h1 {
      text-align: center;
      margin-bottom: 20px;
    }
    .container {
      background-color: #1a1a1a;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      width: 100%;
      max-width: 500px;
      box-sizing: border-box;
    }
    p {
      margin-top: 0;
      margin-bottom: 15px;
    }
    input[type="text"] {
      padding: 10px;
      font-size: 16px;
      border: 1px solid limegreen;
      background-color: #000;
      color: limegreen;
      width: calc(100% - 120px);
      box-sizing: border-box;
      margin-right: 10px;
    }
    button {
      padding: 10px 15px;
      font-size: 16px;
      background-color: limegreen;
      color: black;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #00e600;
    }
    #mensagem {
      margin-top: 20px;
      font-weight: bold;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Agente de Tarefas - Terminal</h1>

  <div class="container">
    <p>&gt; Digite uma tarefa:</p>
    <input type="text" id="tarefa" placeholder="Ex: tomar café" aria-label="Digite sua tarefa aqui">
    <button onclick="enviarTarefa()">Enviar</button>

    <div id="mensagem" aria-live="polite"></div>
  </div>

  <script>
    async function enviarTarefa() {
      const tarefaInput = document.getElementById("tarefa");
      const tarefa = tarefaInput.value.trim();
      const mensagem = document.getElementById("mensagem");

      if (tarefa === "") {
        mensagem.innerHTML = "&#10007; Por favor, digite uma tarefa.";
        mensagem.style.color = "orange";
        return;
      }

      mensagem.innerHTML = "Enviando...";
      mensagem.style.color = "yellow";

      try {
        // AQUI ESTÁ A CORREÇÃO PRINCIPAL: O URL DO WEBHOOK FOI AJUSTADO
        const resposta = await fetch("https://editor.jesue.site/webhook-test/agendan8n", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tarefa: tarefa })
        });

        // Se a requisição chegou ao servidor e obteve uma resposta (mesmo que de erro HTTP)
        if (resposta.ok) {
          mensagem.innerHTML = "&#10003; Tarefa recebida com sucesso!";
          mensagem.style.color = "lime";
          tarefaInput.value = "";
        } else {
          // A solicitação foi recebida, mas o servidor respondeu com um erro (Ex: 400, 404, 500)
          const erroTexto = await resposta.text();
          mensagem.innerHTML = `&#10007; Tarefa recebida, mas com erro no processamento: (${resposta.status} - ${erroTexto.substring(0, 100)}...)`;
          mensagem.style.color = "red";
          console.error("Erro do servidor:", resposta.status, erroTexto);
        }
      } catch (erro) {
        // A solicitação NÃO foi recebida pelo servidor (Ex: erro de rede, CORS, URL inválida)
        mensagem.innerHTML = "&#10007; A solicitação NÃO foi recebida pelo servidor. Verifique sua conexão ou a URL do webhook.";
        mensagem.style.color = "darkred";
        console.error("Erro na conexão ou requisição:", erro);
      }
    }
  </script>
</body>
</html>
