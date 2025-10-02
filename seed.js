const mongoose = require('mongoose');
const Role = require('./models/role');

mongoose.connect('mongodb://localhost:27017/NNPTUD-S5')
  .then(async ()=> {
    await Role.deleteMany({});
    await Role.create([{ name: 'Admin', description:'Administrator' }, { name:'User', description:'Normal user' }]);
    console.log('Seeded roles');
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
