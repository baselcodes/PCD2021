console.log('hello from content');
let myp5 = new p5(drone)
///~~~ AND THIS IN THE CONTENT SCRIPT ~~~///

/**
 * Listener waiting for messages coming from the background script
 * @param {*} request 
 * @param {*} sender 
 * @param {*} send_response 
 */
browser.runtime.onMessage.addListener(
    (request, sender, send_response) => {
        console.log('message');
        console.log(request)
        myp5.percussion()
        send_response({ res: 'item received from content script' })
    }
)


