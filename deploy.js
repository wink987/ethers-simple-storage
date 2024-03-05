const ethers = require("ethers") //ethers的作用是调用合约接口,solc的作用是编译solidity语言
const fs = require("fs-extra") //fs-extra 是 Node.js 的一个模块，提供了比 Node.js 内置的 fs 模块更多的功能和便利的文件系统操作方法
require("dotenv").config() //引入dotenv，可以访问环境变量中的私钥
async function mian() {
    //Ganache本地区块链的地址：HTTP://172.18.32.1:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL) //连接本地区块链,RPC是远程过程调用（Remote Procedure Call）
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider) //用process.env.PRIVATE_KEY代替私钥,".env"存放不想公布的隐私数据
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8") //获取abi
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet) //部署合约并与ganache的钱包相连
    console.log("Deploying ,please wait......")
    const contract = await contractFactory.deploy({ gasPrice: 10000000000 }) //等待合约布置完成
    await contract.deployTransaction.wait(1) //将合约布置到一个区块上,完成时
    console.log(`Contract address: ${contract.address}`)
    /*
    console.log("here is the deployTransaction");//这个在创建交易时就有了
    console.log(contract.deployTransaction);
    console.log(transactionReceipt);//输出区块的各种信息
    const transactionReceipt  =  await contract.deployTransaction.wait(1);//将合约布置到一个区块上,完成时，const transactionReceipt可以省略
    console.log("here is the transaction receipt");//deploymentReceipt只有在合约部署完成后才有 
    
  */
    const currentFavoritenumber = await contract.retrieve()
    //console.log(currentFavoritenumber);//若不将数字转为字符，ethers没法直接输出数字，而输出：BigNumber { _hex: '0x00', _isBigNumber: true }
    console.log(
        `Current Favorite number is :  ${currentFavoritenumber.toString()}`
    )
    const transactionResponse = await contract.store("25") //合约的调用，调用store函数
    const transactionReceipt = await transactionResponse.wait(1) //确保将合约已经布置到一个区块上
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(
        `updated  Favorite  Number is : ${updatedFavoriteNumber.toString()}`
    )
}
mian()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
