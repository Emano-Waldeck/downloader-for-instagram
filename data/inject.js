'use strict';

var script = document.createElement('script');
script.textContent = `{
  var observer = new MutationObserver(mutations => {
    mutations
    .filter(m => m.attributeName === 'srcset' && m.type == 'attributes')
    .forEach(m => {
      const img = m.target;
      if (img.alt) {
        const div = document.createElement('div');
        img.parentNode.parentNode.appendChild(div);
        div.classList.add('dwnld');

        img.getAttribute('srcset').split(',').forEach(s => {
          const [url, size] = s.split(' ');
          const d = document.createElement('span');
          d.textContent = size;
          d.dataset.url = url;
          d.dataset.cmd = 'download';
          div.appendChild(d);
        });
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true
  });
}`;
document.documentElement.appendChild(script);

document.addEventListener('mouseover', ({target}) => {
  if (target.classList.contains('_mli86')) {
    const div = target.parentNode.querySelector('.dwnld');

    if (div) {
      div.dataset.visible = true;
      target.addEventListener('mouseout', () => {
        div.dataset.visible = false;
      });
    }
  }
});

document.addEventListener('click', e => {
  const {target} = e;
  const {cmd} = target.dataset;

  if (cmd === 'download') {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    let title = '';
    try {
      title = target.closest('article').querySelector('header .notranslate').textContent;
    }
    catch (e) {}
    try {
      title = title || target.closest('article').querySelector('header h1').textContent;
    }
    catch (e) {}
    try {
      title = title || target.closest('article').querySelector('header').textContent;
    }
    catch (e) {}

    if (title) {
      title += ' - ' + target.textContent;
    }

    chrome.runtime.sendMessage({
      method: 'download',
      title,
      url: target.dataset.url
    });
  }
});
