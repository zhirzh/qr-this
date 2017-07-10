const LOADING = Symbol('loading');
const READY = Symbol('ready');

function executeScript(code) {
  return new Promise((res, rej) => {
    try {
      chrome.tabs.executeScript(
        null,
        { code },
        res,
      );
    } catch (err) {
      rej(err);
    }
  });
}

function toggleStatus(status) {
  switch (status) {
    case LOADING:
      gear.classList.remove('hidden');
      qr.classList.add('hidden');
      return;

    case READY:
      gear.classList.add('hidden');
      qr.classList.remove('hidden');
      return;

    default:
      console.error('incorrect `isLoading`');
      alert('ERROR!');
  }
}

(async function main() {
  try {
    toggleStatus(LOADING);

    const options = {
      size: 500,
      quality: {
        low: 'L',
        medium: 'M',
        quartile: 'Q',
        high: 'H',
      },
    };

    const [location] = await executeScript('window.location.href');
    const [selection] = await executeScript('window.getSelection().toString()');

    const query = {
      cht: 'qr',
      choe: 'UTF-8',
      chs: `${options.size}x${options.size}`,
      chld: options.quality.high,
      chl: selection.length > 0 ? selection : location,
    };

    const queryString = Object.keys(query).map(k => `${k}=${query[k]}`).join('&');

    qr.onload = () => toggleStatus(READY);
    qr.src = `https://chart.googleapis.com/chart?${queryString}`;
  } catch (err) {
    document.body.innerHTML = '&times;';
    document.body.classList.add('error');
    console.error(err);
  }
}());
