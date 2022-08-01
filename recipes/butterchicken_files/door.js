
           (function () {
    var pvs = window.top.location == window.self.location ? 1 : 2;
    var pvid=getPVID();
    var hitDone=false;
    if (window.DotMetricsInitScript == undefined) {
        window.DotMetricsInitScript = true;

        checkTCF(start);

        function NewDotMetricsLoad(DotMetricsContentLoadedFunction) {
            if (document.readyState != undefined && document.readyState != 'loading') {
                setTimeout(function () {
                    DotMetricsContentLoadedFunction();
                }, 100);
            } else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', DotMetricsContentLoadedFunction, false);
            } else if (document.attachEvent) {
                document.attachEvent('onreadystatechange', DotMetricsContentLoadedFunction);
            } else if (window.addEventListener) {
                window.addEventListener('load', DotMetricsContentLoadedFunction, false);
            } else if (window.attachEvent) {
                window.attachEvent('onload', DotMetricsContentLoadedFunction);
            }
            if (window.location.href.indexOf('dotmetrics_debug=true') >= 0){
                DotMetricsContentLoadedFunction();
            }
        }

        function checkTCF(callback){
            //if cmp uses TCF __tcfapi function must exist
            if(typeof __tcfapi == 'function'){
                var lr=false;
                __tcfapi('addEventListener', 2, function(tcData, success){
                    if(success){
                        //if tcloaded event or user interaction with tcf is complete (useractioncomplete) check for consent
                        if(tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete'){
                            //make sure that event is handled only once regardless of removeEventListener
                            if(lr==true){return;}
                            lr=true;

                            //stop listening for TCF events
                            __tcfapi('removeEventListener', 2,function(success){},tcData.listenerId);

                            //check for vendor consent, Dotmetrics vendor id 896
                            if(typeof tcData.vendor != 'undefined' && typeof tcData.vendor.consents != 'undefined' && tcData.vendor.consents[896]==true){
                                //we have user consent
                                callback(true);
                            }else{
                                //we dont have user consent
                                callback(false);
                            }
                        }
                        //This is the event status whenever the UI is surfaced or re-surfaced to a user.
                        if(tcData.eventStatus === 'cmpuishown'){callback(false);}
                    }
                });
            }else{
                //cmp does not use TCF
                callback(true);
            }
        }

        function start(hasConsent){
            var rand=new Date().getTime();
            var domain = window.location.hostname;
            var pageUrl = encodeURIComponent(window.location);
            var fbia= navigator.userAgent.toLowerCase().indexOf('fbia')>=0;
            var tzOffset= new Date().getTimezoneOffset();
            if(fbia){pvs=1;}

            if(!hitDone){
                var imgUrl = 'https://au-script.dotmetrics.net/hit.gif?id=13093&url=' + pageUrl + '&dom=' + domain + '&r=' + rand + '&pvs=' + pvs + '&pvid=' + pvid + '&c=' + hasConsent + '&tzOffset=' + tzOffset;
                var im=new Image;
                im.src = imgUrl;
                im.onload = function (){im.onload=null};

                
                hitDone=true;
            }

            if(pvs==2){return;}

            NewDotMetricsLoad(function () {
                if (document.createElement) {
                    if (typeof window.DotMetricsSettings == 'undefined') {
                        window.DotMetricsSettings =
                                    {
                                        CurrentPage: window.location,
                                        Debug: false,
                                        DataUrl: 'https://au-script.dotmetrics.net/SiteEvent.dotmetrics',
                                        PostUrl: 'https://au-script.dotmetrics.net/DeviceInfo.dotmetrics',
                                        ScriptUrl:  'https://au-script.dotmetrics.net/Scripts/script.js?v=209',
                                        ScriptDebugUrl:  'https://download.dotmetrics.net/Script/script.debug.js?v=9f5d3c6a-1746-4035-adf2-01a1a02f7ce4',
                                        PingUrl: 'https://au-script.dotmetrics.net/Ping.dotmetrics',
                                        AjaxEventUrl: 'https://au-script.dotmetrics.net/AjaxEvent.dotmetrics',
                                        NCSScriptUrl: 'https://au-script.dotmetrics.net/Scripts/ncs-script.js?v=209',
                                        NCSScriptDebugUrl: 'https://download.dotmetrics.net/Script/ncs-script.debug.js?v=2bbd541d-1808-4b9f-9118-090e5f8b5060',
                                        NCSHitUrl: 'https://au-script.dotmetrics.net/unconsentedvideohit.gif',
                                        SiteSectionId: 13093,
                                        SiteId: 1569,
                                        FlashUrl: 'https://au-script.dotmetrics.net/DotMetricsFlash.swf',
                                        TimeOnPage: 'DotMetricsTimeOnPage',
                                        AjaxEventTimeout: 500,
                                        AdexEnabled: false,
                                        AdexConfigUrl: 'https://script.api/DotMetrics.Script.Adex/adexConfig.js?v=209&id=13093',
                                        BeaconUrl: 'https://au-script.dotmetrics.net/BeaconEvent.dotmetrics',
                                        PVID:pvid
                                    };

                        var scriptUrl;
                        var scriptType;
                        if(hasConsent==true){
                            scriptType=window.location.href.indexOf('dotmetrics_debug=true') >= 0 ? 'ScriptDebugUrl' : 'ScriptUrl';
                            scriptUrl = window.DotMetricsSettings[scriptType];
                        }else{
                            scriptType=window.location.href.indexOf('dotmetrics_debug=true') >= 0 ? 'NCSScriptDebugUrl' : 'NCSScriptUrl';
                            scriptUrl = window.DotMetricsSettings[scriptType];
                        }

                        var fileref = document.createElement('script');
                            fileref.setAttribute('type', 'text/javascript');
                            fileref.setAttribute('src', scriptUrl);
                            fileref.setAttribute('async', 'async');
                            if (typeof fileref != 'undefined') {
                                document.getElementsByTagName('head')[0].appendChild(fileref);
                            }

                        window.postMessage({ type: 'DotmetricsDoorEvent', siteId: DotMetricsSettings.SiteId, sectionId: DotMetricsSettings.SiteSectionId},'*');

                        

                        if(hasConsent==true && window.DotMetricsSettings.AdexEnabled){
	                        fileref = document.createElement('script');
	                        fileref.setAttribute('type', 'text/javascript');
	                        fileref.setAttribute('src', window.DotMetricsSettings.AdexConfigUrl);
	                        fileref.setAttribute('async', 'async');
	                        if (typeof fileref != 'undefined') {
	                             document.getElementsByTagName('head')[0].appendChild(fileref);
                            }
                        }
                    }
                }
            });
        }
    }
    function getPVID(){
        var pvid;
        try{
            if(crypto.randomUUID){
                pvid=crypto.randomUUID();
            }else{
                pvid=([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
            }
        }catch(e){
            pvid = (Date.now().toString(36) + Math.random().toString(36).substr(2, 24));
        }
        return pvid;
    }
})(window);