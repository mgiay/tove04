(function () {
    angular.module("MyApp").service("SipService",
        function ($rootScope) {
            // const wsServer = 'wss://pitel01.tel4vn.com:7444';
            const wsServer = 'wss://sbc03.tel4vn.com:7444';
            const sipDomain = 'demo.tel4vn.com:50061';
            var simple = null;
            var isMuted = false;
            var isHeld = false;
            var callSession = null;
            var agentNumber = '';

            this.initSip = function (username, password) {
                console.log("[SipService] initSip:", username, password);
            }//initSip

            this.register = function (username, password) {
                var options = {
                    media: {
                        local: {
                            audio: document.getElementById('localAudio')
                        },
                        remote: {
                            audio: document.getElementById('remoteAudio')
                        }
                    },
                    ua: {
                        uri: `${username}@${sipDomain}`,
                        authorizationUser: username,
                        password: password,
                        wsServers: [wsServer]
                    }
                };
                agentNumber = username;
                simple = new SIP.Web.Simple(options);
                addEvents(simple);
            }//register

            this.unregister = function () {
                simple.ua.unregister();
            }//unregister
            this.call = function (callNumber) {
                //validate callNumber
                simple.call('' + callNumber);
            }//call
            this.hangup = function () {
                simple.hangup();
            }//hangup
            this.accept = function () {
                simple.answer();
            }//accept
            this.reject = function () {
                simple.reject();
            }//reject
            this.transfer = function (number) {
                //validate number
                callSession.refer(number);
            }//transfer
            this.toggleMute = function () {
                if (isMuted) {
                    simple.unmute();
                } else {
                    simple.mute();
                }
            }//toggleMute
            this.toggleHold = function () {
                if (isHeld) {
                    simple.unhold();
                } else {
                    simple.hold();
                }
            }//toggleHold
            this.sendDTMF = function (key) {
                //validate 0-9,*,#
                simple.sendDTMF(key);
            }//sendDTMF
            function addEvents(simple) {
                simple.on("registered", function () {
                    console.log('[sip.service.js] registered');
                    $rootScope.$broadcast('SIP_EVENT', {name: 'registered', agentNumber});
                });//registered
                simple.on("unregistered", function () {
                    console.log('[sip.service.js] unregistered');
                    $rootScope.$broadcast('SIP_EVENT', {name: 'unregistered'});
                });//unregistered
                simple.on("ringing", function (event) {
                    console.log('[sip.service.js] ringing');
                    let remoteNumber = event.remoteIdentity.displayName || event.remoteIdentity.uri.user
                    ;
                    $rootScope.$broadcast('SIP_EVENT', {name: 'ringing', remoteNumber: remoteNumber});
                });//ringing
                simple.on("connecting", function () {
                    console.log('[sip.service.js] connecting');
                    $rootScope.$broadcast('SIP_EVENT', {name: 'connecting'});
                });//connecting
                simple.on("connected", function (session) {
                    console.log('[sip.service.js] connected');
                    callSession = session;
                    $rootScope.$broadcast('SIP_EVENT', {name: 'connected'});
                });//connected
                simple.on("ended", function () {
                    console.log('[sip.service.js] end');
                    callSession = null;
                    $rootScope.$broadcast('SIP_EVENT', {name: 'ended'});
                });//ended
                simple.on("hold", function () {
                    console.log('[sip.service.js] hold');
                    isHeld = true;
                    $rootScope.$broadcast('SIP_EVENT', {name: 'hold'});
                });//hold
                simple.on("unhold", function () {
                    console.log('[sip.service.js] unhold');
                    isHeld = false;
                    $rootScope.$broadcast('SIP_EVENT', {name: 'unhold'});
                });//unhold
                simple.on("mute", function () {
                    console.log('[sip.service.js] mute');
                    isMuted = true;
                    $rootScope.$broadcast('SIP_EVENT', {name: 'mute'});
                });//mute
                simple.on("unmute", function () {
                    console.log('[sip.service.js] unmute');
                    isMuted = false;
                    $rootScope.$broadcast('SIP_EVENT', {name: 'unmute'});
                });//unmute
            }//addEvents
        })//function ($rootScope):end
})()