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
                            if (name === 'congty' || name === 'diachi' || name === 'ngaybatdau' || name === 'dienthoaiquanly' || name === 'chucvu' || name === 'vitricongviec') {
                                //buid table 1
                                var val = [].concat(row[name]).join(' / ');
                                strTextCongTy += "<td>" + val + "</td>";
                            } else {

                                if (name.match(/tuan.*/)) {
                                    //buid table 2
                                    var val = [].concat(row[name]).join(' / ');
                                    strTextBaoCao += "<li id="+name+">" + "<strong>" + name + "</strong>";
                                    strTextBaoCao += "<p>" + val + "</p>" + "</li>";
                                }
                            }
                        });


                    }
                    return;
                });
                document.querySelector('.js-loading').classList.add('is-hidden');
                strTextCongTy += "</tr></table>";
                strTextBaoCao += "</ul>";
                bootbox.alert({
                    message: strTextCongTy + strTextBaoCao,
                    size: 'large'
                });
                addClassnameTUAN();
            })
            .fail(function (err) {
                //
            });

    });


}

// $("#baocao p").sort(function(a, b) {
//     return parseInt(a.id) - parseInt(b.id);
//   }).each(function() {
//     var elem = $(this);
//     elem.remove();
//     $(elem).appendTo("#baocao");
//   });
function addClassnameTUAN() {
    // body...
    document.getElementById("tuan-mot").setAttribute("id", "1");
    document.getElementById("tuan-hai").setAttribute("id", "2");
    document.getElementById("tuan-ba").setAttribute("id", "3");
    document.getElementById("tuan-bon").setAttribute("id", "4");
    document.getElementById("tuan-nam").setAttribute("id", "5");
    document.getElementById("tuan-sau").setAttribute("id", "6");
    document.getElementById("tuan-bay").setAttribute("id", "7");
    document.getElementById("tuan-tam").setAttribute("id", "8");
    document.getElementById("tuan-chin").setAttribute("id", "9");
    document.getElementById("tuan-muoi").setAttribute("id", "10");
    document.getElementById("tuan-muoi-mot").setAttribute("id", "11");
    document.getElementById("tuan-muoi-hai").setAttribute("id", "12");
    $("#baocao li").sort(function (a, b) {
        return parseInt(a.id) - parseInt(b.id);
    }).each(function () {
        var elem = $(this);
        elem.remove();
        $(elem).appendTo("#baocao");
    });
}