
1.decompress the WATT-demo.tgz
linux:
	tar zxf WATT-demo.tgz
Windows:use rar or zip software

2.entry the folder
	cd www
	
3.use python2 CGIHTTPServer as the http server
in linux:
	sudo python2 -m CGIHTTPServer 80
in Windows:
	python2 -m CGIHTTPServer 80
	
4.open a bowser like Chrome, 
http://127.0.0.1				Main page
http://127.0.0.1/upload.html	upload data file page
