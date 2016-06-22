var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    commentSchema = 
        new Schema({
                author: String,
                text: String,
                when_created: Date,
                img: String
        }),
    Comment = mongoose.model("Comment", commentSchema);

mongoose.connect("mongodb://localhost::27017/comments-db");

exports.get = 
    function(req, res, next) {

        Comment.find(
            {},
            function(err, comments) {
                if(err) {
                    res.json({status: "error", data: err});
                    return;
                }
                
                var ts,
                    comm,
                    comms = [];
                
                for(var i in comments) {

                    comm = {};

                    ts = comments[i].when_created.getTime();
                    comm.author = comments[i].author;
                    comm.text = comments[i].text;
                    comm.when_created = ts;
                    comm.img = comments[i].img;
                    comms.push(comm);
                }

                res.json({status: "ok", data: comms});
            });
    };

exports.add = 
    function(req, res, next) {
        
        if( !req.body.when_created ||
            !req.body.author ||
            !req.body.text ||
            !req.body.img) {
                res.json({status: "error"});
                return;
        }

        var comment = 
                new Comment({
                        author: req.body.author,
                        text: req.body.text,
                        when_created: new Date(req.body.when_created),
                        img: req.body.img
                });

        comment.save(
            function(err) {
                if(err) {
                    res.json({status: "error"});
                    return;
                }

                res.json({status: "ok", data: req.body});
            });
    };
