//把其他的json都导入到这个文件里面,这样导出json的时候只需要导这个文件就可以了
const contractAddresses = require("./contractAddresses.json")
const abi = require("./abi.json")

module.exports = {
    abi,
    contractAddresses,
}
