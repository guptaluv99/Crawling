var crawl = angular.module('crawl', ['ngMaterial', 'ngMessages',]);

crawl.service('crawlService', ['$http', function ($http) {
    this.getDetails = function(){
        //console.log('Hi from service');
        return $http.get('/api/weburls/getDetails');
    };
    this.startCrawl = function(thislink){
        return $http.post('/api/weburls/startCrawl', thislink);
    };
    this.resumeCrawl = function(thislink){
        return $http.get('/api/weburls/resumeCrawl', thislink);
    };
}])


crawl.controller('crawlCtrl',function($scope,$http, crawlService){
    
    $scope.getDetails = function(){
        crawlService.getDetails().success(function (data, status, headers){
            console.log(data);
            $scope.allData=data;
            //Notification.success({message: 'success', delay: 5000, positionY: 'bottom', positionX: 'left'});
        })
        .error(function (data, status, header, config) {
            console.log('Error ' + data + ' ' + status);
        });
    };
    
    $scope.startCrawl = function(url){
        var newObj = {url: url};
        crawlService.startCrawl(newObj).success(function (data, status, headers){
            //Notification.success({message: 'success', delay: 5000, positionY: 'bottom', positionX: 'left'});
        })
        .error(function (data, status, header, config) {
            console.log('Error ' + data + ' ' + status);
        });
    }
})