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
