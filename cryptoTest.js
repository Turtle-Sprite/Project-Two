// encruyption is a two way process -- data is 'encrypted' using an algorithm and key
// you must know what the key is to decrypt or unscramble the data

//use crypto-js for encryption
const mySecret = "I eat cookies for breakfast"

const secretKey = 'myPassword'

//Advanced Encryption Standard algo
const crypto = require('crypto-js')

//String(100) allows us to use numbers as encrypted data, otherwise error
//change String(100) to mySecret and it will encrypt that data
const myEncryption = crypto.AES.encrypt(String(100), secretKey)
console.log(myEncryption.toString())

const decrypt = crypto.AES.decrypt(myEncryption.toString(), secretKey)
console.log(decrypt.toString(crypto.enc.Utf8))

// passwords in the database will be hashed
// hashing is a one way process, once data has been hashed you cannot unhash it
// hashing functions always return a hash of equal length regardless of input
// hashing functions always return the same output given the same input
const bcrypt = require('bcrypt')

const userPassword = '12345password'
//when user signs up, we want to hash their password and saveit in the db

const hashedPassword = bcrypt.hashSync(userPassword, 12) //the 12 takes a longer time to solve the hashes

//the only way you can hash a password is matching the hash
//userPassword = $2b$12$qSDiKPojH1PduomqXqjMM.xGtj3z8NtaP0o474ksVQE1jRLSd57ua //when hashed
console.log(hashedPassword)

//compare a string to our hash (user login)
//(firstUnhashedPassword, HashedPassword)
//true
console.log(bcrypt.compareSync(userPassword, hashedPassword))
//false
console.log(bcrypt.compareSync('wrong', hashedPassword))

//node js's built in crypto pack
const cryptoNode = require('crypto')

const hash = cryptoNode.createHash('sha256').update('a','utf8').digest()
console.log(hash.toString('hex'))