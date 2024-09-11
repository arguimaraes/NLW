const { select, input, checkbox } = require('@inquirer/prompts') /* Essa sintaxe define que o programa irá importar o inquirer, ou seja, que o programa irá buscar dentro da pasta node_modules o @inquirer e dentro do @inquirer, a pasta prompts e de dentro dela ele vai extrair alguma coisa ("um código... uma função... que a gente vai usar daqui a pouco")*/ 

/* Palavras do professor sobre o que essa sintaxe informa/significa: O "require('@inquirer/prompts')" vai me devolver um objeto, de dentro do objeto eu quero apenas o "select" e o "input". */

let meta = { // Defino como será a estrutura do objeto meta
  value: 'Tomar 3L de água por dia',
  checked: false
}

let metas = [ meta ] // crio o array de metas

const cadastrarMeta = async () => {
  const meta = await input({ message: 'Digite a meta:'})

  if(meta.length == 0) {
    console.log('A meta não pode ser vazia.')
    return //Se você quisesse manter a pessoa presa nessa etapa, bastava digitar "return ((await)) cadastrarMeta()" para chamar a função novamente até que o usuário digite uma meta não vazia.
  }

  metas.push(
    { value: meta, checked: false }
)
}

const listarMetas = async () => {
  const respostas = await checkbox({
    message: 'Use as setas para mudar de meta, o espaço para marcar/desmarcar e o Enter para finalizar essa etapa.',
    choices: [...metas], // As reticências significa Spread (espalhar) e serve para jogar tudo de um array dentro de outro
    instructions: false
  })

  if(respostas.length == 0) {
    console.log('Nenhuma meta selecionada');
    return
  }

  metas.forEach((m) => {
    m.checked = false
  })

  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta
    })

    meta.checked = true
  })
  /* forEach é um método associado a um array que possibilita executar uma função ~para cada~ elemento do array.
   "resposta", nesse caso, é o primeiro elemento do array que será tratado pela função*/

  console.log('Meta(s) marcadas como concluída(s)');
}

const start = async () => { // O async é obrigatório por conta do await lá na linha 9
  
  while(true){

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
          name: 'Sair',
          value: 'sair'
        }
      ]
    }) /* É obrigatória essa estrutura para esse tipo de select do inquirer, pois isso é pré-definido pela biblioteca. Cada biblioteca pode ser estudada para descobrirmos as estruturas necessárias.
    Neste caso, é essa estrutura a que se pede: com o "message: 'String_qualquer'," e o "choices: []", pois essa função espera um objeto que tenha exatamente essas propriedades. Além disso o choices tem que ser um array, que pode ser de objetos. */


    switch (opcao) {
      case 'cadastrar':
        await cadastrarMeta(); //Sempre que for chamar uma função assíncrona, é preciso colocar await na frente
        console.log(metas);
        break;
      case 'listar':
        await listarMetas();
        break;
      case 'sair':
        console.log('Até a próxima');
        return
    }
  }
}

start();