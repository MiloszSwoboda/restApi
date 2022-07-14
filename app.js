const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { AutoEncryptionLoggerLevel } = require("mongodb");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-milosz:Konigg2115@cluster0.dzjnofe.mongodb.net/wikiDB")

const articleSchema =  new mongoose.Schema( {
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema)


const rest = new Article({
    title: "REST",
    content: "REST is an architectural style for designing APIs."
})

const bootstrap = new Article({
    title:"Bootstrap",
    content: "CSS Framework"
})


app.route("/articles").get(function(req,res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else{
            console.log(err);
        }
        
    })
}).post(function(req,res){
    
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save(function(err){
        if(!err){
            res.send("Data saved successfully!")
        } else{
            res.send(err)
        }
    });
}).delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles")
        } else{
            console.log(err);
        }
    })
});

app.route("/articles/:articleTitle")

.get(function(req,res){

    const articleParam = req.params.articleTitle;

    Article.findOne({title:articleParam}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else{
            res.send("No matching article");
        }
    })
})

.put(function(req,res){

    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},  //req.body.title i content dodajemy za pomocą postmana
        function(err){
            if(!err){
                res.send("Successfully updated an article!")
            } else{
                res.send("Updating failed! ", err)
            }
        }   
        )
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated!")
            }else{
                res.send(err);
            }
        }
    )
})

.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if(!err){
            res.send("Successfully deleted")
        } else{
            res.send(err)
        }
    })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});