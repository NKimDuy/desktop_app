const fs = require('fs')
const path = require('path')
const { contextBridge } = require('electron')
const {jsPDF} = require('jspdf')

fs.readdir("\\\\10.0.3.232\\To_Ho_so_ho_so_dau_vao", (error, nhieuNam) => {
    for(const nam of nhieuNam){
        if(fs.existsSync(path.join("\\\\10.0.3.232\\To_Ho_so_ho_so_dau_vao", nam, "AG11231", "31120001"))) {
            if(fs.statSync(path.join("\\\\10.0.3.232\\To_Ho_so_ho_so_dau_vao", nam, "AG11231", "31120001")).isDirectory()) {
                console.log('phai thu muc')
            }
            else {
                console.log('khong phai thu muc')
            }
        }
        else {
            console.log('khong ton tai')
        }
    }
})