
document.addEventListener('DOMContentLoaded', function() {
    const formDangNhap = document.getElementById('form-dang-nhap');
    const nutQuenMk = document.getElementById('nut-quen-mk');
    
    if (formDangNhap) {
        formDangNhap.addEventListener('submit', xuLyDangNhap);
    }
    
    if (nutQuenMk) {
        nutQuenMk.addEventListener('click', function(e) {
            e.preventDefault();
            hienThiFormQuenMatKhau();
        });
    }
});

function xuLyDangNhap(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const matKhau = document.getElementById('mat-khau').value;
    
    
    let nguoiDungs = JSON.parse(localStorage.getItem('fitlife_nguoi_dungs'));
    
   
    


    
    const nguoiDung = nguoiDungs.find(u => u.email === email && u.password === matKhau);

    if (nguoiDung) {
       
        localStorage.setItem('nguoi_dung_hien_tai', JSON.stringify(nguoiDung));
        
        
        if (nguoiDung.role === 'admin') {
            window.location.href = 'admin.html';
        } else if (nguoiDung.role === 'manager') {
            window.location.href = 'quan_ly.html';
        } else {
            window.location.href = 'nguoi_dung.html';
        }
    } else {
        
        hienThiThongBao('Email hoặc mật khẩu không chính xác!', 'loi');
    }
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




function hienThiFormQuenMatKhau() {
   
    const formQuenMk = document.createElement('div');
    formQuenMk.className = 'form-quen-mk';
    formQuenMk.innerHTML = `
        <div class="khung-form-quen-mk">
            <div class="tieu-de-quen-mk">
                <h3>Quên mật khẩu</h3>
                <button class="nut-dong-form">&times</button>
            </div>
            <div class="noi-dung-quen-mk">
                <p>Nhập email và mật khẩu mới của bạn</p>
                <form id="form-dat-lai-mk">
                    <div class="nhom-input">
                        <label for="email-quen-mk">Email</label>
                        <input type="email" id="email-quen-mk" placeholder="example@email.com" required>
                    </div>
                    <div class="nhom-input">
                        <label for="mat-khau-moi">Mật khẩu mới</label>
                        <input type="password" id="mat-khau-moi" placeholder="Nhập mật khẩu mới" required>
                    </div>
                    <button type="submit" class="nut-gui">Xác nhận</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(formQuenMk);
    
    
    const nutDongForm = formQuenMk.querySelector('.nut-dong-form');
    nutDongForm.addEventListener('click', function() {
        document.body.removeChild(formQuenMk);
    });

    
    const formDatLaiMk = document.getElementById('form-dat-lai-mk');
    formDatLaiMk.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailQuenMk = document.getElementById('email-quen-mk').value.trim();
        const matKhauMoi = document.getElementById('mat-khau-moi').value;
        
        
        let nguoiDungs = JSON.parse(localStorage.getItem('fitlife_nguoi_dungs')) || [];
        
        
        const nguoiDungCanTim = nguoiDungs.find(u => u.email === emailQuenMk);
        
        
        if (!nguoiDungCanTim) {
            hienThiThongBao('Email không tồn tại trong hệ thống!', 'loi');
            return;
        }
        
        
        if (nguoiDungCanTim.role === 'admin' || nguoiDungCanTim.role === 'manager') {
            hienThiThongBao('Tài khoản này không được phép đổi mật khẩu bằng chức năng này. Vui lòng liên hệ Admin.', 'loi');
            return;
        }
        
        
        const nguoiDungIndex = nguoiDungs.findIndex(u => u.email === emailQuenMk);
        nguoiDungs[nguoiDungIndex].password = matKhauMoi;
        
        
        localStorage.setItem('fitlife_nguoi_dungs', JSON.stringify(nguoiDungs));
        
        
        hienThiThongBao('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', 'thanh-cong');
        
        
        const emailInput = document.getElementById('email');
        const matKhauInput = document.getElementById('mat-khau');
        if (emailInput) emailInput.value = emailQuenMk;
        if (matKhauInput) matKhauInput.value = matKhauMoi;
        
        
        setTimeout(function() {
            document.body.removeChild(formQuenMk);
        }, 2000);
    });
}


function layNguoiDungHienTai() {
    return JSON.parse(localStorage.getItem('nguoi_dung_hien_tai'));
}


