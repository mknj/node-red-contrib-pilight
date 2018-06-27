var net = require('net');

module.exports = function(RED) {
  function PilightDaemonNode(n) {
    RED.nodes.createNode(this, n);

    this.host = n.host;
    this.port = n.port;
    this.socket = new net.Socket();
    var node = this;

    node.on('close', function() {
      node.socket.end();
    });

    function connect() {
      node.socket.connect(node.port, node.host);
    }

    var welcomeMessage = JSON.stringify({
      action: "identify",
      options: {
        config: 1,
        receiver: 1
      }
    });

    node.socket.on('connect', function() {
      node.socket.write(welcomeMessage, 'utf-8');
    });

    node.socket.on('end', function() {
      node.log('socket connection: closed');
    });
    node.socket.on('error', function() {
      setTimeout(connect,2*1000) // retry every 2 seconds
    });
    connect();
  }
  RED.nodes.registerType("pilight-daemon", PilightDaemonNode);
}
