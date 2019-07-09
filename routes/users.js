const {MONGODB_URI} = require('../tools');
const {MONGODB_DBNAME} = require('../tools');
const {md5} = require('../tools');
const {MongoClient} = require('../tools');
const ObjectId = require('mongodb').ObjectId;
const {regex} = require('../tools');
const {regexEmail} = require('../tools');
const {dateNow} = require('../tools')

var express = require('express');
var router = express.Router();
var MONGODB_COLLEC = 'users';

/**
 * @POST | CREATE User
 *
 * @Route("/signup")
 */
router.post('/signup', async function(req, res){
  const client = new MongoClient(MONGODB_URI);
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;

  client.connect()
      .then(async function(response){
        
        if(password.length < 4 || password.length > 50){
            res.status(400).send({error: 'Le mot de passe doit contenir entre 4 et 50 caractères'});
        }
        if (firstname.match(regex)) {
            res.status(400).send({error: 'Votre prénom ne doit pas contenir de caractères spéciaux'});
        }
        if (lastname.match(regex)) {
            res.status(400).send({error: 'Votre nom ne doit pas contenir de caractères spéciaux'});
        }
        if (firstname.length < 2 || firstname.length > 50) {
            res.status(400).send({error: 'Votre prénom doit contenir entre 2 et 50 caractères'});
        }
        if (lastname.length < 2 || lastname.length > 50) {
            res.status(400).send({error: 'Votre nom doit contenir entre 2 et 50 caractères'});
        }
        if (email.match(regexEmail) == null) {
            res.status(400).send({error: 'Votre email est invalide'});
        }
          const db = client.db(MONGODB_DBNAME);
          const userWithSameEmail = await db.collection(MONGODB_COLLEC).find({ email: req.body.email }).toArray();

          if(userWithSameEmail.length > 0){
              res.status(400).send({
                  error: 'Cet adresse email est déjà associée à un compte'
              });
          } else {
              const newUser = {
                  firstname: firstname,
                  lastname: lastname,
                  email: email,
                  password: md5(password),
                  createdAt: dateNow(),
              }
              await db.collection(MONGODB_COLLEC).insertOne(newUser);
              const userInDb = await db.collection(MONGODB_COLLEC).find({ email: email}).toArray();
              res.status(200).send({
                  token: userInDb,
                  error: null
              });
          }
          client.close();
      }).catch(function(error){
      res.status(500).send({
          error: error
      });
      client.close();
  });
});



/**
 * @POST | Connect User
 *
 * @Route("/signin")
 */
router.post('/signin', async (req, res) => {
  const client = new MongoClient(MONGODB_URI);
  const email = req.body.email;
  const password = req.body.password;

  client.connect()
      .then(async function(response){

          const db = client.db(MONGODB_DBNAME);
          const userInDb = await db.collection(MONGODB_COLLEC).find({ email: email,
              password: md5(password) }).toArray();
          if(userInDb.length === 0){
              res.status(400).send({
                  error: 'Cet identifiant est inconnu'
              });
          } else {
            res.status(200).send({
              error: null,
              _id: ObjectId(userInDb[0]._id),
              firstname: userInDb[0].firstname,
              lastname: userInDb[0].lastname,
              email: userInDb[0].email,
            });
          }
          client.close();
      }).catch(function(error){
      res.status(500).send({
          error: error
      });
  });
});


module.exports = router;
