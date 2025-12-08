
document.addEventListener('DOMContentLoaded', function() {
    const formDangKy = document.getElementById('form-dang-ky');
    
    if (formDangKy) {
        formDangKy.addEventListener('submit', xuLyDangKy);
    }
});

function xuLyDangKy(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-dang-ky').value;
    const matKhau = document.getElementById('mat-khau-dang-ky').value;
    const nhapLaiMatKhau = document.getElementById('nhap-lai-mat-khau').value;

    if (matKhau !== nhapLaiMatKhau) {
        hienThiThongBao('Mật khẩu nhập lại không khớp!', 'loi');
        return;
    }

    
    let nguoiDungs = JSON.parse(localStorage.getItem('fitlife_nguoi_dungs')) || [];

    
    if (nguoiDungs.find(u => u.email === email)) {
        hienThiThongBao('Email này đã được đăng ký!', 'loi');
        return;
    }

    
    const ten = email.split('@')[0];
    const id = 'USR' + Math.floor(1000 + Math.random() * 9000); 

    const nguoiDungMoi = {
        id: id,
        name: ten,
        email: email,
        password: matKhau,
        role: 'user' 
    };

    
    nguoiDungs.push(nguoiDungMoi);
    localStorage.setItem('fitlife_nguoi_dungs', JSON.stringify(nguoiDungs));

    hienThiThongBao('Đăng ký thành công! Vui lòng đăng nhập.', 'thanh-cong');
    
    
    setTimeout(() => {
        window.location.href = 'dn.html';
    }, 2000);
}


function hienThiThongBao(message, type = 'thong-tin') {
    
    const thongBao = document.createElement('div');
    thongBao.className = 'thong-bao';
    
   
    if (type === 'loi') {
        thongBao.classList.add('loi');
    } else if (type === 'thanh-cong') {
        thongBao.classList.add('thanh-cong');
    } else {
        thongBao.classList.add('thong-tin');
    }
    
    thongBao.textContent = message;
    
    document.body.appendChild(thongBao);
    
    
    setTimeout(() => {
        thongBao.classList.add('hien-thi');
    }, 100);
    
    
    setTimeout(() => {
        thongBao.classList.remove('hien-thi');
        setTimeout(() => {
            document.body.removeChild(thongBao);
        }, 300);
    }, 3000);
}



function layNguoiDungHienTai() {
    return JSON.parse(localStorage.getItem('nguoi_dung_hien_tai'));
}

