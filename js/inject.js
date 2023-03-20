function getMe(data = '') {
    console.log('getMe from inject.js', data);
}

// 通过postMessage调用content-script
function invokeContentScript(code) {
    console.log('这是inject-invoke2Content');
    window.postMessage({ cmd: 'invoke', code: code }, '*');
}
// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data) {
    console.log('这是inject-sendMsg2Content');
    window.postMessage({ cmd: 'message', data: data }, '*');
}

// 通过DOM事件发送消息给content-script
(function () {
    console.log('这是inject-domEvent2content');
    var customEvent = document.createEvent('Event');
    customEvent.initEvent('myCustomEvent', true, true);
    // 通过事件发送消息给content-script
    function sendMessageToContentScriptByEvent(data) {
        data = data || '你好，我是injected-script!';
        var hiddenDiv = document.getElementById('myCustomEventDiv');
        hiddenDiv.innerText = data;
        hiddenDiv.dispatchEvent(customEvent);
    }
    window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;
})();
