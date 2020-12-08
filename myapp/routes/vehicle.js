const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const car = require('../models/Car');
const clearCache = require('../services/cache')


router.get('/:prod/', (req, res) => {
  car.find({ prod: req.params.prod })
    // .cache(req.params.prod)
    .then((data) => {
      if (data) {
        res.json({ found: true, data: data })
      } else {
        res.json({ found: false, data: null })
      }
    })
    .catch((err) => {
      console.log(err)
      res.json({ found: false, data: null })
    })
})

router.post('/', (req, res) => {
  new car(req.body)
    .save()
    .then((v_data) => {
      res.json({ save: true })
      clearCache(v_data.prod)
    })
    .catch((err) => {
      console.log(err)
      res.json({ save: false })
    })
})


mongoose.connect(process.env.MONGOURL || 'mongodb://localhost:27017', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection
  .once('open', () => console.log('connected to database'))
  .on('error', (err) => console.log("connection to database failed!!", err))

module.exports = router;
