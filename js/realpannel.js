let btn1 = document.getElementById('btn1');
let btn2 = document.getElementById('btn2');
let btn3 = document.getElementById('btn3');
let text = document.getElementById('text');
let btnText = document.getElementById('btnText');

btn1.addEventListener('click', () => {
    console.log('点击了btn1');
    sendMessageToContentScriptByPostMessage();
    btnText.innerText = '点击了btn1';
});

btn2.addEventListener('click', () => {
    console.log('点击了btn2');
    btnText.innerText = '点击了btn2';
});

btn3.addEventListener('click', () => {
    console.log('点击了btn3');
    btnText.innerText = '点击了btn3';
});

// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data = 'devtool') {
    console.log('这是devtool-sendMsg2Content');
    // 第三种
    // chrome.devtools.inspectedWindow.eval(`console.log('这是devtool')`);
    chrome.devtools.inspectedWindow.eval(`globalFuc('realPannel咯')`);
    // cursor-建议
    // 在devtools.js中发送消息
    // chrome.runtime.sendMessage({
    //     type: 'FROM_DEVTOOLS',
    //     message: 'Hello from the devtools!',
    // });
}

// devtools中监听-接收消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // console.log('收到消息');
    if (message.type === 'FROM_CONTENT_SCRIPT') {
        console.log('Message received from content script:');
        console.log(message.message);
        text.innerText = '收到消息-runtime' + message.message;
    }
});

// devtools.js
// 和background建立长连接
var port = chrome.runtime.connect({ name: 'devtools' });
port.postMessage({ tabId: chrome.devtools.inspectedWindow.tabId });
port.onMessage.addListener(function (msg) {
    console.log('收到来自后台的消息：', msg);
});
