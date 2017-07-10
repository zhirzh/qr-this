const LOADING = Symbol('loading');
const READY = Symbol('ready');

const options = {
  size: 500,
  quality: {
    low: 'L',
    medium: 'M',
    quartile: 'Q',
    high: 'H',
  },
};

const qrSizeRanges = [];
for (let i = 0; i <= 500; i += 50) {
  qrSizeRanges.push(i);
}

const MAX_LENGTH = 1500;
const MIN_LENGTH = 0;

const MAX_SIZE = 500;
const MIN_SIZE = 50;

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

    const [location] = await executeScript('window.location.href');
    const [selection] = await executeScript('window.getSelection().toString()');

    const text = selection.length > 0 ? selection : location;
    if (text.length > MAX_LENGTH) {
      throw Error('text.length > MAX_LENGTH');
    }

    const size = qrSizeRanges.find(
      size => size > (
        MIN_SIZE
        +
        (MAX_SIZE - MIN_SIZE) * Math.log1p(text.length) / Math.log1p(MAX_LENGTH)
      )
    );

    const query = {
      cht: 'qr',
      choe: 'UTF-8',
      chs: size + 'x' + size,
      chld: options.quality.high,
      chl: text,
    };

    const queryString = Object.keys(query).map(k => `${k}=${query[k]}`).join('&');

    qr.onload = () => toggleStatus(READY);
    qr.src = 'https://chart.googleapis.com/chart?' + queryString;
  } catch (err) {
    document.body.innerHTML = '&times;';
    document.body.classList.add('error');
    console.error(err);
  }
}());
