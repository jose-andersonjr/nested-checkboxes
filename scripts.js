const configurarEstadoInserido = (elemento, estado) => { // Define o estado de um elemento
    if (estado === 'indeterminate') { // Se o estado for "indeterminado"
      elemento.indeterminate = true // o elemento receber o valor como "indeterminado"
    } else {
      elemento.indeterminate = false // 
      elemento.checked = estado // Elemento recebo o estado que foi passado como parâmetro
    }
  }
  
  const atualizarControlado = (elemento) => { // Atualizar os atributos dos filhos
    if (elemento.hasAttribute('data-children')) { //Se o elemento tiver o atributo data-children 
      let estado = elemento.checked // variável "estado" recebe o valor atual dos elemento
      elemento.getAttribute('data-children').split(' ').forEach(id => { //Separa os ids de cada filho e faz um laço para cada filho 
        let controlado = document.getElementById(id) //Pega o elemento filho em questão 
        configurarEstadoInserido(controlado, estado) // e define o estado dele para o mesmo estado do elemento pai
        atualizarControlado(controlado)
      })
    }
  }
  
  const atualizarControlador = (elemento) => { // Atualizar os atributos dos pais 
    if (elemento.hasAttribute('data-parent')) { //Se o elemento tiver o atributo data-parent
      let controlador = document.getElementById(elemento.getAttribute('data-parent')) // Pega o elemento pelo id, o id desse elemento é o conteúdo dentro de "data-parent"
      let estados = []
      let EstadoColetivo
      controlador.getAttribute('data-children').split(' ').every(id => { // Pega o elemento pai que tem o atributo "data-children", divide as palavras do id e usa cada id para fazer a manipulação adequada no seu respectivo filho
        let controlado = document.getElementById(id)
        let estado = controlado.indeterminate === true ? 'indeterminate' : controlado.checked // Se o estado do controlado for indterminado ele recebe indeterminado, senão ele recebe o estado atual do checkbox
        if (estados.length > 0 && estados.indexOf(estado) === -1) { 
          EstadoColetivo = 'indeterminate'// Se o estado não existir em nenhum item da lista, então o EstadoColetivo recebe "indeterminate"
          return false
        } else {
          estados.push(estado) //Se o estado exisitr, então a lista de estados vai receber esse estado
          return true
        }
      })
      EstadoColetivo = EstadoColetivo || estados[0] //Se o estado coletivo for verdadeiro, o EstadoColetivo recebe ele mesmo, se for falso, então o Estadocoletivo recebe o primeiro elemento da lista de estados
      configurarEstadoInserido(controlador, EstadoColetivo)
      atualizarControlador(controlador)
    }
  }
  
  document.querySelectorAll('.nested-multiselect').forEach(multiselect => {
    multiselect.querySelectorAll('input[type="checkbox"][data-children], input[type="checkbox"][data-parent]').forEach(input => {
      input.addEventListener('change', event => { // adiciona o EventListener de mudança para todos os elementos pais e filhos
        atualizarControlado(event.currentTarget)
        atualizarControlador(event.currentTarget)
      })
    })
  })