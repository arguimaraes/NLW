// Importa os módulos necessários para funcionamento adequado da aplicação
const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require('fs').promises

// Cria as principais variáveis globais a serem manipuladas ao longo do código
let mensagem = 'Bem vindo(a) ao App de Metas';
let metas

// Cria função para resgatar do arquivo JSON as metas cadastradas e suas respectivas situações e previne erro
const carregarMetas = async () => {
  try {
    const dados = await fs.readFile('metas.json', 'utf-8');
    metas = JSON.parse(dados);
  }
  catch(erro) {
    metas = [];
  }
}

// Cria função para alimentar o arquivo JSON, de forma adequada, com as metas após manipulação
const salvarMetas = async () => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
}

// Cria função que permite ao usuário cadastrar as metas que desejar e as insere no array metas 
const cadastrarMeta = async () => {
  const meta = await input({ message: 'Digite a meta:'})

  if(meta.length == 0) {
    mensagem = 'A meta não pode ser vazia.';
    return
  }

  metas.push(
    { value: meta, checked: false }
)

  mensagem = 'Meta cadastrada com sucesso!'
}

// Cria função que permite visualizar todas as metas e marcar/desmarcar as metas à medida que forem realizadas
const listarMetas = async () => {
  if(metas.length == 0) {
    mensagem = 'Não existem metas listadas. Por favor, cadastre uma ou mais metas.'
    return
  }

  const respostas = await checkbox({
    message: 'Use as setas para mudar de meta, o espaço para marcar/desmarcar e o Enter para finalizar essa etapa.',
    choices: [...metas],
    instructions: false
  })

  metas.forEach((m) => {
    m.checked = false
  })

  if(respostas.length == 0) {
    mensagem = 'Nenhuma meta selecionada';
    return
  }

  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta
    })

    meta.checked = true
  })

  mensagem = 'Meta(s) marcada(s) como concluída(s)';
}

// Cria função que permite visualizar as metas que foram marcadas como realizadas
const metasRealizadas = async () => {
  if(metas.length == 0) {
    mensagem = 'Não existem metas listadas. Por favor, cadastre uma ou mais metas.'
    return
  }

  const realizadas = metas.filter((meta) => {
    return meta.checked
  })

  if(realizadas.length == 0) {
    mensagem = 'Não existem metas realizadas!';
    return
  }

  await select({
    message: 'Metas realizadas: ' + realizadas.length,
    choices: [...realizadas]
  })
}

// Cria função que permite visualizar as metas que ainda não foram marcadas como realizadas (estão em aberto)
const metasAbertas = async () => {
  if(metas.length == 0) {
    mensagem = 'Não existem metas listadas. Por favor, cadastre uma ou mais metas.'
    return
  }

  const abertas = metas.filter((meta) => {
    return !meta.checked
  })

  if(abertas.length == 0) {
    mensagem = 'Todas as metas foram concluídas!';
    return
  }

  await select({
    message: 'Metas abertas: ' + abertas.length,
    choices: [...abertas]
  })
}

// Cria função que permite selecionar metas para serem removidas da lista
const removerMetas = async () => {
  if(metas.length == 0) {
    mensagem = 'Não existem metas listadas. Por favor, cadastre uma ou mais metas.'
    return
  }

  const metasDesmarcadas = metas.map((meta) => {
    return { value: meta.value, checked: false }
  })
  
  const metasARemover = await checkbox({
    message: 'Selecione metas para remover. (Use o espaço para marcar/desmarcar e o Enter para finalizar essa etapa).',
    choices: [...metasDesmarcadas],
    instructions: false
  })

  if(metasARemover.length == 0) {
    mensagem = 'Nenhuma meta foi removida.';
    return
  }

  metasARemover.forEach((metaARemover) => {
    metas = metas.filter((meta) => {
      return meta.value != metaARemover
    })
  })

  mensagem = 'Meta(s) removida(s) com sucesso!'
}

// Cria um sistema de mensagens para manter o console limpo e apenas com mensagens relevantes ao usuário
const mostrarMensagem = () => {
  console.clear();

  if(mensagem != '') {
    console.log('');
    console.log(mensagem);
    console.log('');
    mensagem = '';
  }
}

// Cria a aplicação principal
const start = async () => {
  
  await carregarMetas();
  
  // Cria um menu de opções que aguarda a decisão do usuário e efetua a função adequada à necessidade da escolha
  while(true){
    mostrarMensagem(); 
    await salvarMetas();

    const opcao = await select({
      message: 'Menu >',
      choices: [
        {
          name: 'Cadastrar meta',
          value: 'cadastrar'
        },
        {
          name: 'Listar metas',
          value: 'listar'
        },
        {
          name: 'Metas realizadas',
          value: 'realizadas'
        },
        {
          name: 'Metas abertas',
          value: 'abertas'
        },
        {
          name: 'Remover metas',
          value: 'remover'
        },
        {
          name: 'Sair',
          value: 'sair'
        }
      ]
    })


    switch (opcao) {
      case 'cadastrar':
        await cadastrarMeta();
        break;
      case 'listar':
        await listarMetas();
        break;
      case 'realizadas':
        await metasRealizadas();
        break;
      case 'abertas':
        await metasAbertas();
        break;
      case 'remover':
        await removerMetas();
        break;
      case 'sair':
        console.log('Até a próxima');
        return
    }
  }
}

// Inicia a aplicação carregando metas previamente cadastradas e abrindo o menu de opções
start();