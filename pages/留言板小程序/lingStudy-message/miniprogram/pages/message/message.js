// pages/message/message.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},//用户信息
    hasUserInfo: false,
    //判断小程序的组件在当前版本是否可用
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    messages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // this.getUserInfo();
    var that = this;
    console.log(options)
    // console.log("留言页面的公众号编号为:" + options.g_id)
    // that.setData({
    //   title: options.title,
    //   no: options.no,
    //   g_id: options.g_id
    // })

    // 如果获取到用户信息就存储
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('username', that.data.userInfo.nickName)
      wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
      console.log("在index页面全局app1中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log("用户名2：" + res.userInfo.nickName + " " + res.userInfo.avatarUrl)
        // wx.setStorageSync('username', res.userInfo.nickName)
        // wx.setStorageSync('headpath', res.userInfo.avatarUrl)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('username', that.data.userInfo.nickName)
        wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
        console.log("在index页面全局app2中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
      }
    } else {
      // 没有获取到用户信息就发起授权窗口
      wx.getUserInfo({
        success: res => {
          // console.log("用户名3：" + res.userInfo.nickName + " " + res.userInfo.avatarUrl)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorageSync('username', that.data.userInfo.nickName)
          wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
          console.log("在index页面全局app3中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
        },
      })
    }

  },

  //授权弹窗
  //点击按钮授权
  getUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {//用户信息
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('username', that.data.userInfo.nickName)
      wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
      console.log("在message页面临时授权中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
      wx.showToast({
        title: '授权成功',
        icon:"success"
      })
      // wx.showLoading({
      //   title:"下载中..."
      // })
      // wx.hideLoading()
    } else {
      console.log('用户取消授权');
      return;
    }
  },

  // 写留言
  writemessage:function(e){
    wx: wx.navigateTo({
      url: '../write/write',
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