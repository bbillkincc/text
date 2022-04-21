//app.js

App({

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-9g9wryx7689debd3',
        traceUser: true
      })
    }

    this.selectOpenid();

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log("用户信息：",res)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        // console.log("系统状态栏信息：",e)
        //状态栏的高度，单位px
        this.globalData.StatusBar = e.statusBarHeight;
        // 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })

  },

  selectOpenid(){
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getOpenid',
      // 传给云函数的参数
      data: {
      },
      success(res) {
        // console.log("getOpenid云函数回调结果：:", res);
        if (res.result.openid == that.globalData.adminOpenid) {
          console.log("你是管理员！");
          that.globalData.adminFlag = true
        } else {
          console.warn("你不是管理员！");
        };
      },
      fail: err => {
        },
    })
  },

  globalData: {
    userInfo: null,
    AllComment:[],
    commentItem:{},
    // 管理员标志
    adminFlag: false,
    // 管理员OpenID
    adminOpenid: "wx4eb98d14f9b4ec21", 
  }

})
