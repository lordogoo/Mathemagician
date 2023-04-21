const mode = require("./mode.js");

const testDatabase = {
    user: 'postgres',
    host: 'localhost',
    database: 'mathemagician',
    password: 'civ3ptwe',
    port: 5432
}


const prodDatabase = {
    user: 'mathemag_admin',
    host: 'localhost',
    database: 'mathemag_Mathemagician',
    password: 'Civ3ptwe@',
    port: 5432
}

if(mode.mode == "test"){
	module.exports = testDatabase;
}else if(mode.mode == "production"){
	module.exports = prodDatabase;
}