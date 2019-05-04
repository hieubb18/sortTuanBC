// Get the input field
var input = document.getElementById("inGVSDT");
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("btnDoGV").click();
    }
});

function stepGetGiangVien() {
    doLoading()
        .then(doGetGiangVien)
        .then(doComplete);
}

function stepGetSinhVien() {
    doLoading()
        .then(doGetSinhVien)
        .then(doComplete)
        .then(doShowUpdate);
}


function doLoading() {
    return new Promise(function (resolve, reject) {
        document.querySelector('.js-loading').classList.remove('is-hidden');
        resolve();
    });
}

function doGetGiangVien() {
    return new Promise(function (resolve, reject) {
        giangVienGet();
        resolve();
    });
}

function doComplete() {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            document.querySelector('.js-loading').classList.add('is-hidden');
        }, 1000);
        resolve();
    });
}

function giangVienGet() {

    var email = $.trim($("input[name='txtGVEmail']").val()).replace(/ /g, '');
    var sdt = $.trim($("input[name='txtGVSDT']").val()).replace(/ /g, '');

    var sdt1 = sdt.substring(1, sdt.length);

    if (email == '' || sdt == '') {
        alert("VUI LÒNG NHẬP ĐỦ THÔNG TIN EMAIL VÀ SỐ ĐIỆN THOẠI");
        return false;
    }

    $("#InfoGV").html("");
    $("#countHDGV").html("");

    var worksheets = [
        '', // defaults to first worksheet without id
        'ouab0ad'
    ];
    worksheets.forEach(function (worksheet) {
        $.googleSheetToJSON('1nO2nV65Vi3dZWGlaIOXLEc-_JWEZK16XFbjQVH_3Q0U', worksheet)
            .done(function (rows) {
                var strText = "<table class='dtable'>";
                strText += "<tr><th>Tên SV</th>  <th>Lớp</th>  <th>Mã SV</th>  <th>Ngành</th>  <th>Ngày sinh</th>   <th>Email SV</th>  <th>SĐT SV</th>  <th>Môn</th><th>Xem Báo Cáo</th> ";
                var count = 0;
                var newMaSV;
                rows.forEach(function (row) {
                    var strEmail = row['gvemail'].replace(/ /g, '');
                    var strDT = row['gvdienthoai'].replace(/ /g, '');
                    if (strEmail == email && (strDT == sdt || strDT == sdt1)) {
                        count++;
                        strText += "<tr>";

                        Object.getOwnPropertyNames(row).forEach(function (name) {

                            if (name == 'sotc' || name == 'tt' || name == 'gvhoten' || name == 'gvemail' || name == 'gvdienthoai' || name == 'mand' || name == 'nhom' || name == 'mamh' || name === 'congty' || name === 'diachi' || name === 'ngaybatdau' || name === 'dienthoaiquanly' || name === 'chucvu' || name === 'vitricongviec' || name.match(/tuan.*/))
                                return;
                            var val = [].concat(row[name]).join(' / ');
                            strText += "<td>" + val + "</td>";
                            if (name == "masv")
                                newMaSV = row[name];
                        });
                        strText += "<td><span onclick='xemBaoCao(" + newMaSV + ")' class='report_'>XEM BÁO CÁO</span></td>";
                        strText += "</tr>";
                    }
                });
                if (count == 0)
                    $("#InfoGV").html('Không tìm thấy thông tin');
                else {
                    $("#InfoGV").html(strText);
                    $("#countHDGV").html("<h2>SLHD: " + count + "</h2>");
                }
            })
            .fail(function (err) {
                // console.log('error!', err);
                // alert("LỖI DO MÁY CHỦ GOOGLE SHEET");                
            });
    });
}

function xemBaoCao(masv) {
    var worksheets = [
        '',
        'ouab0ad'
    ];
    strTextThongTinSV = "<div class='ten_mssv_sv'>" ;
    strTextThongTinSV += "<label class='lb_ttsv'>Thông tin sinh viên </label></br>";

    strTextCongTy = "<table class='dtable'>";
    strTextCongTy += "<tr><th>Công Ty</th>  <th>Địa chỉ</th>  <th>Ngày bắt đầu</th>  <th>ĐT Người quản lý</th>  <th>Chức Vụ</th>   <th>Vị trí công việc</th> ";

    strTextBaoCao = "<ul id='baocao'>";
    strTextCongTy += "<tr>";
    document.querySelector('.js-loading').classList.remove('is-hidden');
    worksheets.forEach(function (worksheet) {
        $.googleSheetToJSON('1nO2nV65Vi3dZWGlaIOXLEc-_JWEZK16XFbjQVH_3Q0U', worksheet)
            .done(function (rows) {
                rows.forEach(function (row) {
                    if (row["masv"] == masv) {
                        Object.getOwnPropertyNames(row).forEach(function (name) {
                            if(name === 'masv' ||  name === 'hoten')
                            {
                                var val = [].concat(row[name]).join(' / ');
                                strTextThongTinSV += "<span class='ttsv'>" + "<b>" + val + "</b>" + "</span> </br>";
                            }

                            if (name === 'congty' || name === 'diachi' || name === 'ngaybatdau' || name === 'dienthoaiquanly' || name === 'chucvu' || name === 'vitricongviec') {
                                //buid table 1
                                var val = [].concat(row[name]).join(' / ');
                                strTextCongTy += "<td>" + val + "</td>";
                            } else 
                            {
                                if (name.match(/tuan.*/)) {
                                    
                                    //buid table 2
                                    var val = [].concat(row[name]).join(' / ');
                                    strTextBaoCao += "<li id="+name+">" + "<strong id="+name+">" + name + "</strong>";
                                    strTextBaoCao += "<p>" + val + "</p>" + "</li>";

                                 
                                }
                            }
                        });


                    }
                    return;
                });
                document.querySelector('.js-loading').classList.add('is-hidden');
                strTextThongTinSV += "</div>";
                strTextCongTy += "</tr></table>";
                strTextThoiGian = "<table id='time-report-tuan' class='dtable' ><tr><th>Tuần báo cáo</th><th>Thời gian bắt đầu</th><th>Thời gian kết thúc</th></tr></table>";
                strTextBaoCao += "</ul>";
                bootbox.alert({
                    message: strTextThongTinSV + strTextCongTy + strTextThoiGian + strTextBaoCao,
                    size: 'large'
                });
                
                addClassnameTUAN();
                getTime();
            })
            .fail(function (err) {
                //
            });

    });


}

function addClassnameTUAN() {
    // body...

    var arrayChangeID = ['tuan-mot','tuan-hai','tuan-ba','tuan-bon','tuan-nam','tuan-sau','tuan-bay','tuan-tam','tuan-chin','tuan-muoi','tuan-muoi-mot','tuan-muoi-hai'];
    for (var i = 0; i<arrayChangeID.length ; i++)
    {
        document.getElementById(arrayChangeID[i]).setAttribute("id",i);

    }

    //tag id chuyen ve kieu so
    setTenTuan();
    $("#baocao li").sort(function (a, b) {
        return parseInt(a.id) - parseInt(b.id);
    }).each(function () {
        var elem = $(this);
        elem.remove();
        $(elem).appendTo("#baocao");
    });
}
function setTenTuan(){
    //Set ten tuan
    var weeks = new Array('Tuần 1:','Tuần 2:', 'Tuần 3:', 'Tuần 4:', 'Tuần 5:', 'Tuần 6:', 'Tuần 7:', 'Tuần 8:', 'Tuần 9:', 'Tuần 10:', 'Tuần 11:', 'Tuần 12:');
    var arrayStrongTagID = ['tuan-mot','tuan-hai','tuan-ba','tuan-bon','tuan-nam','tuan-sau','tuan-bay','tuan-tam','tuan-chin','tuan-muoi','tuan-muoi-mot','tuan-muoi-hai'];
    for( var i  =  0 ; i< weeks.length ; i++)
    {
        document.getElementById(arrayStrongTagID[i]).innerHTML = weeks[i];
    }
}

function getTime() {
    $("#thongtin_tuan").html('');
    var worksheets = [
    'Sheet3',
    '3'
    ];

    worksheets.forEach(function (worksheet) {
        $.googleSheetToJSON('1nO2nV65Vi3dZWGlaIOXLEc-_JWEZK16XFbjQVH_3Q0U', worksheet)
        .done(function (rows) {
            var ngayBatDau, soTuan;
            var count = 0;
            rows.forEach(function (row) {
                count++;
                Object.getOwnPropertyNames(row).forEach(function (name) {
                    if(name == 'ngaybatdau')
                        ngayBatDau = row[name];
                    else if(name == 'sotuanthuchien')
                        soTuan = row[name];
                });
                return;
            });
            if (count == 0) {
                $("#thongtin_tuan").html('Lỗi');
            } else {
                addThongtintuan(ngayBatDau, soTuan);
            }
        })
        .fail(function (err) {
            //
        });
    });
}


function addThongtintuan(ngayBatDau, soTuan){
    var thoiGianBatDau, thoiGianKetThuc;
    var thongTinTuan;
    var danhSachTuan = [];
    var parts = ngayBatDau.split('/');
    var ngayBatDau = new Date(parts[2], parts[1] - 1, parts[0]); 
    ngayBatDau = new Date(ngayBatDau.setDate(ngayBatDau.getDate()  - 7));
    for (var i = 0; i < soTuan; i++) {
        thongTinTuan = [];
        thongTinTuan.push("Tuần " + (i + 1));
        thoiGianBatDau = new Date(ngayBatDau.setDate(ngayBatDau.getDate() + 7));
        thongTinTuan.push("Từ "+thoiGianBatDau.toLocaleDateString('vi-VN'));
        thoiGianKetThuc = new Date(thoiGianBatDau.setDate(thoiGianBatDau.getDate() + 6));
        thongTinTuan.push("Đến "+thoiGianKetThuc.toLocaleDateString('vi-VN'));
        danhSachTuan.push(thongTinTuan);
    }
    var table = document.getElementById("time-report-tuan");
    for(var i = 0; i < danhSachTuan.length; i++)
    {
      var newRow = table.insertRow(table.length);
      for(var j = 0; j < danhSachTuan[i].length; j++)
      {
          var cell = newRow.insertCell(j);
          cell.innerHTML = danhSachTuan[i][j];
      }
  }
}