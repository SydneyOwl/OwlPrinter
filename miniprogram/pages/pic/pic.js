Page({
  data: {
    imgPath1: "../../resources/img/arrow.png",
    imgPath: "../../resources/img/default.png",
    height: 20,
    focus: false,
    currentIndex: 1
  },

  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  selectImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //res.tempFilePaths 返回图片本地文件路径列表
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imgPath: tempFilePaths[0],
          imgPath1: "../../resources/img/arrow1.png"
        })

      }
    })

  },
  previewImg: function (e) {
    var img = this.data.imgPath;
    // 设置预览图片路径
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },
  ok: function (e) {
    // 选中某个
    var that = this;
    that.setData({
      currentIndex: e.currentTarget.id
    })
  },
  loadImg: function () {
    var that = this;
    console.log(that.data.imgPath)
    if (that.data.imgPath == "../../resources/img/default.png") {
      wx.showToast({
        title: '请选择想要打印的图片',
        mask: true,
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '上传中...',
      })
      let route = "https://DOMAIN:5583/upload"
      wx.uploadFile({
        url: route,
        filePath: that.data.imgPath,
        name: "file",
        // 请求携带的额外form data
        header: {
          'Content-Type': "multipart/form-data"
        },
        success: function (res) {
          wx.hideLoading({
            success: (res) => { },
          });
          // console.log(res.data.code)
          if (res.data.includes('"code":200')) {
            let resp = "您可以继续打印其它照片"
            wx.showToast({
              title: "图像上传成功!",
              icon: "success",
              duration: 1500,
              mask: true
            });
          } else {
            if (res.data.includes("文件类型错误")) {
              wx.showToast({
                title: '文件类型不受支持,请上传以.png或.jpg为后缀的图片',
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
        fail: function (res) {
          wx.hideLoading({
            fail: (res) => { },
          });
          wx.showToast({
            title: "上传失败，请检查网络是否正常",
            icon: "none",
            duration: 1500,
            mask: true
          });
        }

      })
    }
  }

});