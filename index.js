const start = () => {
  
  while(true){ /* O while com o switch é uma boa opção pra construção de menu */
    let opcao = 'cadastrar';
    switch (opcao) {
      case 'cadastrar':
        console.log('vamos cadastrar'); 
        break;
      case 'listar':
        console.log('vamos listar');
        break;
      case 'sair':
        return
    }
  }
}

start();