var http = require ('http'),
	url = require ('url'),
	fs = require ('fs'),
	path = require ('path'),
	mine = require ('./mine');

var server = http.createServer(function(request,response){
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
server.listen(process.argv[2] || 8090);
console.log("Server running at port:"+(process.argv[2] || 8090)+'.');