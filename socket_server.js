var http = require ('http'),
	url = require ('url'),
	fs = require ('fs'),
	path = require ('path'),
	mine = require ('./mine'),
	io=require('socket.io'),
	Socket;
var app = http.createServer(function(request,response){
	var pathName = url.parse(request.url).pathname,
		realPath = path.join(pathName),
		ext = path.extname(realPath);
		ext = ext ? ext.slice(1):'unknown';
		if(/^[\/\\]/gi.test(realPath)) realPath=realPath.slice(1);
		console.log('pathName:'+pathName+' |  realPath:'+realPath+'   |   fileName:'+ext);
		fs.exists(realPath,function(exists){
			if(!exists){
				response.writeHead(404,{
					'Content-Type':'text/plain'
				})
				response.write("This request URL "+pathName+" was not found on this server.");
				response.end();
			}else{
				fs.readFile(realPath,'binary',function(err,file){
					if(err){
						response.writeHead(500,{
							'Content-Type':'text/plain'
						})
						response.end(err);
					}else{
						var contentType=mine[ext] || 'text/plain';
						response.writeHead(200,{
							'Content-Type':contentType
						});
						response.write(file,'binary');
						response.end();
					}
				})
			}
		})
})
app.listen(process.argv[2] || 8090);

Socket=new io(app);

Socket.on('connection',function(client){
	client.write('Hi\n');
	client.write('Bye!\n');
	console.log(client);
	//client.emit('news', { hello: 'world' });
	client.on('my other event', function (data) {
	   console.log(data);
	   client.emit('news', { hello: data });
	});

	//client.end();
	client.on('data',function(data){
		console.log("resive data："+data);
		resiveData(data,client);
	})
})

function resiveData(data,client){
	if(data == 'q'){
		client.write('\nyou command to exit');
		client.end();
		return;
	}
	client.write('\nyou say : '+data);
}