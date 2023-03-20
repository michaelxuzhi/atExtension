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
    // 第一种，失败
    // chrome.runtime.sendMessage(
    //     { greeting: data || '你好，我是devtool呀，我主动发消息给后台！' },
    //     function (response) {
    //         console.log('inject-收到', response);
    //     }
    // );
    // 第二种，失败
    // window.postMessage({ cmd: 'invoke', code: '这是devtool-sendMsg2Content' }, '*');
    // 第三种
    // chrome.devtools.inspectedWindow.eval(`console.log('这是devtool')`);
    chrome.devtools.inspectedWindow.eval(`globalFuc('realPannel咯')`);
}

// 加入消息监听
window.addEventListener(
    'message',
    function (e) {
        console.log('收到消息：', e.data);
        text.innerText = '收到消息-window.addeventlistener';
        // if (e.data && e.data.cmd == 'invoke') {
        //     eval('(' + e.data.code + ')');
        // } else if (e.data && e.data.cmd == 'message') {
        //     tip(e.data.data);
        // }
    },
    false
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(
    //     '收到来自 ' +
    //         (sender.tab
    //             ? 'content-script(' + sender.tab.url + ')'
    //             : 'popup或者background') +
    //         ' 的消息：',
    //     request
    // );
    // if (request.cmd == 'update_font_size') {
    //     var ele = document.createElement('style');
    //     ele.innerHTML = `* {font-size: ${request.size}px !important;}`;
    //     document.head.appendChild(ele);
    // } else {
    //     tip(JSON.stringify(request));
    //     sendResponse('我收到你的消息了：' + JSON.stringify(request));
    // }
    console.log('收到消息');
    text.innerText = '收到消息-runtime' + JSON.stringify(request);
});
