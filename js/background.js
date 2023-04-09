var appjs = ['js/app.js'];
// background.js
chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == 'devtools');
    port.onMessage.addListener(function (message) {
        console.log('收到来自devtools的消息：', message);
        port.postMessage({ greeting: '你好，content-script！' });
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request); // 打印收到的消息
    // 处理消息
    if (request.type == 'exec') {
        executeContentScript(sender.tab.id, 0);
    }
    sendResponse(`background-返回给content的msg-${sender.tab.id}`); // 可以向 content.js 发送回复消息
});

function executeContentScript(id, index) {
    chrome.tabs.executeScript(id, { file: appjs[index] });
}
