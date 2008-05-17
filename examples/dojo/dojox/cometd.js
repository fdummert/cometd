/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(!dojo._hasResource["dojo.AdapterRegistry"]){dojo._hasResource["dojo.AdapterRegistry"]=true;dojo.provide("dojo.AdapterRegistry");dojo.AdapterRegistry=function(_1){this.pairs=[];this.returnWrappers=_1||false;};dojo.extend(dojo.AdapterRegistry,{register:function(_2,_3,_4,_5,_6){this.pairs[((_6)?"unshift":"push")]([_2,_3,_4,_5]);},match:function(){for(var i=0;i<this.pairs.length;i++){var _8=this.pairs[i];if(_8[1].apply(this,arguments)){if((_8[3])||(this.returnWrappers)){return _8[2];}else{return _8[2].apply(this,arguments);}}}throw new Error("No match found");},unregister:function(_9){for(var i=0;i<this.pairs.length;i++){var _b=this.pairs[i];if(_b[0]==_9){this.pairs.splice(i,1);return true;}}return false;}});}if(!dojo._hasResource["dojo.io.script"]){dojo._hasResource["dojo.io.script"]=true;dojo.provide("dojo.io.script");dojo.io.script={get:function(_c){var _d=this._makeScriptDeferred(_c);var _e=_d.ioArgs;dojo._ioAddQueryToUrl(_e);this.attach(_e.id,_e.url,_c.frameDoc);dojo._ioWatch(_d,this._validCheck,this._ioCheck,this._resHandle);return _d;},attach:function(id,url,_11){var doc=(_11||dojo.doc);var _13=doc.createElement("script");_13.type="text/javascript";_13.src=url;_13.id=id;doc.getElementsByTagName("head")[0].appendChild(_13);},remove:function(id){dojo._destroyElement(dojo.byId(id));if(this["jsonp_"+id]){delete this["jsonp_"+id];}},_makeScriptDeferred:function(_15){var dfd=dojo._ioSetArgs(_15,this._deferredCancel,this._deferredOk,this._deferredError);var _17=dfd.ioArgs;_17.id=dojo._scopeName+"IoScript"+(this._counter++);_17.canDelete=false;if(_15.callbackParamName){_17.query=_17.query||"";if(_17.query.length>0){_17.query+="&";}_17.query+=_15.callbackParamName+"="+(_15.frameDoc?"parent.":"")+"dojo.io.script.jsonp_"+_17.id+"._jsonpCallback";_17.canDelete=true;dfd._jsonpCallback=this._jsonpCallback;this["jsonp_"+_17.id]=dfd;}return dfd;},_deferredCancel:function(dfd){dfd.canceled=true;if(dfd.ioArgs.canDelete){dojo.io.script._deadScripts.push(dfd.ioArgs.id);}},_deferredOk:function(dfd){if(dfd.ioArgs.canDelete){dojo.io.script._deadScripts.push(dfd.ioArgs.id);}if(dfd.ioArgs.json){return dfd.ioArgs.json;}else{return dfd.ioArgs;}},_deferredError:function(_1a,dfd){if(dfd.ioArgs.canDelete){if(_1a.dojoType=="timeout"){dojo.io.script.remove(dfd.ioArgs.id);}else{dojo.io.script._deadScripts.push(dfd.ioArgs.id);}}console.debug("dojo.io.script error",_1a);return _1a;},_deadScripts:[],_counter:1,_validCheck:function(dfd){var _1d=dojo.io.script;var _1e=_1d._deadScripts;if(_1e&&_1e.length>0){for(var i=0;i<_1e.length;i++){_1d.remove(_1e[i]);}dojo.io.script._deadScripts=[];}return true;},_ioCheck:function(dfd){if(dfd.ioArgs.json){return true;}var _21=dfd.ioArgs.args.checkString;if(_21&&eval("typeof("+_21+") != 'undefined'")){return true;}return false;},_resHandle:function(dfd){if(dojo.io.script._ioCheck(dfd)){dfd.callback(dfd);}else{dfd.errback(new Error("inconceivable dojo.io.script._resHandle error"));}},_jsonpCallback:function(_23){this.ioArgs.json=_23;}};}if(!dojo._hasResource["dojox.cometd._base"]){dojo._hasResource["dojox.cometd._base"]=true;dojo.provide("dojox.cometd._base");dojox.cometd=new function(){this.DISCONNECTED="DISCONNECTED";this.CONNECTING="CONNECTING";this.CONNECTED="CONNECTED";this.DISCONNECTING="DISCONNECING";this._initialized=false;this._connected=false;this._polling=false;this._handshook=false;this.expectedNetworkDelay=10000;this.connectTimeout=0;this.connectionTypes=new dojo.AdapterRegistry(true);this.version="1.0";this.minimumVersion="0.9";this.clientId=null;this.messageId=0;this.batch=0;this._isXD=false;this.handshakeReturn=null;this.currentTransport=null;this.url=null;this.lastMessage=null;this._messageQ=[];this.handleAs="json";this._advice={};this._backoffInterval=0;this._backoffIncrement=1000;this._backoffMax=60000;this._deferredSubscribes={};this._deferredUnsubscribes={};this._subscriptions=[];this._extendInList=[];this._extendOutList=[];this.state=function(){return this._initialized?(this._connected?"CONNECTED":"CONNECTING"):(this._connected?"DISCONNECTING":"DISCONNECTED");};this.init=function(_24,_25,_26){_25=_25||{};_25.version=this.version;_25.minimumVersion=this.minimumVersion;_25.channel="/meta/handshake";_25.id=""+this.messageId++;this.url=_24||dojo.config["cometdRoot"];if(!this.url){console.debug("no cometd root specified in djConfig and no root passed");return null;}var _27="^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";var _28=(""+window.location).match(new RegExp(_27));if(_28[4]){var tmp=_28[4].split(":");var _2a=tmp[0];var _2b=tmp[1]||"80";_28=this.url.match(new RegExp(_27));if(_28[4]){tmp=_28[4].split(":");var _2c=tmp[0];var _2d=tmp[1]||"80";this._isXD=((_2c!=_2a)||(_2d!=_2b));}}if(!this._isXD){_25.supportedConnectionTypes=dojo.map(this.connectionTypes.pairs,"return item[0]");}_25=this._extendOut(_25);var _2e={url:this.url,handleAs:this.handleAs,content:{"message":dojo.toJson([_25])},load:dojo.hitch(this,function(msg){this._backon();this._finishInit(msg);}),error:dojo.hitch(this,function(e){console.debug("handshake error!:",e);this._backoff();this._finishInit([{}]);}),timeoutSeconds:this.expectedNetworkDelay/1000,timeout:dojo.hitch(this,function(){console.debug("handshake timeout!");this._backoff();this._finishInit([{}]);})};if(_26){dojo.mixin(_2e,_26);}this._props=_25;for(var _31 in this._subscriptions){for(var sub in this._subscriptions[_31]){if(this._subscriptions[_31][sub].topic){dojo.unsubscribe(this._subscriptions[_31][sub].topic);}}}this._messageQ=[];this._subscriptions=[];this._initialized=true;this.batch=0;this.startBatch();var r;if(this._isXD){_2e.callbackParamName="jsonp";r=dojo.io.script.get(_2e);}else{r=dojo.xhrPost(_2e);}dojo.publish("/cometd/meta",[{cometd:this,action:"handshake",successful:true,state:this.state()}]);return r;};this.publish=function(_34,_35,_36){var _37={data:_35,channel:_34};if(_36){dojo.mixin(_37,_36);}this._sendMessage(_37);};this.subscribe=function(_38,_39,_3a,_3b){_3b=_3b||{};if(_39){var _3c="/cometd"+_38;var _3d=this._subscriptions[_3c];if(!_3d||_3d.length==0){_3d=[];_3b.channel="/meta/subscribe";_3b.subscription=_38;this._sendMessage(_3b);var _ds=this._deferredSubscribes;if(_ds[_38]){_ds[_38].cancel();delete _ds[_38];}_ds[_38]=new dojo.Deferred();}for(var i in _3d){if(_3d[i].objOrFunc===_39&&(!_3d[i].funcName&&!_3a||_3d[i].funcName==_3a)){return null;}}var _40=dojo.subscribe(_3c,_39,_3a);_3d.push({topic:_40,objOrFunc:_39,funcName:_3a});this._subscriptions[_3c]=_3d;}var ret=this._deferredSubscribes[_38]||{};ret.args=dojo._toArray(arguments);return ret;};this.unsubscribe=function(_42,_43,_44,_45){if((arguments.length==1)&&(!dojo.isString(_42))&&(_42.args)){return this.unsubscribe.apply(this,_42.args);}var _46="/cometd"+_42;var _47=this._subscriptions[_46];if(!_47||_47.length==0){return null;}var s=0;for(var i in _47){var sb=_47[i];if((!_43)||(sb.objOrFunc===_43&&(!sb.funcName&&!_44||sb.funcName==_44))){dojo.unsubscribe(_47[i].topic);delete _47[i];}else{s++;}}if(s==0){_45=_45||{};_45.channel="/meta/unsubscribe";_45.subscription=_42;delete this._subscriptions[_46];this._sendMessage(_45);this._deferredUnsubscribes[_42]=new dojo.Deferred();if(this._deferredSubscribes[_42]){this._deferredSubscribes[_42].cancel();delete this._deferredSubscribes[_42];}}return this._deferredUnsubscribes[_42];};this.disconnect=function(){for(var _4b in this._subscriptions){for(var sub in this._subscriptions[_4b]){if(this._subscriptions[_4b][sub].topic){dojo.unsubscribe(this._subscriptions[_4b][sub].topic);}}}this._subscriptions=[];this._messageQ=[];if(this._initialized&&this.currentTransport){this._initialized=false;this.currentTransport.disconnect();}if(!this._polling){this._connected=false;dojo.publish("/cometd/meta",[{cometd:this,action:"connect",successful:false,state:this.state()}]);}this._initialized=false;dojo.publish("/cometd/meta",[{cometd:this,action:"disconnect",successful:true,state:this.state()}]);};this.subscribed=function(_4d,_4e){};this.unsubscribed=function(_4f,_50){};this.tunnelInit=function(_51,_52){};this.tunnelCollapse=function(){};this._backoff=function(){if(!this._advice){this._advice={reconnect:"retry",interval:0};}else{if(!this._advice.interval){this._advice.interval=0;}}if(this._backoffInterval<this._backoffMax){this._backoffInterval+=this._backoffIncrement;}};this._backon=function(){this._backoffInterval=0;};this._interval=function(){var i=this._backoffInterval+(this._advice?(this._advice.interval?this._advice.interval:0):0);if(i>0){console.debug("Retry in interval+backoff="+this._advice.interval+"+"+this._backoffInterval+"="+i+"ms");}return i;};this._finishInit=function(_54){_54=_54[0];this.handshakeReturn=_54;if(_54["advice"]){this._advice=_54.advice;}var _55=_54.successful?_54.successful:false;if(_54.version<this.minimumVersion){console.debug("cometd protocol version mismatch. We wanted",this.minimumVersion,"but got",_54.version);_55=false;this._advice.reconnect="none";}if(_55){this.currentTransport=this.connectionTypes.match(_54.supportedConnectionTypes,_54.version,this._isXD);this.currentTransport._cometd=this;this.currentTransport.version=_54.version;this.clientId=_54.clientId;this.tunnelInit=dojo.hitch(this.currentTransport,"tunnelInit");this.tunnelCollapse=dojo.hitch(this.currentTransport,"tunnelCollapse");this.currentTransport.startup(_54);}dojo.publish("/cometd/meta",[{cometd:this,action:"handshake",successful:_55,reestablish:_55&&this._handshook,state:this.state()}]);if(_55){this._handshook=true;}else{console.debug("cometd init failed");if(this._advice&&this._advice["reconnect"]=="none"){console.debug("cometd reconnect: none");}else{setTimeout(dojo.hitch(this,"init",this.url,this._props),this._interval());}}};this._extendIn=function(_56){dojo.forEach(dojox.cometd._extendInList,function(f){_56=f(_56)||_56;});return _56;};this._extendOut=function(_58){dojo.forEach(dojox.cometd._extendOutList,function(f){_58=f(_58)||_58;});return _58;};this.deliver=function(_5a){dojo.forEach(_5a,this._deliver,this);return _5a;};this._deliver=function(_5b){_5b=this._extendIn(_5b);if(!_5b["channel"]){if(_5b["success"]!==true){console.debug("cometd error: no channel for message!",_5b);return;}}this.lastMessage=_5b;if(_5b.advice){this._advice=_5b.advice;}var _5c=null;if((_5b["channel"])&&(_5b.channel.length>5)&&(_5b.channel.substr(0,5)=="/meta")){switch(_5b.channel){case "/meta/connect":if(_5b.successful&&!this._connected){this._connected=this._initialized;this.endBatch();}else{if(!this._initialized){this._connected=false;}}if(this._initialized){dojo.publish("/cometd/meta",[{cometd:this,action:"connect",successful:_5b.successful,state:this.state()}]);}break;case "/meta/subscribe":_5c=this._deferredSubscribes[_5b.subscription];if(!_5b.successful){if(_5c){_5c.errback(new Error(_5b.error));}this.currentTransport.cancelConnect();return;}dojox.cometd.subscribed(_5b.subscription,_5b);if(_5c){_5c.callback(true);}break;case "/meta/unsubscribe":_5c=this._deferredUnsubscribes[_5b.subscription];if(!_5b.successful){if(_5c){_5c.errback(new Error(_5b.error));}this.currentTransport.cancelConnect();return;}this.unsubscribed(_5b.subscription,_5b);if(_5c){_5c.callback(true);}break;default:if(_5b.successful&&!_5b.successful){this.currentTransport.cancelConnect();return;}}}this.currentTransport.deliver(_5b);if(_5b.data){try{var _5d=[_5b];var _5e="/cometd"+_5b.channel;var _5f=_5b.channel.split("/");var _60="/cometd";for(var i=1;i<_5f.length-1;i++){dojo.publish(_60+"/**",_5d);_60+="/"+_5f[i];}dojo.publish(_60+"/**",_5d);dojo.publish(_60+"/*",_5d);dojo.publish(_5e,_5d);}catch(e){console.debug(e);}}};this._sendMessage=function(_62){if(this.currentTransport&&!this.batch){return this.currentTransport.sendMessages([_62]);}else{this._messageQ.push(_62);return null;}};this.startBatch=function(){this.batch++;};this.endBatch=function(){if(--this.batch<=0&&this.currentTransport&&this._connected){this.batch=0;var _63=this._messageQ;this._messageQ=[];if(_63.length>0){this.currentTransport.sendMessages(_63);}}};this._onUnload=function(){dojo.addOnUnload(dojox.cometd,"disconnect");};this._connectTimeout=function(){var _64=0;if(this._advice&&this._advice.timeout&&this.expectedNetworkDelay>0){_64=this._advice.timeout+this.expectedNetworkDelay;}if(this.connectTimeout>0&&this.connectTimeout<_advised){return this.connectTimeout;}return _64;};};dojox.cometd.longPollTransport=new function(){this._connectionType="long-polling";this._cometd=null;this.check=function(_65,_66,_67){return ((!_67)&&(dojo.indexOf(_65,"long-polling")>=0));};this.tunnelInit=function(){var _68={channel:"/meta/connect",clientId:this._cometd.clientId,connectionType:this._connectionType,id:""+this._cometd.messageId++};_68=this._cometd._extendOut(_68);this.openTunnelWith({message:dojo.toJson([_68])});};this.tunnelCollapse=function(){if(!this._cometd._initialized){return;}if(this._cometd._advice&&this._cometd._advice["reconnect"]=="none"){console.debug("cometd reconnect: none");return;}setTimeout(dojo.hitch(this,function(){this._connect();}),this._cometd._interval());};this._connect=function(){if(!this._cometd._initialized){return;}if(this._cometd._polling){console.debug("wait for poll to complete or fail");return;}if((this._cometd._advice)&&(this._cometd._advice["reconnect"]=="handshake")){this._cometd._connected=false;this._initialized=false;this._cometd.init(this._cometd.url,this._cometd._props);}else{if(this._cometd._connected){var _69={channel:"/meta/connect",connectionType:this._connectionType,clientId:this._cometd.clientId,id:""+this._cometd.messageId++};if(this._cometd.connectTimeout>this._cometd.expectedNetworkDelay){_69.advice={timeout:(this._cometd.connectTimeout-this._cometd.expectedNetworkDelay)};}_69=this._cometd._extendOut(_69);this.openTunnelWith({message:dojo.toJson([_69])});}}};this.deliver=function(_6a){};this.openTunnelWith=function(_6b,url){this._cometd._polling=true;var _6d={url:(url||this._cometd.url),content:_6b,handleAs:this._cometd.handleAs,load:dojo.hitch(this,function(_6e){this._cometd._polling=false;this._cometd.deliver(_6e);this._cometd._backon();this.tunnelCollapse();}),error:dojo.hitch(this,function(err){this._cometd._polling=false;console.debug("tunnel opening failed:",err);dojo.publish("/cometd/meta",[{cometd:this._cometd,action:"connect",successful:false,state:this._cometd.state()}]);this._cometd._backoff();this.tunnelCollapse();})};var _70=this._cometd._connectTimeout();if(_70>0){_6d.timeout=_70;}this._poll=dojo.xhrPost(_6d);};this.sendMessages=function(_71){for(var i=0;i<_71.length;i++){_71[i].clientId=this._cometd.clientId;_71[i].id=""+this._cometd.messageId++;_71[i]=this._cometd._extendOut(_71[i]);}return dojo.xhrPost({url:this._cometd.url||dojo.config["cometdRoot"],handleAs:this._cometd.handleAs,load:dojo.hitch(this._cometd,"deliver"),error:dojo.hitch(this,function(err){console.debug("dropped messages: ",_71);}),content:{message:dojo.toJson(_71)},error:dojo.hitch(this,function(err){dojo.event.topic.publish("/cometd/meta",{cometd:this,action:"publish",successful:false,state:this.state(),messages:_71});}),timeoutSeconds:this._cometd.expectedNetworkDelay/1000,timeout:dojo.hitch(this,function(){dojo.event.topic.publish("/cometd/meta",{cometd:this,action:"publish",successful:false,state:this.state(),messages:_71});})});};this.startup=function(_75){if(this._cometd._connected){return;}this.tunnelInit();};this.disconnect=function(){var _76={channel:"/meta/disconnect",clientId:this._cometd.clientId,id:""+this._cometd.messageId++};_76=this._cometd._extendOut(_76);dojo.xhrPost({url:this._cometd.url||dojo.config["cometdRoot"],handleAs:this._cometd.handleAs,content:{message:dojo.toJson([_76])}});};this.cancelConnect=function(){if(this._poll){this._poll.cancel();this._cometd._polling=false;dojo.debug("tunnel opening cancelled");dojo.event.topic.publish("/cometd/meta",{cometd:this._cometd,action:"connect",successful:false,state:this._cometd.state(),cancel:true});this._cometd._backoff();this.disconnect();this.tunnelCollapse();}};};dojox.cometd.callbackPollTransport=new function(){this._connectionType="callback-polling";this._cometd=null;this.check=function(_77,_78,_79){return (dojo.indexOf(_77,"callback-polling")>=0);};this.tunnelInit=function(){var _7a={channel:"/meta/connect",clientId:this._cometd.clientId,connectionType:this._connectionType,id:""+this._cometd.messageId++};_7a=this._cometd._extendOut(_7a);this.openTunnelWith({message:dojo.toJson([_7a])});};this.tunnelCollapse=dojox.cometd.longPollTransport.tunnelCollapse;this._connect=dojox.cometd.longPollTransport._connect;this.deliver=dojox.cometd.longPollTransport.deliver;this.openTunnelWith=function(_7b,url){this._cometd._polling=true;var _7d={load:dojo.hitch(this,function(_7e){this._cometd._polling=false;this._cometd.deliver(_7e);this._cometd._backon();this.tunnelCollapse();}),error:dojo.hitch(this,function(err){this._cometd._polling=false;console.debug("tunnel opening failed:",err);dojo.publish("/cometd/meta",[{cometd:this._cometd,action:"connect",successful:false,state:this._cometd.state()}]);this._cometd._backoff();this.tunnelCollapse();}),url:(url||this._cometd.url),content:_7b,callbackParamName:"jsonp"};var _80=this._cometd._connectTimeout();if(_80>0){_7d.timeout=_80;}dojo.io.script.get(_7d);};this.sendMessages=function(_81){for(var i=0;i<_81.length;i++){_81[i].clientId=this._cometd.clientId;_81[i].id=""+this._cometd.messageId++;_81[i]=this._cometd._extendOut(_81[i]);}var _83={url:this._cometd.url||dojo.config["cometdRoot"],load:dojo.hitch(this._cometd,"deliver"),callbackParamName:"jsonp",content:{message:dojo.toJson(_81)},error:dojo.hitch(this,function(err){dojo.event.topic.publish("/cometd/meta",{cometd:this,action:"publish",successful:false,state:this.state(),messages:_81});}),timeoutSeconds:this._cometd.expectedNetworkDelay/1000,timeout:dojo.hitch(this,function(){dojo.event.topic.publish("/cometd/meta",{cometd:this,action:"publish",successful:false,state:this.state(),messages:_81});})};return dojo.io.script.get(_83);};this.startup=function(_85){if(this._cometd._connected){return;}this.tunnelInit();};this.disconnect=dojox.cometd.longPollTransport.disconnect;this.disconnect=function(){var _86={channel:"/meta/disconnect",clientId:this._cometd.clientId,id:""+this._cometd.messageId++};_86=this._cometd._extendOut(_86);dojo.io.script.get({url:this._cometd.url||dojo.config["cometdRoot"],callbackParamName:"jsonp",content:{message:dojo.toJson([_86])}});};this.cancelConnect=function(){};};dojox.cometd.connectionTypes.register("long-polling",dojox.cometd.longPollTransport.check,dojox.cometd.longPollTransport);dojox.cometd.connectionTypes.register("callback-polling",dojox.cometd.callbackPollTransport.check,dojox.cometd.callbackPollTransport);dojo.addOnUnload(dojox.cometd,"_onUnload");}if(!dojo._hasResource["dojox.cometd"]){dojo._hasResource["dojox.cometd"]=true;dojo.provide("dojox.cometd");}
