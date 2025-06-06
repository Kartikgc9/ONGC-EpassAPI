const bcrypt = require('bcrypt');

   const password = 'password123';
   const saltRounds = 10;

   bcrypt.hash(password, saltRounds, (err, hash) => {
     if (err) throw err;
     console.log('Generated hash for "password123":', hash);
   });