const status = require('../status');
const ldr = require('../ldr');

module.exports = (router) => {
  router.route('/').get((req, res) => {
      res.send('Hello in to NodeMCU App');
  });

  router.route('/status').get((req, res) => {
      res.status(200).send(status.get());
  });

  router.route('/status').post((req, res) => {
      status.set(req.body);

      res.status(201).send(status.get());
  });

  router.route('/ldr').get((req, res) => {
      res.status(200).send(ldr.get());
  });

  router.route('/ldr').post((req, res) => {
      ldr.set(req.body);

      res.status(201).send(ldr.get());
  });
}
