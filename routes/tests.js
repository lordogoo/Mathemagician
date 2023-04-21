var express = require('express');
var router = express.Router();
const querystring = require("querystring");
const { v4: uuidv4 } = require("uuid");

router.get('/', function(req, res, next) {
	res.render('test/testlist');
});

/*****************************
double negative
******************************/
router.get('/ruledoublenegativetests', function(req, res, next) {
	res.render('test/ruledoublenegativetests');
});

router.get('/performdoublenegativetests', function(req, res, next) {
	res.render('test/performdoublenegativetests');
});

/*****************************
stm negative
******************************/
//todo
/*****************************
communative rule
******************************/
//todo
/*****************************
addition
******************************/
router.get('/ruleadditiontests', function(req, res, next) {
	res.render('test/ruleadditiontests');
});

router.get('/performadditiontests', function(req, res, next) {
	res.render('test/performadditiontests');
});

/*****************************
subtraction
******************************/
router.get('/rulesubtractiontests', function(req, res, next) {
	res.render('test/rulesubtractiontests');
});

router.get('/performsubtractiontests', function(req, res, next) {
	res.render('test/performsubtractiontests');
});

/*****************************
multiply
******************************/
router.get('/rulemultiplytests', function(req, res, next) {
	res.render('test/rulemultiplytests');
});

router.get('/performmultiplytests', function(req, res, next) {
	res.render('test/performmultiplytests');
});

/*****************************
division
******************************/
router.get('/ruledividetests', function(req, res, next) {
	res.render('test/ruledividetests');
});

router.get('/performdividetests', function(req, res, next) {
	res.render('test/performdividetests');
});

/*****************************
exponent
******************************/
router.get('/ruleexponenttests', function(req, res, next) {
	res.render('test/ruleexponenttests');
});

router.get('/performexponenttests', function(req, res, next) {
	res.render('test/performexponenttests');
});

module.exports = router;