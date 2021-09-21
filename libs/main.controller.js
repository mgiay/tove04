(function () {
    angular.module("MyApp")
        .controller("MainController", MainController);
    MainController.$inject = ['$scope', '$timeout', 'SipService'];

    function MainController($scope, $timeout, SipService) {
        var vm = this;
        activate();

        function activate() {

            vm.userInfo = {
                name: 'Huy',
                number: '111'
            }//userInfo

            vm.showAddContact = false;
            vm.showEditContact = false;
            vm.isRegistered = false;
            vm.txtFilter = '';

            // TABLE DATA
            vm.Staff = [
                {StaffId: 1, FirstName: "Huy",      LastName: "Do",         Phone: "501",               Action: "-"},
                {StaffId: 2, FirstName: "An",       LastName: "Ha",         Phone: "502",               Action: "-"},
                {StaffId: 3, FirstName: "Tung",     LastName: "Nguyen",     Phone: "503",               Action: "-"},
                {StaffId: 4, FirstName: "Dien",     LastName: "Do",         Phone: "504",               Action: "-"},
                {StaffId: 5, FirstName: "Trung",    LastName: "Nguyen",     Phone: "505",               Action: "-"},
                {StaffId: 6, FirstName: "Tony",     LastName: "Cao",        Phone: "+84.976.xxx.yyy",   Action: "-"}
            ];
            //test:
            //TinhCX: 307, 308
            SipService.register('318', 'TEL4VN.COM');

            vm.doAddContact = doAddContact;
            vm.doRemoveContact = doRemoveContact;
            vm.showEditContactModal = showEditContactModal;
            vm.doCall = doCall;
            vm.btnCallClick = btnCallClick;
            vm.doEditContact = doEditContact;
        }//activate

        function doAddContact(c) {
            console.log(c);
            let newContact = angular.copy(c);
            vm.Staff.push(newContact);
            c.FirstName = '';
            c.LastName = '';
            c.Phone = '';
            //hide modal
            vm.showAddContact = false;
        }//doAddContact

        function doRemoveContact(c) {
            console.log(c);
            _.remove(vm.Staff, ['Phone', c.Phone]);
        }//doRemoveContact

        function showEditContactModal(c) {
            vm.showEditContact = true;
            vm.editContact = angular.copy(c);
        }//showEditContactModal

        function doEditContact(c) {
            console.log(c);
            let index = _.findIndex(vm.Staff, ['id', c.id]);
            if (index >= 0) {
                vm.Staff[index].FirstName = c.FirstName;
                vm.Staff[index].LastName = c.LastName;
                vm.Staff[index].Phone = c.Phone;
            }
            vm.showEditContact = false;
            vm.editContact = {};
        }//doEditContact

        function doCall(c) {
            SipService.call(c.Phone);
        }//doCall

        function btnCallClick() {
            SipService.call(vm.txtFilter);
        }//btnCallClick

        //listen events: SIP_EVENT
        $scope.$on("SIP_EVENT", function (event, data) {
            console.log('$on SIP_EVENT: ', event, data);
            switch (data.name) {
                case 'registered':
                    $timeout(function () {
                        vm.isRegistered = true;
                    })
                    break;
                case 'unregistered':
                    $timeout(function () {
                        vm.isRegistered = false;
                    })
                    break;
                default:
                    break;
            }//switch
        })//SIP_EVENT
    };//MainController
})()//function