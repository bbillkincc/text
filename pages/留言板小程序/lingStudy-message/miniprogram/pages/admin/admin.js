// pages/admin/admin.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      commentList: app.globalData.AllComment
    })
  },

  // 点击通过审核
  toreply(event){
		// console.log("点击了跳转事件：",event)
		let index = event.currentTarget.dataset.index
		app.globalData.commentItem = this.data.commentList[index]
    let param = {
      flag: true
    }
    // console.log("param:",replyparam)
    // 调用云函数修改作者回复
    wx.cloud.callFunction({
      name: "updatemessage",
      data: {
        dbName: "comment",
        param: param,
        filter:{
          _id: app.globalData.commentItem._id
        }
      }
    }).then( res => {
      console.log("审核通过：",res)
      wx.showToast({
        title: '通过审核成功！'
      })
      this.selectAllMessages()
    }).catch(console.error)
  },
  
  //查询（刷新）评论内容
	selectAllMessages(){
		wx.cloud.callFunction({
			name: "selectMessages",
			data: {
				dbName: "comment",
				filter: {
				},
			}
		}).then( res => {
			// console.log("云函数查询成功回调：",res)
			this.setData({
				commentList:res.result.data
			})
			app.globalData.AllComment = res.result.data
		})
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})