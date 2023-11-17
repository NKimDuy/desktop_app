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



