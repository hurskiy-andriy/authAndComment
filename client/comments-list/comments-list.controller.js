app.controller(
    "CommentsListController",
    [   "$http",
        "$mdDialog",
        "$rootScope",
        "$scope",
        commentsList]);
    
function commentsList($http, $mdDialog, $rootScope, $scope) {
    
    this.comments = null;
    this.loading = false;
    this.addComment = 
        function() {
            $mdDialog.show({
                templateUrl: "/client/add-comment-dialog/view.html",
                controller: "AddCommentCntrl",
                controllerAs: "addCommCntrl",
                clickOutsideToClose: true
            });
        };
    
    var self = this,
        addComment = 
            function(pComm) {
                if(self.comments === null)
                    self.comments = [];
                
                var date = new Date(pComm.when_created),
                    month = date.getMonth()+1,
                    day= date.getDate(),
                    hours = date.getHours(),
                    minutes = date.getMinutes(),
                    addZero = 
                        function(pVal) {
                            if(pVal < 10)
                                return "0"+pVal;
                            return pVal;
                        };

                var dateStr = 
                        date.getFullYear()+"-"+
                        addZero(month)+"-"+
                        addZero(day)+" "+
                        addZero(hours)+":"+
                        addZero(minutes),
                    comm = {
                        author: pComm.author,
                        img: pComm.img,
                        text: pComm.text,
                        when_created: dateStr,
                        ts: pComm.when_created
                };

                self.comments.push(comm);
                
            },
        getComments = 
            function() {
                if(self.loading)
                    return;
                
                self.loading = true;
                
                $http
                    .post("/get-comments")
                    .then(
                        function(pResp) {
                            
                            self.comments = [];
                            
                            if(pResp.data.status === "ok")
                                for(var i in pResp.data.data)
                                    addComment(pResp.data.data[i]);
                            else
                                console.error(pResp.data.status);

                            self.loading = false;
                        },
                        function() {
                            console.error("fail to get comment list");
                            self.loading = false;
                        });
            };
    
    getComments();
    
    var listeners = [
            $rootScope.$on(
                "newComment", 
                function(ev, data) {
                    addComment(data);
                })
    ];

    $scope.$on(
        "$destroy", 
        function() {
            for(var i in listeners)
                listeners[i]();
            listeners = [];
        });
}