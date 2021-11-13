console.log('hello from the background');



///~~~ THIS WILL SIT IN OUR BACKGROUND ~~~///

/**
 * 
 * @param {String} _id 
 * @param {Object} _data 
 */
function send_message(_id, _data) {
  browser.tabs.query({ url: '*://*.youtube.com/*' }, tabs => {
    console.log(tabs);
    // here we can connect to more browser tabs using a loop
    browser.tabs.sendMessage(tabs[0].id, { id: _id, data: _data }, response => {
      console.log(response.res);
    });
  });
}
send_message('message', { value: Math.random() * 100 })




// browser.webRequest.onBeforeRequest.addListener(
//   tamper_request_listener, // <== our callback
//   { urls: ["<all_urls>"] },
//   ["blocking", "requestBody"]
// );

// browser.webRequest.onBeforeSendHeaders.addListener(
//   tamper_header_listener, // <== callback
//   { urls: ["<all_urls>"] },
//   ["requestHeaders", "blocking"]
// );

// function tamper_request_listener(e) {
//   console.log('///~~~ raw request ~~~///')
//   console.log(e)
//   if (e.method === 'POST') {
//     if (!!e.requestBody.raw) {
//       /**
//        * solution to translate RAW bytes into readable JSON
//        * Source of the solution found here:
//        * https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
//        */
//       const raw_body = String.fromCharCode.apply(null, new Uint8Array(e.requestBody.raw[0].bytes))
//       const json = JSON.parse(raw_body)


//       if (e.url.includes('log_event?')) {
//         // do something with the JSON
//         console.log(json)
//       }
//     }
//   }
// }
// function tamper_header_listener(e) {
//   if (e.url.includes('watchtime?')) {
//     console.log("///~~~ watchtime ~~~///")
//     const json = get_params_from_url(e.url)
//     console.log(json)
//     console.log('///~~~~~~~~~~~~///')
//   }
// }

// /**
//  * @param {String} url 
//  * @returns Object containig the parameters of the request
//  */
// function get_params_from_url(url) {
//   url = decodeURI(url);
//   if (typeof url === 'string') {
//     let params = url.split('?');
//     let eachParamsArr = params[1].split('&');
//     let obj = {};
//     if (eachParamsArr && eachParamsArr.length) {
//       eachParamsArr.map(param => {
//         let keyValuePair = param.split('=')
//         let key = keyValuePair[0];
//         let value = keyValuePair[1];
//         obj[key] = value;
//       })
//     }
//     return obj;
//   }
// }
