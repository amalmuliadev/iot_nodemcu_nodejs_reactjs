let status = { 'led1on': 1, 'led2on': 1 };
let socket = false;

exports.setEmiter = function (e) {
  socket = e;
}

exports.get = function () {
  console.log('get');
  return status;
}

exports.set = function (data) {
  console.log('set');
  status = data;

  if(socket) {
    console.log('socket');
    socket.emit('status', data);
  }
}
