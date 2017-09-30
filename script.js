document.registerElement('game-system', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: { value: function () { return created(this); } }
  })
})

function created(element) {
  element.innerHTML = 'GAME SYSTEM JS, Yeah!'
}