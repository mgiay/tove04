(function () {
    angular.module("MyApp").controller("DialpadController", DialpadController);
    DialpadController.$inject = ['$scope', '$timeout', '$interval', 'SipService'];

    function DialpadController($scope, $timeout, $interval, SipService) {
        var vm = this;
        var timer = 0;
        var _interval;

        activate();

        function activate() {
            vm.dialpadStatus = 0; //0: hide, 1: dialpad, 2: oncall
            vm.isRegistered = true;
            vm.showDTMF = false;
            vm.showTransfer = false;
            vm.padKeys = [
                ['1', '2', '3'],
                ['4', '5', '6'],
                ['7', '8', '9'],
                ['*', '0', '#']
            ]

            vm.dialNumber = '';
            vm.callStatus = -1; // 0: callout, 1: ringing, 2: connected
            vm.remoteNumber = '';
            vm.isMuted = false;
            vm.isHeld = false;
            vm.timerString = '';
            vm.agentNumber = '';
            vm.isMinimized = false;

            /** functions */
            vm.pressPadKey = pressPadKey;
            vm.deleteLast = deleteLast;
            vm.doCall = doCall;
            vm.doHangup = doHangup;
            vm.doAccept = doAccept;
            vm.doReject = doReject;
            vm.toggleMute = toggleMute;
            vm.toggleHold = toggleHold;
            vm.validateInputKey = validateInputKey;
            vm.toggleDialpadWindow = toggleDialpadWindow;

            vm.toggleDTMF = toggleDTMF;
            vm.sendDTMF = sendDTMF;
            vm.toggleTransfer = toggleTransfer;
            vm.doTransfer = doTransfer;
        }//activate

        function pressPadKey(key) {
            console.log('pressPadKey:', key);
            vm.dialNumber = vm.dialNumber + key;
        }//pressPadKey
        function deleteLast() {
            vm.dialNumber = vm.dialNumber.substr(0, vm.dialNumber.length - 1);
        }//deleteLast
        function toggleDTMF() {
            vm.showDTMF = !vm.showDTMF;
        }//toggleDTMF
        function toggleTransfer() {
            vm.showTransfer = !vm.showTransfer;
        }//toggleTransfer
        function doCall(number) {
            SipService.call(number);
            vm.remoteNumber = number;
        }//doCall
        function doHangup() {
            SipService.hangup();
        }//doHangup
        function doAccept() {
            SipService.accept();
        }//doAccept
        function doReject() {
            SipService.reject();
        }//doReject
        function toggleMute() {
            SipService.toggleMute();
        }//toggleMute
        function toggleHold() {
            SipService.toggleHold();
        }//toggleHold
        function sendDTMF(key) {
            SipService.sendDTMF(key);
        }//sendDTMF
        function doTransfer(number) {
            //validate number
            SipService.transfer(number);
        }//doTransfer

        function validateInputKey(event) {
            let validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#'];
            let found = _.find(validKeys, (k) => {
                return k == event.key
            })
            if (!found) {
                //enter == ascii 13
                if (event.keyCode == 13) {
                    vm.doCall(vm.dialNumber);
                    return true;
                }
                event.preventDefault();
                return false;
            }
        }//validateInputKey

        function toggleDialpadWindow() {
            vm.isMinimized = !vm.isMinimized;
        }//toggleDialpadWindow

        function timerToString(timer) {
            // 70 -> 01:10
            let hour = Math.floor(timer / 3600);
            timer = timer - (hour * 3600);
            let minute = Math.floor(timer / 60);
            let second = timer % 60;

            if (hour < 10) {
                hour = '0' + hour;
            }
            if (minute < 10) {
                minute = '0' + minute;
            }
            if (second < 10) {
                second = '0' + second;
            }
            if (hour != '00') {
                return `${hour}:${minute}:${second}`;
            }
            return `${minute}:${second}`;
        }//timerToString

        function startTimer() {
            timer = 0;
            vm.timerString = "00:00";
            //start
            _interval = $interval(() => {
                timer++;
                vm.timerString = timerToString(timer);
            }, 1000)
        }//startTimer
        function stopTimer() {
            timer = 0;
            //stop
            $interval.cancel(_interval)
        }//stopTimer

        //listen events
        // SIP_EVENT
        $scope.$on("SIP_EVENT", function (event, data) {
            console.log('$on SIP_EVENT: ', event, data);
            switch (data.name) {
                case 'registered':
                    $timeout(function () {
                        vm.dialpadStatus = 1;
                        vm.isRegistered = true;
                        //data.agentNumber
                        vm.agentNumber = data.agentNumber;
                        console.log('$scope.showDialpad:', vm.showDialpad);
                    })
                    break;
                case 'unregistered':
                    $timeout(function () {
                        vm.dialpadStatus = 0;
                        vm.isRegistered = false;
                        console.log('$scope.showDialpad:', vm.showDialpad);
                    })
                    break;
                case 'connecting':
                    $timeout(function () {
                        vm.dialpadStatus = 2;
                        vm.callStatus = 0;
                    })
                    break;
                case 'connected':
                    $timeout(function () {
                        vm.dialpadStatus = 2;
                        vm.callStatus = 2;
                        startTimer();
                    })
                    break;
                case 'ended':
                    $timeout(() => {
                        vm.dialpadStatus = 1;
                        vm.timerString = '';
                        vm.remoteNumber = '';
                        stopTimer();
                    })
                    break;
                case 'ringing':
                    $timeout(() => {
                        vm.dialpadStatus = 2;
                        vm.callStatus = 1; //show accept / reject
                        vm.remoteNumber = data.remoteNumber;
                        vm.timerString = 'Đang gọi...'
                        vm.isMinimized = false;
                    })
                    break;
                case 'mute':
                    $timeout(() => {
                        vm.isMuted = true;
                    })
                    break;
                case 'unmute':
                    $timeout(() => {
                        vm.isMuted = false;
                    })
                    break;
                case 'hold':
                    $timeout(() => {
                        vm.isHeld = true;
                    })
                    break;
                case 'unhold':
                    $timeout(() => {
                        vm.isHeld = false;
                    })
                    break;
                default:
                    break;
            }
        })//SIP_EVENT
    };//DialpadController
})()