const setInputState = (elemento, estado) => { // Define o estado de um elemento
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
        setInputState(controlado, estado) // e define o estado dele para o mesmo estado do elemento pai
        atualizarControlado(controlado)
      })
    }
  }
  
  const updateControlador = (elemento) => { // Atualizar os atributos dos pais 
    if (elemento.hasAttribute('data-parent')) { //Se o elemento tiver o atributo data-parent
      let owner = document.getElementById(elemento.getAttribute('data-parent')) // Pega o elemento pelo id, o id desse elemento é o conteúdo dentro de "data-parent"
      let states = []
      let collectiveState
      owner.getAttribute('data-children').split(' ').every(id => {
        let controlado = document.getElementById(id)
        let state = controlado.indeterminate === true ? 'indeterminate' : controlado.checked
        if (states.length > 0 && states.indexOf(state) === -1) {
          collectiveState = 'indeterminate'
          return false
        } else {
          states.push(state)
          return true
        }
      })
      collectiveState = collectiveState || states[0]
      setInputState(owner, collectiveState)
      updateControlador(owner)
    }
  }
  
  document.querySelectorAll('.nested-multiselect').forEach(multiselect => {
    multiselect.querySelectorAll('input[type="checkbox"][data-children], input[type="checkbox"][data-parent]').forEach(input => {
      input.addEventListener('change', event => {
        atualizarControlado(event.currentTarget)
        updateControlador(event.currentTarget)
      })
    })
  })