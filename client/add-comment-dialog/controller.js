app.controller(
    "AddCommentCntrl",
    [   "$scope",
        "$mdDialog",
        "$http",
        "$cookies",
        addCommentCntrl]);
    
function addCommentCntrl($scope, $mdDialog, $http, $cookies) {
    
    var self = this;
    
    this.text = "";
    this.img = null;
    this.err = null;
    this.close = function() {$mdDialog.hide();};
    this.send = 
        function() {
            
            this.err = null;
            
            if(!this.text || this.text.length < 2) {
                this.err = "Invalid text";
                return;
            }
            
            if(this.img === null) {
                this.err = "Make screenshot";
                return;
            }

            var parms = {
                    when_created: (new Date()).getTime(),
                    author: $cookies.get("usr-name"),
                    text: self.text,
                    img: self.img};

            $http
                .post("/add-comment", parms)
                .then(
                    function(pResp) {

                        if(pResp.data.status === "ok")
                            $scope.$emit("newComment", parms);
                        else
                            console.error(pResp.data.status);

                        console.log(pResp);
                    },
                    function() {
                        console.error("fail to send comment");
                    });
        };
    
    var winKeyPress = 
            function(ev) {

                if(!ev.ctrlKey || ev.key!=="s")
                    return;

                html2canvas(document.getElementById("container"))
                    .then(
                        function(canvas) {
                            
                            //document.body.appendChild(canvas);
                            
                            self.img = canvas.toDataURL();
                            
                            //console.log("%O", canvas);
                            //console.log(self.img);
                            
                            var imgCont = document.createElement("div"),
                                oldImg = 
                                    document.getElementById("comment-scrnsht"),
                                notif = 
                                    document
                                        .getElementById("comment-scrn-notif");
                            
                            if(oldImg)
                                oldImg.remove();

                            if(notif)
                                notif.remove();

                            imgCont.innerHTML = 
                                "<img "+
                                    "id='comment-scrnsht' "+
                                    "width='48px' "+
                                    "height='48px' "+
                                    "src='"+self.img+"'>";

                            document
                                .getElementsByClassName(
                                    "comment-dialog-content")[0]
                                .appendChild(imgCont);
                        });

                ev.preventDefault();
                ev.stopPropagation();
            };
    
    window.addEventListener("keydown", winKeyPress);
    
    $scope.$on(
        "$destroy",
        function() {
            window.removeEventListener("keydown", winKeyPress);
        });
}