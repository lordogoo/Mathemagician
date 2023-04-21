const mode = 0;
const modeList = ["test","production"];
const folderList = ["","/Mathemagician"];

const porthttp = 5000;
const porthttps = 5443;

const usePortOnWsConnection = [true,false]

const modeData = { mode: modeList[mode],folder: folderList[mode],portHTTP: porthttp,portHTTPS: porthttps,usePort: usePortOnWsConnection[mode]};
module.exports = modeData;