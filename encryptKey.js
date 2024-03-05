const ethers = require('ethers')
const fs = require('fs-extra')
require('dotenv').config()

async function mian() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY) //创建一个wallet对象
  const encryptedJsonKey = await wallet.encrypt(
    //对私钥进行加密
    process.env.PRIVATE_KEY_PASSWORD, //添加一个password进行加密，解密的时候也需要这个
    process.env.PRIVATE_KEY
  )
  console.log(encryptedJsonKey)
  fs.writeFileSync('./.encryptedJsonKey.json', encryptedJsonKey)
}
mian()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
