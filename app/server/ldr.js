let ldr = {'lux': '0', 'volt': '0'};
let socket = false;

exports.setEmiter = function (e) {
  socket = e;
}

exports.get = function () {
  console.log('get');
  return ldr;
}

exports.set = function (data) {
  console.log('set');
  ldr = data;

  if(socket) {
    console.log('socket');
    socket.emit('ldr', data);
  }
}
