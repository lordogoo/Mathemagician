const mode = require("./mode.js");

const testDatabase = {
    user: 'root',
    host: 'localhost',
    database: 'mathemagician',
    password: 'Civ3ptwe',
    //port: 3306,
    createDatabaseTable: true
}


const prodDatabase = {
    //user: 'mathemag_admin',
    user: 'lordogoo_mathmag',
    host: 'localhost',
    //database: 'mathemag_Mathemagician',
    database: 'lordogoo_Mathemagician',
    password: 'Civ3ptwe',
    //port: 3306,
    createDatabaseTable: true
}

if(mode.mode == "test"){
	module.exports = testDatabase;
}else if(mode.mode == "production"){
	module.exports = prodDatabase;
}