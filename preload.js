const fs = require('fs')
const path = require('path')
const { contextBridge } = require('electron')
const {jsPDF} = require('jspdf')
const fileSave = require('file-saver')
const gm = require('gm')
const { electron } = require('process')

//window.addEventListener('DOMContentLoaded', () => {
window.onload = function() {
    const btnTim = document.getElementById('btnTim') // nút tìm kiếm sinh viên
    const btnPdf = document.getElementById('btnPdf') // nút lưu ra file pdf
    const hienThanhQuaTrinh = document.getElementById('hienThanhQuaTrinh') // hiện thanh quá trình
    const bieuMauTimKiem = document.getElementById('bieuMauTimKiem') // form chứa thông tin tìm kiếm sinh viên
    const thongBao = document.getElementById('thongBao') // thông báo khi không tìm thấy sinh viên
    const hienThiHinhAnh = document.getElementById('hienThiHinhAnh') // hiển thị hình ảnh tìm được, khi tìm thấy sinh viên
    const hinhDuocPhongTo = document.getElementById('hinhDuocPhongTo') // khi nhấn vào hình sẽ được phóng to
    const btnXoayTrai = document.getElementById('btnXoayTrai')
    const btnXoayPhai = document.getElementById('btnXoayPhai')
    const btnXoayDuoi = document.getElementById('btnXoayDuoi')
    const btnKhongXoay = document.getElementById('btnKhongXoay')
    const btnIn = document.getElementById('btnIn')
    
    let mssv = document.getElementById('mssv') // thông tin mssv

    var luuHinhTimDuoc = [] // lưu tất cả hình của sinh viên khi tìm thấy
    var danhSachSinhVien = {}
    var tenFilePdf = '' // tên file pdf sẽ được xuất ra

    hienThiHinhAnh.innerHTML = ""
    hinhDuocPhongTo.innerHTML = ""
    const root = "\\\\10.0.3.231\\To_Ho_so_ho_so_dau_vao" // thư mục 231
    let nhieuNam = fs.readdirSync(root) // hiện các năm hiện có trong thư mục 231
    
    for(const nam of nhieuNam) {
        if(fs.statSync(path.join(root, nam)).isDirectory() && nam != 'THAM TRA') {
            let nhieuLop = fs.readdirSync(path.join(root, nam))
            let temp = ''
            for(const lop of nhieuLop) {
                let nhieuSv = fs.readdirSync(path.join(root, nam, lop))
                for(const sv of nhieuSv) {
                    danhSachSinhVien[sv] = root + ',' + nam + ',' + lop + ',' + sv
                }
            }
        }
    }
    
    hienThanhQuaTrinh.style.display = 'none'
    btnTim.addEventListener('click', (e) => {
        e.preventDefault()
        thongBao.innerHTML = ""
        bieuMauTimKiem.classList.add('disable-element') // khi nhấn nút tìm kiếm, sẽ không cho phép nhập thông tin tìm kiếm
        hienThiHinhAnh.classList.add('disable-element') // khi nhấn nút tìm kiếm, sẽ không cho phép nhấn vào 1 hình ảnh để phóng to    
      
        luuHinhTimDuoc = [] // lưu tất cả các hình tìm được vào 1 mảng để lưu dưới dạng file pdf
        
        tenFilePdf = mssv.value.toUpperCase()
       
        let demSv = 0
        let flag = false
        for(const [keySv, valueSv] of Object.entries(danhSachSinhVien)) {
            demSv += 1
            if (keySv == mssv.value.toUpperCase()) {
                flag = true;
                let valueSv = danhSachSinhVien[keySv].split(',')

                let hinhSinhVien = fs.readdirSync(path.join(valueSv[0], valueSv[1], valueSv[2], valueSv[3]))
                let dsHinh = ""
                let i = 1
                for(let hinh of hinhSinhVien) {
                    if(hinh.substring(hinh.length - 3) == 'jpg') {
                        let hinhHienThi = path.join(valueSv[0], valueSv[1], valueSv[2], valueSv[3], hinh)
                        duongDanHinh = ["10.0.3.231", "To_Ho_so_ho_so_dau_vao", valueSv[1], valueSv[2], valueSv[3], hinh]

                        //dsHinh += "<li onclick='phongToHinh(" + '"' + duongDanHinh + '"' + ")'>" + "<img class='img-fluid' src='" + hinhHienThi + "' width='200px' height='200px'>" + "</li>"
                        
                        dsHinh += "<li>" + "<input class='check' type='checkbox' value = '" + hinhHienThi + "'>" + "<img id=" + i + " onclick='phongToHinh(" + '"' + duongDanHinh + '", "' + i + '"' + ")' class='img-fluid' src='" + hinhHienThi + "' width='200px' height='200px'>" + "</li>"
                        i += 1
                        luuHinhTimDuoc.push(hinhHienThi)
                    }
                }
                hienThiHinhAnh.innerHTML = dsHinh
                btnPdf.style.display = 'block' // hiện nút lưu dưới dạng pdf
                bieuMauTimKiem.classList.remove('disable-element')
                hienThiHinhAnh.classList.remove('disable-element')
                break
               
            }
        }
        if(demSv == Object.keys(danhSachSinhVien).length && !flag) {
            hienThiHinhAnh.innerHTML = ''
            thongBao.innerHTML = "Không tìm thấy sinh viên"
            bieuMauTimKiem.classList.remove('disable-element')
            hienThiHinhAnh.classList.remove('disable-element')
        }
    })

    async function xuLyhinhAnh(src) {
        return new Promise((resolve, reject) => {
          let img = new Image();
          img.src = src;
          img.onload = () => resolve(img)
          img.onerror = reject
        })
    }

    async function taoFilePdf(imageUrls) {
        const doc = new jsPDF()
        const width = doc.internal.pageSize.getWidth()
        const height = doc.internal.pageSize.getHeight()
        for (const [i, url] of imageUrls.entries()) {
            const image = await xuLyhinhAnh(url)
            doc.addImage(image, "JPEG", 0, 0, width, height)
            if (i !== imageUrls.length - 1) {
                doc.addPage()
            }
        }
        return doc
    }

    async function luuPdf() {

        let anhXuatRaPdf = [] // ảnh sẽ xuất ra file pdf
        let anhDuocChon = [] // ảnh được người dùng chọn
        var inputs = document.querySelectorAll('input:checked') // chọn tất cả các checkbox đang được chọn
        for (var i = 0; i < inputs.length; i++) {   
            if(inputs[i].checked == true)
            anhDuocChon.push(inputs[i].value)
        }   
        if(anhDuocChon.length != 0)
            anhXuatRaPdf = anhDuocChon
        else
            anhXuatRaPdf = luuHinhTimDuoc
        const multiPng = await taoFilePdf(anhXuatRaPdf)
        
        // save PDF (blocked in iFrame in chrome)

        var file = new File([multiPng.output("blob", "hinh.pdf")], tenFilePdf + ".pdf", {type: "application/pdf;charset=utf-8"})
        fileSave.saveAs(file)
    }

    btnPdf.addEventListener('click', (e) => {
        e.preventDefault()
        luuPdf()
    })

    btnXoayTrai.addEventListener('click', (e) => {
        let hinhDuocXoay = document.getElementById('hinhDuocXoay')
        hinhDuocXoay.removeAttribute("class")
        hinhDuocXoay.classList.add('rotate-left')
    })
    
    btnXoayPhai.addEventListener('click', (e) => {
        let hinhDuocXoay = document.getElementById('hinhDuocXoay')
        hinhDuocXoay.removeAttribute("class")
        hinhDuocXoay.classList.add('rotate-right')
    })

    btnXoayDuoi.addEventListener('click', (e) => {
        let hinhDuocXoay = document.getElementById('hinhDuocXoay')
        hinhDuocXoay.removeAttribute("class")
        hinhDuocXoay.classList.add('rotate-bottom')
    })

    btnKhongXoay.addEventListener('click', (e) => {
        let hinhDuocXoay = document.getElementById('hinhDuocXoay')
        hinhDuocXoay.removeAttribute("class")
    })

    btnIn.addEventListener('click', (e) => {
        let anhduocIn = [] // ảnh sẽ xuất ra file pdf
        let anhDuocChon = [] // ảnh được người dùng chọn
        luuHinhTimDuoc = []
        var tatCaHinh = document.querySelectorAll('input[type="checkbox"]') // chọn tất cả các checkbox đang được chọn
        var chonHinh = document.querySelectorAll('input:checked')
        var vungIn = document.getElementById('vungIn')

        for (var i = 0; i < tatCaHinh.length; i++) {   
            luuHinhTimDuoc.push(tatCaHinh[i].value)
        }   

        for (var i = 0; i < chonHinh.length; i++) {   
            if(chonHinh[i].checked == true)
            anhDuocChon.push(chonHinh[i].value)
        }   

        if(anhDuocChon.length != 0)
            
            anhduocIn = anhDuocChon
        else
            anhduocIn = luuHinhTimDuoc

        let img = ''
        for (var i = 0; i < anhduocIn.length; i++) {
            //img += "<img class='img-fluid' src ='" + anhduocIn[i] + "'/>"
            //img += anhduocIn[i]
            img += "<div>duy</div>"
            console.log(anhduocIn[i])
        }

        var inAnh = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')
        inAnh.document.write(img)
        inAnh.document.close()
        inAnh.focus()
        inAnh.print()
        inAnh.close()


        // let img = ''
        // for (var i = 0; i < anhduocIn.length; i++) {
        //     img += "<img class='img-fluid' src ='" + anhduocIn[i] + "'/>"
        // }
        // vungIn.innerHTML = img
        //  let giaoDienBanDau = document.body.innerHTML
        //  document.body.innerHTML = vungIn.innerHTML
        //  window.print()
        //  document.body.innerHTML = giaoDienBanDau
        //  vungIn.innerHTML = ""
    })

//})
};