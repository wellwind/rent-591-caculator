function caculate_loan_price() {
  $('#loan_price').val(parseFloat($('#expected_buy_price').val()) * 0.8);
  caculate_first_price();
  caculate_loan_rate_price();
}

function caculate_first_price() {
  $('#first_price').val(
    parseFloat($('#expected_buy_price').val())
    - parseFloat($('#loan_price').val())
  );
}

function caculate_loan_rate_price() {
  $('#loan_rate_price').val(
    parseFloat($('#loan_price').val()) * parseFloat($('#loan_rate').val()) / 100
  );
}

function caculate_decorate_total_cost() {
  $('#decorate_total_cost').val(
    parseFloat($('#house_count').val())
    * parseFloat($('#decorate_cost').val())
  );
}

function caculate_payback() {
  let a = parseFloat($('#expected_buy_price').val());
  let b = parseFloat($('#first_price').val());
  let c = parseFloat($('#loan_rate_price').val());
  let d = parseFloat($('#house_count').val());
  let e = parseFloat($('#rent_year_income').val());
  let f = parseFloat($('#decorate_cost').val());
  let o = parseFloat($('#other_price').val());
  console.log(a, b, c, d, e, f, o);
  $('#total_payback').val((e * 100) / (a + o + f));
  $('#self_payback').val(((e - c) * 100) / (b + o + f));
}

function renderCaculatorData(pageInfo) {
  document.querySelector('#house_name').innerHTML = pageInfo.houseName;
  document.querySelector('#price').innerHTML = pageInfo.price;
  document.querySelector('#age').innerHTML = pageInfo.age;
  document.querySelector('#structure').innerHTML = pageInfo.structure;
  document.querySelector('#floor').innerHTML = pageInfo.floor;
  document.querySelector('#pings').innerHTML = pageInfo.pings;
  document.querySelector('#ping_price').innerHTML = pageInfo.pingPrice;

  $('#house_count').val(parseInt((parseFloat(pageInfo.pings.replace('坪', '')) - 1) / 5, 0));
  $('#rent_year_income').val(parseInt($('#house_count').val(), 0) * 1.2 * 12);
  caculate_decorate_total_cost();

  $('#expected_buy_price').val(pageInfo.price.replace('萬元', ''));
  caculate_loan_price();
  caculate_payback();
}

$(document).ready(() => {
  $('#expected_buy_price').change(() => {
    caculate_loan_price();
  });

  $('#loan_price').change(() => {
    caculate_first_price();
    caculate_loan_rate_price();
  });

  $('#loan_rate').change(() => {
    caculate_loan_rate_price();
  });

  $('#house_count').change(() => {
    caculate_decorate_total_cost();
  });

  $('#decorate_cost').change(() => {
    caculate_decorate_total_cost();
  });

  $('input').change(() => {
    caculate_payback();
  });
});


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