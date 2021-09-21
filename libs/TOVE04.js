// (function () {
//     var app = angular.module("myApp", []);
// })()

//TOVE04-Form-With-Bootstrap-AngularJS-003.js
//LastUpdate: 2021.08.23-15h02
//##########################################
// var app = angular.module("myApp", []);
let app;
app = angular.module("MyApp", []);
app.controller("MyController", function($scope) {

    // USER INFO ON TOP RIGHT
    $scope.userInfo={
        name:"Huy",
        number:"102"
    }

    // TABLE DATA
    $scope.Staff = [
        {StaffId: 1, FirstName: "Huy",      LastName: "Do",         Phone: "501",               Action: "-"},
        {StaffId: 2, FirstName: "An",       LastName: "Ha",         Phone: "502",               Action: "-"},
        {StaffId: 3, FirstName: "Tung",     LastName: "Nguyen",     Phone: "503",               Action: "-"},
        {StaffId: 4, FirstName: "Dien",     LastName: "Do",         Phone: "504",               Action: "-"},
        {StaffId: 5, FirstName: "Trung",    LastName: "Nguyen",     Phone: "505",               Action: "-"},
        {StaffId: 6, FirstName: "Tony",     LastName: "Cao",        Phone: "+84.976.xxx.yyy",   Action: "-"}
    ];


    // SHOW BUTTON ON ROW IN TABLE
    $scope.isShowActions_4_TableData = false;
    $scope.changeActionStatus = function (status) {
        this.isShowActions_4_TableData = status;
    }

    // REMOVE ROW
    $scope.doRemoveContact = function (c) {
        console.log(c);
        _.remove($scope.Staff, ['Phone', c.Phone]);
    }




    $scope.showOncall = false;
    $scope.showDialpad = false;

    $scope.showAddContact = false;
    $scope.doAddContact = function(c) {
        console.log(c);
        let newContact = angular.copy(c);
        $scope.customers.push(newContact);
        c.FirstName = '';
        c.LastName = '';
        c.Phone = '';
        //hide modal
        $scope.showAddContact = false;
    }








});
