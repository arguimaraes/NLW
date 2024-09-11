const { select, input, checkbox } = require('@inquirer/prompts') /* Essa sintaxe define que o programa irá importar o inquirer, ou seja, que o programa irá buscar dentro da pasta node_modules o @inquirer e dentro do @inquirer, a pasta prompts e de dentro dela ele vai extrair alguma coisa ("um código... uma função... que a gente vai usar daqui a pouco")*/
const fs = require('fs').promises

/* Palavras do professor sobre o que essa sintaxe informa/significa: O "require('@inquirer/prompts')" vai me devolver um objeto, de dentro do objeto eu quero apenas o "select" e o "input". */

let mensagem = 'Bem vindo(a) ao App de Metas';

/* let meta = {
  value: 'Tomar 3L de água por dia',
  checked: false
} 

Antes, eu definia a estrutura de cada meta que estava aqui, entretanto, ao criar o arquivo JSON de dados (metas.json), eu deixo definida a estrutura lá no arquivo json.
*/

let metas // Crio o array de metas

const carregarMetas = async () => {
  try {
    const dados = await fs.readFile('metas.json', 'utf-8');
    metas = JSON.parse(dados);
  }
  catch(erro) {
    metas = [];
  }
}

const salvarMetas = async () => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
}

const cadastrarMeta = async () => {
  const meta = await input({ message: 'Digite a meta:'})

  if(meta.length == 0) {
    mensagem = 'A meta não pode ser vazia.';
    return //Se você quisesse manter a pessoa presa nessa etapa, bastava digitar "return ((await)) cadastrarMeta()" para chamar a função novamente até que o usuário digite uma meta não vazia.
  }

  metas.push(
    { value: meta, checked: false }
)

  mensagem = 'Meta cadastrada com sucesso!'
}

const listarMetas = async () => {
  if(metas.length == 0) {
    mensagem = 'Não existem metas listadas. Por favor, cadastre uma ou mais metas.'
    return
  }

  const respostas = await checkbox({
    message: 'Use as setas para mudar de meta, o espaço para marcar/desmarcar e o Enter para finalizar essa etapa.',
    choices: [...metas], // As reticências significa Spread (espalhar) e serve para jogar tudo de um array dentro de outro
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
  /* forEach é um método associado a um array que possibilita executar uma função ~para cada~ elemento do array.
   "resposta", nesse caso, é o primeiro elemento do array que será tratado pela função*/

  mensagem = 'Meta(s) marcada(s) como concluída(s)';
}

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

const mostrarMensagem = () => {
  console.clear(); //Esse comando serve para limpar o console e deixar o programa mais limpo.

  if(mensagem != '') {
    console.log('');
    console.log(mensagem);
    console.log('');
    mensagem = '';
  }
}

const start = async () => { // O async é obrigatório por conta do await lá na linha 9
  
  await carregarMetas();
  
  while(true){
    mostrarMensagem(); //Chamando essa função aqui, o programa limpa o console sempre que o menu é mostrado, logo, mantendo o console limpo sempre.
    await salvarMetas();

    // O await, por sua vez, é usado para informar ao programa que, para o while ser ativado, ele deve ~aguardar~ o usuário selecionar algo (Essa seleção do usuário é possível graças ao select que a gente importou com o inquirer)
    const opcao = await select({
      message: 'Menu >',
      choices: [
        {
          name: 'Cadastrar meta', //O name é o que será apresentado ao usuário
          value: 'cadastrar' //O value é o valor que será passado para a variável opcao, que será usada no switch
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
    }) /* É obrigatória essa estrutura para esse tipo de select do inquirer, pois isso é pré-definido pela biblioteca. Cada biblioteca pode ser estudada para descobrirmos as estruturas necessárias.
    Neste caso, é essa estrutura a que se pede: com o "message: 'String_qualquer'," e o "choices: []", pois essa função espera um objeto que tenha exatamente essas propriedades. Além disso o choices tem que ser um array, que pode ser de objetos. */


    switch (opcao) {
      case 'cadastrar':
        await cadastrarMeta(); // Sempre que for chamar uma função assíncrona, é preciso colocar await na frente
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

start();