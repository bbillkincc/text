// pages/write/write.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    commentItem:{},
    nickName: '',
    replyContent: '',//留言本文域信息
    messagesnull: ''//清空文本域内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("上一个页面传过来的参数：",options)

    this.setData({
      commentItem: app.globalData.commentItem,
      nickName: wx.getStorageSync('username')
    })

    // this.setData({
    //   // avatarUrl: wx.getStorageSync('headpath'),
    //   title: options.title,
    //   _id: options._id
    // })

  },


  // 输入框 bindinput='getMessages'
  //获取留言本文域信息
  getMessages:function(e){
    // console.log(e.detail.value)
    this.setData({
      replyContent:e.detail.value
    })
  },

  // 点击提交留言
  postMessage:function(){
    //获取留言
    var that = this;
    // console.log("提交的留言信息为："+this.data.messages)
    if (that.data.replyContent === ""){
      wx: wx.showToast({
        title: '请输入回复内容...',
        icon: 'none',
      })
    }else{
      let replyparam = {
        replyMessage: this.data.replyContent
      }
      // console.log("param:",replyparam)
      // 调用云函数修改作者回复
      wx.cloud.callFunction({
        name: "updatemessage",
        data: {
          dbName: "comment",
          param: replyparam,
          filter:{
            _id: this.data.commentItem._id
          }
        }
      }).then( res => {
        // console.log("回复成功：",res)
        this.setData({
          messagesnull: '',//清空文本域
          replyContent: ''
        })
        wx.showToast({
          title: '回复成功！',
          // icon:"success"
        })
        wx.navigateTo({
          url: '../index/index',
        })
      }).catch(console.error)
    }
    
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