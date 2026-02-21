let NeDB = require('nedb');

let db = new NeDB({
  filename: 'users.db',
  autoload: true
});

module.exports = app => {
  let route = app.route('/users');
  let routeId = app.route('/users/:id');

  route.get((req, res) => {
    db.find({}).sort({ name: 1 }).exec((err, users) => {
      if (err) return app.utils.error.send(err, req, res);

      res.json({ users });
    });
  });

  app.get('/users/admin', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      users: [{
        name: 'MARIA SANTOS',
        email: 'maria@gmail.com',
        telefone: '658225695',
        endereco: 'rua teste',
        id: 3
      }]
    });
  });

  route.post((req, res) => {
    if (!app.utils.validator.user(req, res)) return;

    db.insert(req.body, (err, user) => {
      if (err) return app.utils.error.send(err, req, res);

      res.status(201).json(user);
    });
  });

  routeId.get((req, res) => {
    db.findOne({ _id: req.params.id }, (err, user) => {
      if (err) return app.utils.error.send(err, req, res);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

      res.status(200).json(user);
    });
  });

  routeId.put((req, res) => {
    if (!app.utils.validator.user(req, res)) return;

    db.update({ _id: req.params.id }, req.body, {}, (err, updatedCount) => {
      if (err) return app.utils.error.send(err, req, res);
      if (!updatedCount) return res.status(404).json({ error: 'Usuário não encontrado.' });

      db.findOne({ _id: req.params.id }, (findErr, user) => {
        if (findErr) return app.utils.error.send(findErr, req, res);

        res.status(200).json(user);
      });
    });
  });

  routeId.delete((req, res) => {
    db.remove({ _id: req.params.id }, {}, (err, removedCount) => {
      if (err) return app.utils.error.send(err, req, res);
      if (!removedCount) return res.status(404).json({ error: 'Usuário não encontrado.' });

      res.status(200).json({ _id: req.params.id, deleted: true });
    });
  });
};
