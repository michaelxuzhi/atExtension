const BG = "background";
const POPUP = "popup";
const INJECT = "inject";
const CONTENT = "content";
const PANNEL = "pannel";


const Events = {
  BG_SEND_MSG : 'bg_send_msg',
  BG_SEND_WIZARD : 'bg_send_wizard',
  BG_REVC: 'bg_revc',

  CONTENT_GET_INJECT_RESULT: 'content_get_inject_result',
  CONTENT_SEND_MSG :'content_send_msg',
  CONTENT_SEND_WIZARD : 'content_send_wizard',
  CONTENT_RECV :'content_recv',

  INJECT_SEND_MSG: 'inject_send_msg',
  INJECT_SNED_WIZARD: 'inject_send_wizard',
  INJECT_RECV: 'inject_recv',

  PANNEL_SEND_MSG : 'pannel_send_msg',
  PANNEL_SEND_WIZARD: 'pannel_send_wizard',
  PANNEL_RECV: 'pannel_recv',
}

class Router{
  constructor(role){
    this.role = role;
    this.eventList = {};
  }
  initRouter(){
    switch (role){
      case BG:
        this.initBGMsgListener()
        break;
      case INJECT:
        this.initCommonMsgListener()
        break;
      case CONTENT:
        this.initCommonMsgListener()
        break;
      case PANNEL:
        this.initPannelMsgListener()
        break;
    }
  }

  initBGMsgListener(){
    // todo：bg消息监听
    chrome.runtime.onMessage.addEventListener(function(request, sender, sendResponse)
    {
      // content->bg 存储tabid
      let tabid = 0;
      if(sender.tab){
        tabid = sender.tab.id;
      }
      sendResponse('我是BG,这是回应');
      // 中转给xx模块-未知
    })
  }
  initCommonMsgListener(){
    // todo：inject/content消息监听
    // 监听postMessage形式,inject->content  content->inject
    window.addEventListener("message",function(msg){
      console.log("common消息接收模块",msg.data)
    })

    // 监听chrome.runtime.sendMeassage形式,bg->content
    chrome.runtime.onMessage.addEventListener(function(request,sender,sendResponse){
      sendResponse('我是common,这是回应');
    })
  }
  initPannelMsgListener(){
    // todo：devPannel消息监听
  }

  getEventPre(event){
    return event.split('_')[0];
  }

  regist(event, handler){
    if(this.getEventPre(event) != this.role){
      console.log(`${event} 注册失败-> ${this.role}`)
      return;
    }
    if(!(event in this.eventList)){
      this.eventList[event] = [];
    }
    this.eventList[event].push(handler);
    console.log(`${event}事件注册成功`,this.eventList);
  }

  remove(event, handler){
    if(!(event in this.eventList)){
      return
    }
    const idx = this.eventList[event].findIndex(ele=>ele == handler);
    if(idx == undefined){
      return
    }
    this.eventList[event].splice(idx,1);
    if(this.eventList[event].length == 0){
      delete this.eventList[event];
    }
  }

  // dispatch(data)=sendMsg(data)

  sendMsg(data){
    let origin = this.role;
    let target = data.target;
    let msg = data.msg;
    switch (origin){
      case BG:
        BGSendMsg(target,msg,tabid=0);
        break;
      case INJECT:
        InjectSendMsg(target,msg);
        break;
      case CONTENT:
        ContentSendMsg(target,msg);
        break;
      case PANNEL:
        PannelSendMsg(target,msg);
        break;
    }
  }

  BGSendMsg(target,msg){
    if(target == CONTENT){
      if(tabid == 0){
        console.log("tabid为空,不清楚需要发送给哪一个tab");
        return;
      }else{
        chrome.tabs.sendMessage(tabid,msg,function(response){
          console.log("BG收到content的回信:",response);
        })
        return;
      };
    }
    if(target == POPUP){
      console.log("暂无BG->popup逻辑");
      return;
    }
    if(target == PANNEL){
      chrome.runtime.sendMessage(msg,function(response){
        console.log('bg收到pannel的回信',response)
      })
    }
  }

  ContentSendMsg(target,msg){
    if(target == BG){
      chrome.runtime.sendMessage(msg,function(response){
        console.log('content收到bg的回信',response)
      })
      return;
    }
  }

  InjectSendMsg(target,msg){ // inject只能发给content
    if(target == CONTENT){
      window.postMessage(msg, '*')
      return;
    }
  }

  PannelSendMsg(target,msg){
    // todo：pannel向bg发消息
    if(target == BG){

    }
  }
}