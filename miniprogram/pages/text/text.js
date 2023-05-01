Page({
  data: {
    height: 20,
    focus: false,
    currentIndex: 1
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },
  ok: function (e) {
    // 选中某个
    var that = this;
    that.setData({
      currentIndex: e.currentTarget.id
    })
  },
  bindFormSubmit: function (e) {
    wx.showLoading({
      title: '上传中...',
    })
    let geCloud
    var route = "https://DOMAIN:5583/upload"
    wx.request({
      url: route,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {file: e.detail.value.textarea},
      success: function (res) {
        wx.hideLoading({
          success: (res) => {},
        })
        if (res.data.code == 200) {
          var resp = "您可以继续打印其它文本"
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 1500,
            mask: true,
          });
        } else {
          if (res.data.code==500) {
            wx.showToast({
              title: '输入不能为空或超出1000字符！',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '服务器坏了。请你告诉Mr.Owl！',
              icon: 'none',
              duration: 5000
            })
          };
        }
      },
      fail: function (error) { //}
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '服务器坏了。请你告诉Mr.Owl！',
          icon: 'none',
          duration: 5000
        });
      }
    })
  }
})