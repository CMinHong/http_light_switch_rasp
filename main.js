var express = require('express');
var app = express();
var path = require('path');
var exec = require('child_process').exec;
var light = false;
const io = 6;

exec("gpio mode " + io + " out");
exec("gpio read " + io, function(err, stdout, stderr) {
    light = stdout == 1;
})

app.engine('.html', require('ejs').renderFile); // ejs渲染网页可以传参数


app.use(express.static(path.join(__dirname, 'html')))
app.listen(3037, ()=> {
    console.log('app listen at port 80');
})

app.get('/', function(req, res) {
    res.render(__dirname + '/html/index.ejs', {checked:light});
})

app.get('/submit', function(req, res) {
    console.log("req:"+req.query.cmd);
    
    light = req.query.cmd == "false";
    exec("gpio write " + io + (light ? ' 1' : ' 0'));
    console.log("gpio write " + io + (light ? ' 1' : ' 0'));
    res.render(__dirname + '/html/index.ejs', {checked: light});
})
