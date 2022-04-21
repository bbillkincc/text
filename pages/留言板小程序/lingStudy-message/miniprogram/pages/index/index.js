
const app = getApp();
// 评论倒计时
var countdown = 60;
let time = require('../../utils/time.js');
// 四个变量处理左滑关闭抽屉
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let timeII = 0;//从按下到松开共多少时间*100

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 管理员标志
    adminFlag: app.globalData.adminFlag,
		hasUserInfo: false,
		openid: 'wx4eb98d14f9b4ec21',
    adminOpenid: app.globalData.adminOpenid,
    Role: '游客',
    roleFlag: false,//是否是管理员，在抽屉进入后台管理时使用
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		topImg: "https://6c69-lingdu-test-n59r0-1300335304.tcb.qcloud.la/besidesApplets/updatelog.jpg?sign=642b8f448d4138bada01eb0050ddf02e&t=1598970069",
		// 评论区开关
		CommentSwitch: false,
		// 评论按钮
		CommentShow: false,
		ButtonTimer: '',//  发送评论按钮定时器
		LastTime: 60,
		title:'留言板标题',
		commentList:[{
			_id:4665,
			userUrl:'',
			Nickname:'',
			time:'',
			content:'',
			// 是否已审核通过
			flag:false,
			// 作者回复
			replyMessage:""
		}],
		// 输入框中的值（数据，用于评论成功后清除）
		commentValue:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getOpenid',
      // 传给云函数的参数
      data: {
      },
      success(res) {
        // console.log("getOpenid云函数回调结果：:", res);
        if (res.result.openid == app.globalData.adminOpenid) {
          // console.log("你是管理员！");
          that.setData({
						adminFlag:true
					})
        } else {
          // console.warn("你不是管理员！");
        };
      },
      fail: err => {
        },
    })
		
		// console.log("adminFlag:",app.globalData.adminFlag)

		//查询（刷新）评论内容
		this.selectAllMessages()

		// console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
          this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true,
          })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
            })
        }
      })
    }
	},

	getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo;
    // app.globalData.nickName = e.detail.userInfo.nickName;
    // app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
		});
		console.log("app.globalData.userInfo：",app.globalData.userInfo);
	},

	/**
	 * 用户输入的评论(bindinput事件)
	 */
	Comment: function (e) {
		// console.log("用户输入的评论：",e)
		var content = e.detail.value.replace(/\s+/g, '');
		this.setData({
			CommentContent: content,
		});
		// console.log("评论：",this.data.CommentContent)
	},
	

	// 发送（提交评论信息）
  CommentSubmit(){
    var that = this;
    if (!that.data.CommentContent) {
      wx.showToast({
        title: '评论内容不能为空！',
        icon: 'none',
        duration: 2000
      })
      // console.error("评论内容为空!");
    } else{
      that.setData({
        CommentShow: true,
      });
      that.data.ButtonTimer = setInterval(function () {
        if (countdown == 0) {
          that.setData({
            CommentShow: false,
          })
          countdown = 60;
          clearInterval(that.data.ButtonTimer);
          return;
        } else {
          that.setData({
            LastTime: countdown
          });
          // console.warn(countdown);
          countdown--;
        }
      }, 1000)
      // 持久化评论
      // 调用云函数修改文章
      // 时间戳
      var timestamp = Date.parse(new Date());
      // 评论参数
      let commentParam = {
				_id: timestamp,
        userURL: app.globalData.userInfo.avatarUrl,
        Nickname: app.globalData.userInfo.nickName,
        time: time.customFormatTime(timestamp,'Y-M-D'),
				content: that.data.CommentContent,
				// 是否已通过审核
				flag:false,
				// 作者回复
				replyMessage: ""
      }
      wx.cloud.callFunction({
        name: "addMessages",
        data: {
          dbName: "comment",
          param: commentParam
        }
      }).then( res => {
        // console.log("云函数插入评论成功回调：",res)
        // wx.showToast({
        //   title: "留言成功，审核通过即可显示！",
        //   duration: 2000
				// });
				wx.showModal({
					title: '提示',
					content: '留言成功，审核通过后即可显示！',
					showCancel: false,
					success(res){
						if (res.confirm) {
							console.log('用户点击确定')
						}
					}
				})
        // 清空输入框
        this.setData({
					commentValue: "",
					CommentContent: ""
				});
				//查询（刷新）评论内容
				this.selectAllMessages()
      })
    }
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
	
	CommentSubmitTips: function() {
    wx.showToast({
      title: this.data.LastTime + "s 后再次评论",
      icon: 'none',
      duration: 1000
    })
	},

	toreply(event){
		// console.log("点击了跳转事件：",event)
		let index = event.currentTarget.dataset.index
		app.globalData.commentItem = this.data.commentList[index]
    // console.log(app.globalData.commentItem)
    // 这里index参数没用到，可不传递
    wx.navigateTo({
      url: '../write/write?index='+index,
    })
	},


	// ==================抽屉=================
	// 显示抽屉
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 隐藏抽屉
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  // 触摸开始事件(通过判断手势滑动的方向，来关闭抽屉)
  touchStart: function (e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      timeII++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
		let touchMoveX = e.changedTouches[0].pageX;
		let touchMoveY = e.changedTouches[0].pageY;
		let tmX = touchMoveX - touchDotX;
		let tmY = touchMoveY - touchDotY;
		if (timeII < 20) {
				let absX = Math.abs(tmX);
				let absY = Math.abs(tmY);
				if (absX > 2 * absY) {
						if (tmX < 0) {
							console.log("向左滑动，关闭抽屉！")
							this.setData({
								modalName: null
							})
						} else {
							// console.log("向右滑动，不关闭抽屉！")
							this.setData({//显示抽屉
								modalName: "viewModal"
							})
						}
				}
				if (absY > absX * 2 && tmY < 0) {
						console.log("====上滑动=====")
				}
		}
		clearInterval(interval); // 清除计时器setInterval
		timeII = 0;//重置从按下到松开共多少时间*100
  },

  /**
  * 监听屏幕滚动 判断上下滚动
  */
  onPageScroll: function (event) {
    // console.log("屏幕滚动：",event)
    this.setData({
      scrollTop: event.detail.scrollTop
    })
	},
	
	/**
  * 加载更多
  */
 	loadMore: function () {

	},

	bindGetUserInfo (e) {
		console.log("点击了授权登录：",e)
		console.log(e.detail.userInfo)
	},
	// 关闭抽屉  （不是管理员点击后台时也关闭）
	shutDownDrawer: function (e) {
		this.setData({
				modalName: null
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
    this.selectAllMessages()

		if (app.globalData.userInfo) {
      this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log("callback之后：",res)
        // console.log("callback之后：",res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
							userInfo: res.userInfo,
							hasUserInfo: true
					})
				}
      })
    }

    var that = this;
    // 云函数调用
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getOpenid',
      // 传给云函数的参数
      data: {
      },
      success(res) {
        // console.log("CloudResult:", res);
        // console.log("openidCloudResult:", res.result.openid);
        that.setData({
          openid: res.result.openid
        });
        if (res.result.openid == that.data.adminOpenid) {
          app.globalData.roleFlag = true;
          that.setData({
            Role: '管理员',
          });
          if (app.globalData.userInfo) {
            that.setData({
              roleFlag: true,
            });
          }
          // console.warn("你是管理员！");
        } else {
          app.globalData.roleFlag = false;
          that.setData({
            Role: '游客',
            roleFlag: false,
          });
          // console.warn("你不是管理员！");
        };
      }
    })
    
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