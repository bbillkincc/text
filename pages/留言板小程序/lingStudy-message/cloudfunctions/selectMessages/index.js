// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let dbName = event.dbName
  let filter = event.filter ? event.filter : {}

  const countResult = await db.collection(dbName).where(filter).count()
  
  return db.collection(dbName).where(filter).get().then(res => {
    res.count = countResult
    return res;
  })
}