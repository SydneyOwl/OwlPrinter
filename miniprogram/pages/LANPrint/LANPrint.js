// pages/LANPrint/LANPrint.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  remindUsage(e) {
    wx.showModal({
      title: '提醒',
      content: '猫头鹰先生十分注重您的隐私：您的数据将在打印完成后以不可逆的形式删除；'
    })
  },
  goText() {
    wx.navigateTo({
      url: '../text/text',
    })
  },
  goPic() {
    wx.navigateTo({
      url: '../pic/pic',
    })
  }
})