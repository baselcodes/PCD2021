# Critical Debugging

### Software needed

1. [Firefox](https://www.mozilla.org/en-US/firefox/new/)
2. [Code Editor](https://code.visualstudio.com/)

### Libraries

1. [p5.Sound.js]()

### Reading the debugger

### building a web-extension

1. Explain what is a manifest

2. how to load a custom extension in firefox `about:debugging`

3. `hello content script`| `hello background script` how to debug your web-extension

4. p5.js on top of website

5. making a drone
   what we need:

   1. oscillators
   2. delays
   3. reverbs
   4. chorus
   5. distortion

6. listening for network messages with

   ```javascript
   browser.webRequest.onBeforeRequest.addListener(
     tamper_request_listener, // <== our callback
     { urls: ["<all_urls>"] },
     ["blocking", "requestBody"]
   );

   browser.webRequest.onBeforeSendHeaders.addListener(
     tamper_header_listener, // <== callback
     { urls: ["<all_urls>"] },
     ["requestHeaders", "blocking"]
   );

   function tamper_request_listener(e) {
     console.log("///~~~ raw request ~~~///");
     console.log(e);
     if (e.method === "POST") {
       if (!!e.requestBody.raw) {
         /**
          * solution to translate RAW bytes into readable JSON
          * Source of the solution found here:
          * https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
          */
         const raw_body = String.fromCharCode.apply(
           null,
           new Uint8Array(e.requestBody.raw[0].bytes)
         );
         const json = JSON.parse(raw_body);

         if (e.url.includes("log_event?")) {
           // do something with the JSON
           console.log(json);
         }
       }
     }
   }
   function tamper_header_listener(e) {
     if (e.url.includes("watchtime?")) {
       console.log("///~~~ watchtime ~~~///");
       const json = get_params_from_url(e.url);
       console.log(json);
       console.log("///~~~~~~~~~~~~///");
     }
   }

   /**
    * @param {String} url
    * @returns Object containig the parameters of the request
    */
   function get_params_from_url(url) {
     url = decodeURI(url);
     if (typeof url === "string") {
       let params = url.split("?");
       let eachParamsArr = params[1].split("&");
       let obj = {};
       if (eachParamsArr && eachParamsArr.length) {
         eachParamsArr.map((param) => {
           let keyValuePair = param.split("=");
           let key = keyValuePair[0];
           let value = keyValuePair[1];
           obj[key] = value;
         });
       }
       return obj;
     }
   }
   ```

7. message passing

   ```javascript
   ///~~~ THIS WILL SIT IN OUR BACKGROUND ~~~///

   /**
    * Send the raw message
    */

   function send_message(_id, _data) {
     browser.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
       // here we can connect to more browser tabs using a loop
       browser.tabs.sendMessage(
         tabs[0].id,
         { id: _id, data: _data },
         (response) => {
           console.log(response.res);
         }
       );
     });
   }

   ///~~~ AND THIS IN THE CONTENT SCRIPT ~~~///

   /**
    * Listener waiting for messages coming from the background script
    * @param {*} request
    * @param {*} sender
    * @param {*} send_response
    */
   browser.runtime.onMessage.addListener((request, sender, send_response) => {
     console.log(request);
     send_response({ res: "item received from content script" });
   });
   ```

### intercepting data

### make it sing
