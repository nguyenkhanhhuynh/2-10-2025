const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./routes/users');
const rolesRouter = require('./routes/roles');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);

// connect mongodb (bảo đảm mongo đang chạy)
const MONGO_URI = 'mongodb://localhost:27017/NNPTUD-S5';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connect error', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
