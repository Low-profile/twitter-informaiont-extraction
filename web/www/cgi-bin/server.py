#!/usr/bin/python2
#coding=utf-8
# Import modules for CGI handling 
import cgi, os
import cgitb; cgitb.enable()
#import facedetectme
form = cgi.FieldStorage()
# Get filename here.
fileitem = form['jsonfile']
flag = 0
# Test if the file was uploaded
if fileitem.filename:
   # strip leading path from file name to avoid 
   # directory traversal attacks
   fn = os.path.basename(fileitem.filename)
   if fn=='testdata.txt':
      flag = 1
      open('/home/ubuntu/test/'+fileitem.filename, 'wb').write(fileitem.file.read())
      message = 'The file "' + fn + '" was uploaded successfully'
   else:
      message = 'Attention: The file is not testdata.txt!!!<br>Your file is '+fn
   
else:
   message = 'No file was uploaded' 

print """\
Content-Type: text/html\n

<html><head>
<title>upload result</title>
</head><body><h2>upload result:</h2>
"""
print """\
%s
""" % (message)

if flag==1:
   print "<br><hr align=left width=500><br>You can check the result by <a href=\'http://34.216.221.99\'>WATT Demo</a>"

print "<br><br>Upload testdata.txt again <a href=\'http://34.216.221.99/upload.html\'>Upload file</a>"

print "</body></html>"

