/**
 * MongoDB URI
 * Link for database access
 */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27018/soundify-api';

const MONGO_BASE_URL = process.env.MONGO_BASE_URL || 'mongodb://localhost:27017/soundify-api/';

/**
 * MongoDB DBName
 * name of database
 */
const MONGODB_DBNAME = 'soundify-api';

/**
 * Mongo Client
 * get connection from database
 */
const MongoClient = require('mongodb').MongoClient;

/**
 * MD5
 * require the md5 lib for password
 */
const md5 = require('md5');

/**
 * Regex
 * used for check content of surname and lastname
 */
const regex = /[^a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'-]+$/u;

/**
 * Regex Email
 * used for check content of email
 */
const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/**
 * dateNow
 * get and format the current datetime
 */
function dateNow(){
    var dateNow = new Date();
    var day = dateNow.getDate();
    var month = dateNow.getMonth();
    var year = dateNow.getFullYear();
    var hour = dateNow.getHours();
    var minutes = dateNow.getMinutes();
    var seconds = dateNow.getSeconds();
    month += 1;
    const dateFormatted = formatDigits(day) + '/' + formatDigits(month) + '/' + year + ' ' + formatDigits(hour) + ':' + formatDigits(minutes) + ':' + formatDigits(seconds);
    return dateFormatted;
}

/**
 * formatDigits
 * add 0 when number < 10
 */
function formatDigits(number){
    if(number < 10) {
        number = ('0' + number);
    }
    return number;
}


module.exports = {
    MONGODB_URI,
    MONGODB_DBNAME,
    MONGO_BASE_URL,
    MongoClient,
    md5,
    regex,
    regexEmail,
    dateNow,
};
