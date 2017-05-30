function renderCaculatorData(pageInfo) {
  document.querySelector('#house_name').innerHTML = pageInfo.houseName;
  document.querySelector('#price').innerHTML = pageInfo.price;
  document.querySelector('#age').innerHTML = pageInfo.age;
  document.querySelector('#structure').innerHTML = pageInfo.structure;
  document.querySelector('#floor').innerHTML = pageInfo.floor;
  document.querySelector('#pings').innerHTML = pageInfo.pings;
  document.querySelector('#ping_price').innerHTML = pageInfo.pingPrice;
}


chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getSource") {
    renderCaculatorData(request.pageInfo)
  }
});


document.addEventListener('DOMContentLoaded', function (dom) {
  function modifyDOM() {
    if (document.URL.indexOf('https://sale.591.com.tw/home/house/detail/') === 0) {
      chrome.runtime.sendMessage({
        action: "getSource",
        pageInfo: {
          houseName: document.querySelector('h1.detail-title-content').innerText,
          price: document.querySelector('div.info-price-left').innerText.replace('售價波動', ''),
          age: document.querySelectorAll('div.info-floor-key')[1].innerText,
          structure: document.querySelectorAll('div.info-floor-key')[0].innerText,
          floor: document.querySelector('span.info-addr-value').innerText,
          pings: document.querySelectorAll('div.info-floor-key')[2].innerText,
          pingPrice: document.querySelector('div.info-price-per').innerText.replace('單價：', ''),
        }
      });
    }
  }

  chrome.tabs.executeScript({
    code: '(' + modifyDOM + ')();'
  });
});
