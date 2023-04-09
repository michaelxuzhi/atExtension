console.log('这是content script!');

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    // 注入自定义JS
    injectCustomJs();
    injectCustomJs('./js/app.js');
    initCustomPanel();
    initCustomEventListen();
});

// 加入消息监听
window.addEventListener(
    'message',
    function (e) {
        console.log('收到消息：', e.data);
        if (e.data && e.data.cmd == 'invoke') {
            eval('(' + e.data.code + ')');
        } else if (e.data && e.data.cmd == 'message') {
            tip(e.data.data);
        }
    },
    false
);

// 向页面注入JS
function injectCustomJs(jp = '') {
    let jsPath = jp || './js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.runtime.getURL(jsPath);
    // temp.src = 'chrome-extension://lojombaocanmlckggfpogajenjndicfl/js/inject.js';
    console.log(temp.src);
    document.body.appendChild(temp);
    // temp.onload = function () {
    //     // 放在页面不好看，执行完后移除掉
    //     this.parentNode.removeChild(this);
    // };
}

// 向页面注入html
function initCustomPanel() {
    var panel = document.createElement('div');
    // panel.id = 'app';
    panel.className = 'chrome-plugin-demo-panel';
    panel.innerHTML = `
		<h2>injected-script操作content-script演示区：</h2>
		<div class="btn-area" style="position:absolute;background-color:white">
            <div id="root" style="width:100%;hight:100%"></div>
			<a href="javascript:sendMessageToContentScriptByPostMessage('你好，我是普通页面！')">通过postMessage发送消息给content-script</a><br>
			<a href="javascript:sendMessageToContentScriptByEvent('你好啊！我是通过DOM事件发送的消息！')">通过DOM事件发送消息给content-script</a><br>
			<a href="javascript:invokeContentScript('sendMessageToBackground()')">发送消息到后台或者popup</a><br>
		</div>
		<div id="my_custom_log">
		</div>
	`;
    document.body.appendChild(panel);
    sendMessageToBackground();
}

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'FROM_DEVTOOLS') {
        console.log('Message received from devtools:');
        console.log(message.message);
    }
    console.log(message);
});

// cursor建议
// content-script.js
chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == 'content-script');
    port.onMessage.addListener(function (message) {
        console.log('收到来自content-script的消息：', message);
        port.postMessage({ greeting: '你好，devtools！' });
    });
    // 发送消息给后台
    chrome.runtime.sendMessage(
        { greeting: '你好，我是content-script呀，我主动发消息给后台！' },
        function (response) {
            console.log('收到来自后台的回复：', response);
        }
    );
});

// 主动发送消息给后台
// 要演示此功能，请打开控制台主动执行sendMessageToBackground()
function sendMessageToBackground(message) {
    chrome.runtime.sendMessage({
        type: 'exec',
    });
}

// 监听长连接
chrome.runtime.onConnect.addListener(function (port) {
    console.log(port);
    if (port.name == 'test-connect') {
        port.onMessage.addListener(function (msg) {
            console.log('收到长连接消息：', msg);
            tip('收到长连接消息：' + JSON.stringify(msg));
            if (msg.question == '你是谁啊？') port.postMessage({ answer: '我是你爸！' });
        });
    }
});

function initCustomEventListen() {
    var hiddenDiv = document.getElementById('myCustomEventDiv');
    if (!hiddenDiv) {
        hiddenDiv = document.createElement('div');
        hiddenDiv.style.display = 'none';
        hiddenDiv.id = 'myCustomEventDiv';
        document.body.appendChild(hiddenDiv);
    }
    hiddenDiv.addEventListener('myCustomEvent', function () {
        var eventData = document.getElementById('myCustomEventDiv').innerText;
        tip('收到自定义事件：' + eventData);
    });
}
