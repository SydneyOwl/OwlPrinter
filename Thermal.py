import io
import os
import queue
from escpos.printer import CupsPrinter
from PIL import Image
import time
from flask import Flask, request, jsonify
import traceback
import threading
import filetype
task = queue.Queue(-1)
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024 

class thermalPrintTool(CupsPrinter):
    def __init__(self, printer_name="XP-58IIH") -> None:
        super().__init__(printer_name)
        self.sysInfo = {}
        self.sensorAttach = {}

    def printTxt(self, txt):
        self._raw("{}\n".format(txt).encode('GB18030'))

    def imageImproved(self, source):
        RESIZE_WIDTH = 400
        im = Image.open(source)
        width = im.size[0]
        length = im.size[1]
        if width > length:
            im = im.transpose(Image.ROTATE_90)
            factor_resize = RESIZE_WIDTH/length
            im = im.resize((400, int(width*factor_resize)), Image.ANTIALIAS)
        else:
            factor_resize = RESIZE_WIDTH/width
            im = im.resize((400, int(length*factor_resize)), Image.ANTIALIAS)
        self.image(im)


@app.route("/online", methods=["POST"])
def isOnline():
    uslb = os.popen("lsusb")
    onXPP =  "0416:5011" in uslb.read()
    # onMFP = '1'
    uslb.close()
    if onXPP:
        return {"code": 200}
    return {"code":201}


@app.route("/upload", methods=["POST"])
def upload():
    flag = 0
    try:
        cups_conn = thermalPrintTool("ThermalPrinter")
        if request.method == 'POST':
            key = ""
            if "application/json" in request.content_type:
                dic = request.get_json()
                flag = 1
            else:
                dic = request.form.to_dict()
            if flag == 1 or "application/x-www-form-urlencoded" in request.content_type:
                strs = dic["file"]
                if len(strs) == 0 or len(strs) > 1000:
                    return jsonify({"code": 500})
                cups_conn.printTxt(strs+"\n\n")
                cups_conn.printTxt("Finish at {}. \n您所上传的内容将会在打印完成后以不可逆的形式删除\nOwlPrinter v1.0.1\n\n\n\n".format(
                            str(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))))
                # print...
                return jsonify({"code": 200})
            elif flag == 2 or "multipart/form-data" in request.content_type:
                img = request.files['file'].stream.read()
                fileTp = filetype.guess(img)
                if fileTp is None:return jsonify({"code": 500})
                if fileTp.extension not in ["jpg","png"]:return jsonify({"code":500})
                cups_conn.imageImproved(io.BytesIO(img))
                cups_conn.printTxt("\n\n")
                #print...
                cups_conn.printTxt("Finish at {}. \n您所上传的内容将会在打印完成后以不可逆的形式删除\nOwlPrinter v1.0.1\n\n\n\n".format(
                            str(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))))
                return jsonify({"code": 200})
            else:
                print("error。文件类型不受支持")
                return jsonify({"code": 500})
        else:
            if request.remote_addr == "127.0.0.1" or  not request.remote_addr.startswith("192.168"):
                return jsonify({"code": 404})
            return jsonify({"code": 500})
    except Exception as e:
        traceback.print_exc(e)
        return jsonify({"code": 500})
    finally:
        cups_conn.close()


def task_scanPrint():
    global se, tasklock, shine
    while 1:
        if not task.empty():
            while not task.empty():
                time.sleep(0.3)
                item = task.get()
                time.sleep(0.3)
                try:
                    cups_conn = thermalPrintTool("ThermalPrinter")  # Default CUPS printer
                    if item.type == "txt":
                        reader = ""
                        with open(item.filename, "r", encoding="utf-8") as f:
                            for line in f.readlines():
                                line = line.strip()+"\n"
                                reader += line
                        cups_conn.printTxt(reader+"\n\n")
                        cups_conn.printTxt("[LAN]UniquePID:{} \n task done @ {}.--MrOwl-----------------\n\n\n\n".format(
                            item.uuid, str(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))))
                    else:
                        cups_conn.imageImproved(item.filename)
                        cups_conn.printTxt("\n\n")
                        cups_conn.printTxt("[LAN]UniquePID:{} \n task done @ {}.-MrOwl------------------\n\n\n\n".format(
                            item.uuid, str(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))))
                    cups_conn.close()
                    os.remove(item.filename)
                except Exception as e:
                    logWriter(repr(e)+"--"+item.filename)
                    print(repr(e)+item.filename)
                time.sleep(2)
        shine = False
        time.sleep(1)


def logWriter(logme):
    print(logme)
threading.Thread(target=task_scanPrint).start()
app.run('0.0.0.0',port=5583,ssl_context=('CRT_PATH','KEY_PATH'))
