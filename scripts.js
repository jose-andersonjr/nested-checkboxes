const setInputState = (el, state) => {
    if (state === 'indeterminate') {
      el.indeterminate = true
    } else {
      el.indeterminate = false
      el.checked = state 
    }
  }
  
  const updateOwned = (el) => {
    if (el.hasAttribute('data-children')) {
      let state = el.checked
      el.getAttribute('data-children').split(' ').forEach(id => {
        let owned = document.getElementById(id)
        setInputState(owned, state)
        updateOwned(owned)
      })
    }
  }
  
  const updateOwner = (el) => {
    if (el.hasAttribute('data-parent')) {
      let owner = document.getElementById(el.getAttribute('data-parent'))
      let states = []
      let collectiveState
      owner.getAttribute('data-children').split(' ').every(id => {
        let owned = document.getElementById(id)
        let state = owned.indeterminate === true ? 'indeterminate' : owned.checked
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
      updateOwner(owner)
    }
  }
  
  document.querySelectorAll('.nested-multiselect').forEach(multiselect => {
    multiselect.querySelectorAll('input[type="checkbox"][data-children], input[type="checkbox"][data-parent]').forEach(input => {
      input.addEventListener('change', event => {
        updateOwned(event.currentTarget)
        updateOwner(event.currentTarget)
      })
    })
  })