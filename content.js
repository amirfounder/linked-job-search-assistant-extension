const cleanup = () => {
  chrome.runtime.sendMessage({'action': 'close_tab'})
}

const httpRequest = (method, route, body) => {
  fetch('http://localhost:8082' + route, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  })
    .then(console.log)
    .catch(console.warn)
}

const sendRequest = (results) => {
  const body = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    url_params: Object.fromEntries(window.location.href.split('?')[1].split('&').map(e => e.split('='))),
    results,
  }
  console.log(body)
  httpRequest('POST', '/save-html', body)
}

const scrapePeopleSearchResults = () => {
  return Array.from(document.querySelectorAll('li.reusable-search__result-container'))
    .map(e => ({
      link: e.querySelectorAll('a')[1].href,
      name: e.querySelectorAll('a')[1].innerText.split('\n')[0],
      position: e.querySelector('div.entity-result__primary-subtitle, t-14 t-black t-normal').innerText
    }))
}

if (window.location.href.includes('linkedin.com/search/results/people')) {
  setTimeout(() => {
    const results = scrapePeopleSearchResults()
    sendRequest(results)
    setTimeout(() => {
      cleanup()
    }, 5000)
  }, 5000)
}

if (window.location.href.includes('linkedin.com/in/')) {
  console.log('coming soon.')
}
