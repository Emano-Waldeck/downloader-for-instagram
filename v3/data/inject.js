'use strict';

const get = (url, e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const {target} = e;

  let title = '';
  try {
    title = target.closest('article').querySelector('header .notranslate').textContent;
  }
  catch (e) {}
  try {
    title = title || target.closest('article').querySelector('header span').textContent;
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
  try {
    title = title || document.querySelector('header h2').textContent;
  }
  catch (e) {}

  if (title) {
    title += ' - ' + target.textContent;
  }

  chrome.runtime.sendMessage({
    method: 'download',
    title,
    url
  });
};

const observer = new MutationObserver(mutations => {
  mutations.filter(m => m.attributeName === 'srcset' && m.type == 'attributes').forEach(m => {
    const img = m.target;
    if (img.alt && img.dwnld === undefined) {
      const div = document.createElement('div');
      const parent = img.parentNode.parentNode;
      img.dwnld = div;
      parent.appendChild(div);
      div.classList.add('dwnld');

      img.getAttribute('srcset').split(',').forEach(s => {
        const [url, size] = s.split(' ');
        const d = document.createElement('span');
        d.textContent = size;
        d.dataset.url = url;
        d.onclick = get.bind(undefined, url);

        div.appendChild(d);
      });
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  subtree: true
});
