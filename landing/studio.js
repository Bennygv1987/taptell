(() => {
  const screen = document.querySelector('#screen');
  const status = document.querySelector('#demo-status');
  const buttons = [...document.querySelectorAll('[data-template]')];
  function mount(button) {
    const host = document.createElement('div');
    screen.replaceChildren(host);
    screen.scrollTop = 0;
    status.textContent = '';
    buttons.forEach(item => item.setAttribute('aria-pressed',String(item === button)));
    FP.mount(host, FS_T.newFunnel(button.dataset.template), {
      live:false, scrollEl:screen,
      onSubmit(){status.textContent='Demo abgeschlossen. Deine Angaben wurden nicht versendet.';},
      onUrl(){status.textContent='Dieser Link gehört zur Demo.';}
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => mount(button)));
  mount(buttons[0]);
})();
