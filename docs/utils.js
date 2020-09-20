/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
const getParams = function (url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

const copy = function (id, parentId) {
  const textToCopy = document.getElementById(id).innerHTML;

  var myTemporaryInputElement = document.createElement('input');
  myTemporaryInputElement.type = 'text';
  myTemporaryInputElement.value = textToCopy;

  document.body.appendChild(myTemporaryInputElement);

  myTemporaryInputElement.select();
  document.execCommand('Copy');

  document.body.removeChild(myTemporaryInputElement);

  const badge = document.querySelectorAll(`#${parentId} .badge`)[0];

  badge.classList.remove('badge-info');
  badge.classList.add('badge-success');
  const oldText = badge.innerHTML;
  badge.innerHTML = 'Copied to clipboard!';

  setTimeout(() => {
    badge.classList.remove('badge-success');
    badge.classList.add('badge-info');
    badge.innerHTML = oldText;
  }, 2000);
};
