function phongToHinh(hinh, idHinh) {
    const hinhDuocPhongTo = document.getElementById('hinhDuocPhongTo')
    const xoayHinh = document.getElementById('xoayHinh')
    hinh = hinh.replace(/,/g, "\\")
    let taohinh = "<img id ='hinhDuocXoay' class='img-fluid' src='" + "\\\\" + hinh + "' width='800px' height='800px'>"
    hinhDuocPhongTo.innerHTML = taohinh
    xoayHinh.style.display = "block"
    var cacHinhDuocToDoKhiChon = document.querySelectorAll('ul img')
    for (var i = 0; i < cacHinhDuocToDoKhiChon.length; i++) {   
        cacHinhDuocToDoKhiChon[i].classList.remove("to-do-hinh-duoc-chon")
    }

    document.getElementById(idHinh).classList.add("to-do-hinh-duoc-chon")
}

window.onload = function() {
    const btnIn = document.getElementById('btnIn')
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



        var inAnh = window.open("", "", "height=250, width=250")
        inAnh.document.write("<html>")
        inAnh.document.write("<body>")
        let img = ''
        for (var i = 0; i < anhduocIn.length; i++) {
            img += "<img class='img-fluid' src ='" + anhduocIn[i] + "'/>"
        }
        vungIn.innerHTML = img
        inAnh.document.write(vungIn.innerHTML)
       
        inAnh.document.write('</body></html>')
        inAnh.document.close()
        inAnh.print() 
        inAnh.close()



        // let img = ''
        // for (var i = 0; i < anhduocIn.length; i++) {
        //     img += "<img class='img-fluid' src ='" + anhduocIn[i] + "'/>"
        // }
        // vungIn.innerHTML = img
        // console.log("lần thứ 1")
        //  let giaoDienBanDau = document.body.innerHTML
        //  document.body.innerHTML = vungIn.innerHTML
        //  window.print()
        //  document.body.innerHTML = giaoDienBanDau
        //  vungIn.innerHTML = ""
    })
}

