// pages/entrance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  insideUse() {
    wx.setStorageSync('loginType', 'inside');
    wx.showLoading({
        title: '确认状态',
      }),
      wx.request({
        url: 'https://DOMAIN:5583/online',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data.code)
              if(res.data.code==undefined||res.data.code!=200){
                wx.hideLoading({
                  fail: (res) => {},
                }),
                wx.showToast({
                  title: '设备离线',
                  icon: 'none',
                  duration: 1500,
                  mask: true
                })
              }else{
                wx.hideLoading({
                  fail: (res) => {},
                })
                wx.navigateTo({
                  url: '../LANPrint/LANPrint',
                })
              }
        },
        fail: function (res) {
          wx.hideLoading({
            fail: (res) => {},
          }),
          wx.showToast({
            title: '设备离线',
            icon: 'none',
            duration: 1500,
            mask: true
          })
        }
      })
  },
})