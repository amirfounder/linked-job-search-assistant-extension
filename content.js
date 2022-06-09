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
  let url_params
  try {
    url_params = Object.fromEntries(window.location.href.split('?')?.at(1)?.split('&')?.map(e => e?.split('=')))
  } catch (err) {
    url_params = {}
  }
  const body = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    url_params,
    results,
  }
  console.log(body)
  httpRequest('POST', '/save-data', body)
}

const scrapePeopleSearchResults = () => {
  return Array.from(document.querySelectorAll('li.reusable-search__result-container'))
    .map(e => ({
      link: e?.querySelectorAll('a')[1]?.href,
      name: e?.querySelectorAll('a')[1]?.innerText?.split('\n')?.at(0),
      position: e?.querySelector('div.entity-result__primary-subtitle, t-14 t-black t-normal')?.innerText
    }))
}

if (window.location.href.includes('linkedin.com/search/results/people')) {
  setTimeout(() => {
    const results = scrapePeopleSearchResults()
    sendRequest(results)
    setTimeout(() => {
      cleanup()
    }, 10000)
  }, 5000)
}

const scrapePersonProfile = () => ({
  company: document.querySelector('a[href="#experience"]')?.innerText,
  education: document.querySelector('a[href="#education"]')?.innerText,
  profile_headlines: Array.from(
    document
    .querySelector('div.ph5, pb5')
    .querySelector('.mt2, .relative')
    .children[0]
    .children
  ).map(x => x?.innerText)
})

if (window.location.href.includes('linkedin.com/in/')) {
  setTimeout(() => {
    const results = scrapePersonProfile()
    sendRequest(results)
    setTimeout(() => {
      cleanup()
    }, 10000)
  }, 5000)
}
