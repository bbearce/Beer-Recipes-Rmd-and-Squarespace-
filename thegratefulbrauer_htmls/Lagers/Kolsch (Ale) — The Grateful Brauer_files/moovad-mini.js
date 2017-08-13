
function addEvent(obj,type,fn){if(obj.attachEvent){obj['e'+type+fn]=fn;obj[type+fn]=function(){obj['e'+type+fn](window.event);}
obj.attachEvent('on'+type,obj[type+fn]);}else
obj.addEventListener(type,fn,false);}
function removeEvent(obj,type,fn){if(obj.detachEvent){obj.detachEvent('on'+type,obj[type+fn]);obj[type+fn]=null;}else
obj.removeEventListener(type,fn,false);}
function MoovDoc()
{var that=this;this.docEl=(document.compatMode&&document.compatMode==='CSS1Compat')?document.documentElement:document.body;this.createElementEx=function(tag,attrs){var element=document.createElement(tag);for(var a in attrs){if(a&&attrs.hasOwnProperty(a)&&attrs[a]){element.setAttribute(a.toString(),attrs[a].toString());}}
return element;};this.getWindowWidth=function(){return window.innerWidth||that.docEl.clientWidth;}
this.getWindowHeight=function(){return window.innerHeight||that.docEl.clientHeight;}
this.getOrientatedScreenWidth=function(){var screenW=window.screen.width;var screenH=window.screen.height;var winW=that.getWindowWidth();var winH=that.getWindowHeight();var screenMin=screenW<screenH?screenW:screenH;var screenMax=screenW>screenH?screenW:screenH;return winW>winH?screenMax:screenMin;}
this.doesViewportScaling=function(){if(window.innerWidth===undefined){return-2;}
if(window.innerWidth>window.screen.width){return 1;}
if(window.innerWidth<that.docEl.clientWidth){return 2;}
if(window.outerWidth>=window.screen.width){return 3;}
if(window.outerWidth<window.innerWidth){return 4;}
return-1;}
this.getViewportScale=function(){if(that.doesViewportScaling()>0){return that.getOrientatedScreenWidth()/that.getWindowWidth();}
return 1.0;}}
function MoovAdBanner(data,moovDoc)
{var updateBannerDelay=500;var updateBannerTimer=null;var that=this;this.def=null;this.wrapper=null;this.closeButton=null;var __construct=function(){if(!data||typeof(data)!=='object')return;if(data.metadata.version!='2.0'){console.error("Wrong data version for moovad.js")
return;}
var bannerDef=data.banner;if(!bannerDef){console.error("Invalid banner data")
return;}
var bannerWrapper=moovDoc.createElementEx('div',{'class':'moov-banner-wrapper'});bannerWrapper.style['position']='fixed';bannerWrapper.style['bottom']='0px';bannerWrapper.style['left']='0px';bannerWrapper.style['border']='0px';bannerWrapper.style['margin']='0px';bannerWrapper.style['padding']='0px';bannerWrapper.style['z-index']='9990';bannerWrapper.style['display']='block';bannerWrapper.style['overflow']='hidden';if(bannerDef.button){var closeButton=moovDoc.createElementEx('a',{'href':'#','class':'moov-banner-close-bt'});closeButton.style['display']='block';closeButton.style['position']='absolute';closeButton.style['z-index']='9999';closeButton.style['top']='0px';closeButton.style['right']='0px';closeButton.style['width']=bannerDef.button.width+'px';closeButton.style['height']=bannerDef.button.height+'px';var closeButtonImg=moovDoc.createElementEx('img',{'src':bannerDef.button.src});closeButtonImg.style['display']='block';closeButtonImg.style['width']='100%';closeButtonImg.style['height']='100%';closeButton.appendChild(closeButtonImg);bannerWrapper.appendChild(closeButton);that.closeButton=closeButton;}
var bannerLink=moovDoc.createElementEx('a',{'href':bannerDef.url,'target':'_blank'});bannerLink.style['display']='block';bannerLink.style['width']='100%';bannerLink.style['height']='100%';var bannerImg=moovDoc.createElementEx('img',{'class':'moov-banner-img','src':bannerDef.image.src});bannerImg.style['display']='block';bannerImg.style['width']='100%';bannerImg.style['height']='100%';bannerLink.appendChild(bannerImg);bannerWrapper.appendChild(bannerLink);that.def=bannerDef;that.wrapper=bannerWrapper;that.updateBanner();that.throttledUpdateBannerLoop();document.body.appendChild(bannerWrapper);var eventBannerUpdate=function(e){that.throttledUpdateBannerLoop();};var setEvents=function(eventFn){eventFn(window,'gestureend',eventBannerUpdate);eventFn(window,'resize',eventBannerUpdate);eventFn(window,'webkitfullscreenchange',eventBannerUpdate);eventFn(window,'mozfullscreenchange',eventBannerUpdate);eventFn(window,'fullscreenchange',eventBannerUpdate);eventFn(window,'orientationchange',eventBannerUpdate);};if(bannerDef.button){closeButton.onclick=function(e){e.preventDefault();document.body.removeChild(bannerWrapper);if(updateBannerTimer){clearTimeout(updateBannerTimer);updateBannerTimer=null;setEvents(removeEvent);}};}
setTimeout(function(){setEvents(addEvent)},400);}
this.updateBanner=function(){var winW=moovDoc.getWindowWidth();var winH=moovDoc.getWindowHeight();var imgW=that.def.image.width;var imgH=that.def.image.height;var pixelScale=data.metadata.forced_viewport_scale||moovDoc.getViewportScale();var deviceNativeImgW=imgW/pixelScale;var deviceNativeImgH=imgH/pixelScale;var oversizeX=deviceNativeImgW/(winW*that.def.image.max_width_frac);var oversizeY=deviceNativeImgH/(winH*that.def.image.max_height_frac);var oversizeMax=(oversizeX>oversizeY)?oversizeX:oversizeY;var scaledImgW=Math.round(deviceNativeImgW);var scaledImgH=Math.round(deviceNativeImgH);if(oversizeMax>1.0){scaledImgW=Math.round(deviceNativeImgW/oversizeMax);scaledImgH=Math.round(deviceNativeImgH/oversizeMax);}
var x=0;if(that.def.position=='bottom-centre'){x=Math.round((winW-scaledImgW)/2);}
else if(that.def.position=='bottom-right'){x=winW-scaledImgW;}
var wrapper=that.wrapper;wrapper.style['width']=scaledImgW+'px';wrapper.style['height']=scaledImgH+'px';wrapper.style['left']=x+'px';if(that.def.button){var buttonW=that.def.button.width;var buttonH=that.def.button.height;var scaledButtonW=Math.round(buttonW/pixelScale);var scaledButtonH=Math.round(buttonH/pixelScale);var button=that.closeButton;button.style['width']=scaledButtonW+'px';button.style['height']=scaledButtonH+'px';}
if(that.debugCallback){var debugOutput='';debugOutput+='imgW:'+imgW+', '+'imgH:'+imgH+', '+'buttonW:'+buttonW+', '+'buttonH:'+buttonH+'<br/>';debugOutput+='pixelScale:'+pixelScale.toFixed(2)+','+'deviceNativeImgW:'+deviceNativeImgW.toFixed(2)+','+'deviceNativeImgH:'+deviceNativeImgH.toFixed(2)+'<br/>';debugOutput+='x:'+x+', '+'scaledImgW:'+scaledImgW+', '+'scaledImgH:'+scaledImgH+'<br/>';debugOutput+='scaledButtonW:'+scaledButtonW+', '+'scaledButtonH:'+scaledButtonH+'<br/>';debugOutput+='oversizeX:'+oversizeX.toFixed(2)+','+'oversizeY:'+oversizeY.toFixed(2)+','+'oversizeMax:'+oversizeMax.toFixed(2)+'<br/>';debugOutput+='win.innerWidth:'+winW+', '+'win.innerHeight:'+winH+'<br/>';debugOutput+='win.outerWidth:'+window.outerWidth+', '+'win.outerHeight:'+window.outerHeight+'<br/>';debugOutput+='doc.clientWidth:'+moovDoc.docEl.clientWidth+', '+'doc.clientHeight:'+moovDoc.docEl.clientHeight+'<br/>';debugOutput+='screen.width:'+screen.width+', '+'screen.height:'+screen.height+'<br/>';debugOutput+='scaling?:'+moovDoc.doesViewportScaling()+'<br/>';that.debugCallback(debugOutput);}}
this.throttledUpdateBannerLoop=function(){if(updateBannerTimer){clearTimeout(updateBannerTimer);}
updateBannerTimer=setTimeout(function(){updateBannerTimer=null;that.updateBanner();that.throttledUpdateBannerLoop();},updateBannerDelay);}
__construct();}
function addMoovAdBanner(data)
{if(window!=window.top&&!data.metadata.preview){return null;}
var moovDoc=new MoovDoc();return new MoovAdBanner(data,moovDoc);}