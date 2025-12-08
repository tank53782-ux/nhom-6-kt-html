
function layNguoiDungHienTai() {
    return JSON.parse(localStorage.getItem('nguoi_dung_hien_tai'));
}


function hienThiTrang(trangId) {
    
    const trangElements = document.querySelectorAll('.page-content');
    trangElements.forEach(element => {
        element.classList.add('hidden');
    });
    
    
    const trangHienTai = document.getElementById(trangId);
    if (trangHienTai) {
        trangHienTai.classList.remove('hidden');
    }
    
    
    const mobileTitle = document.getElementById('mobile-title');
    if (mobileTitle) {
        const titles = {
            'trang-chu': 'Trang chủ',
            'video': 'Video',
            'lo-trinh': 'Lộ trình cá nhân',
            'thong-bao': 'Thông báo',
            'gop-y': 'Góp ý',
            'ho-so': 'Hồ sơ cá nhân'
        };
        mobileTitle.textContent = titles[trangId] || 'FitLife VN';
    }
    
   
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="#${trangId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    
    if (window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar && overlay) {
            sidebar.classList.add('hidden');
            sidebar.classList.remove('flex', 'absolute', 'inset-y-0', 'left-0');
            overlay.classList.add('hidden');
        }
    }
}


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        sidebar.classList.add('flex', 'absolute', 'inset-y-0', 'left-0');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('flex', 'absolute', 'inset-y-0', 'left-0');
        overlay.classList.add('hidden');
    }
}


function checkUserPermissions() {
    const addVideoBtn = document.getElementById('add-video-btn');
    if (addVideoBtn) {
        
        const nguoiDungHienTai = layNguoiDungHienTai();
        
        
        if (nguoiDungHienTai && (nguoiDungHienTai.role === 'admin' || nguoiDungHienTai.role === 'manager')) {
            addVideoBtn.classList.remove('hidden'); 
        } else {
            addVideoBtn.classList.add('hidden'); 
        }
    }
}

function filterVideos(category, btn) {
    
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');

    
    const videos = document.querySelectorAll('.video-card');
    videos.forEach(video => {
        if (category === 'all' || video.getAttribute('data-category') === category) {
            video.style.display = 'block';
        } else {
            video.style.display = 'none';
        }
    });
}


function toggleModal(modalID) {
    const modal = document.getElementById(modalID);
    if (modal.classList.contains('hidden-modal')) {
        modal.classList.remove('hidden-modal');
        modal.classList.add('visible-modal');
        document.body.style.overflow = 'hidden'; 
    } else {
        modal.classList.remove('visible-modal');
        modal.classList.add('hidden-modal');
        document.body.style.overflow = '';
    }
}

function saveNewVideo(event) {
    event.preventDefault();
    hienThiThongBao('Video mới đã được thêm thành công! (Mô phỏng)', 'thanh-cong');
    toggleModal('video-modal');
}

// LỘ TRÌNH cá nhân 
function luuLichTrinh() {
    hienThiThongBao('Đã lưu lộ trình! ', 'thanh-cong');
}

function luuTatCa() {
    hienThiThongBao('Đã lưu tất cả thông tin! ', 'thanh-cong');
}

// GÓP Ý 
function xuLyGuiGopY(event) {
    event.preventDefault();
    
    
    const form = document.getElementById('gop-y-form');
    const chuDe = form.querySelector('select').value;
    const tieuDe = form.querySelector('input[type="text"]').value;
    const noiDung = form.querySelector('textarea').value;
    
    
    const nguoiDungHienTai = layNguoiDungHienTai();
    
    
    const gopY = {
        id: '#' + Math.floor(1000 + Math.random() * 9000),
        nguoiDung: nguoiDungHienTai ? nguoiDungHienTai.email : 'Khách vãng lai',
        chuDe: chuDe,
        tieuDe: tieuDe,
        noiDung: noiDung,
        ngayTao: new Date().toISOString(),
        trangThai: 'chua_xem'
    };
    
    
    let danhSachGopY = JSON.parse(localStorage.getItem('fitlife_gop_y')) || [];
    danhSachGopY.push(gopY);
    localStorage.setItem('fitlife_gop_y', JSON.stringify(danhSachGopY));
    
    
    hienThiThongBao('Cảm ơn bạn đã gửi góp ý! Chúng tôi sẽ xem xét và phản hồi sớm nhất.', 'thanh-cong');
    
    
    form.reset();
}

// HỒ SƠ cá nhân 
function xuLyLuuHoSo(event) {
    event.preventDefault();
    
    // Lấy giá trị từ form
    const hoVaTen = document.getElementById('ho-va-ten').value;
    const chieuCao = document.getElementById('chieu-cao').value;
    const canNang = document.getElementById('can-nang').value;
    
    // Kiểm tra dữ liệu hợp lệ
    if (!hoVaTen.trim()) {
        hienThiThongBao('Vui lòng nhập họ và tên!', 'loi');
        return;
    }
    
    if (chieuCao < 100 || chieuCao > 250) {
        hienThiThongBao('Chiều cao phải từ 100cm đến 250cm!', 'loi');
        return;
    }
    
    if (canNang < 30 || canNang > 200) {
        hienThiThongBao('Cân nặng phải từ 30kg đến 200kg!', 'loi');
        return;
    }

    // TÍCH HỢP PHẦN TÍNH TOÁN BỊ THIẾU
    const chieuCaoM = chieuCao / 100;
    const bmi = (canNang / (chieuCaoM * chieuCaoM)).toFixed(1);
    let phanLoai = '';
    if (bmi < 18.5) {
        phanLoai = 'Gầy';
    } else if (bmi < 24.9) {
        phanLoai = 'Bình thường';
    } else if (bmi < 29.9) {
        phanLoai = 'Hơi béo';
    } else {
        phanLoai = 'Béo phì';
    }
    
    // Hiển thị thông báo thành công
    hienThiThongBao(`Đã cập nhật hồ sơ thành công!\n\nThông tin đã cập nhật:\n- Họ tên: ${hoVaTen}\n- Chiều cao: ${chieuCao}cm\n- Cân nặng: ${canNang}kg\n- Chỉ số BMI: ${bmi}\n- Phân loại: ${phanLoai}`, 'thanh-cong');
    
    // Cập nhật tên người dùng ở các vị trí khác
    const tenNguoiDungElements = document.querySelectorAll('.user-name, .user-name-large');
    tenNguoiDungElements.forEach(element => {
        element.textContent = hoVaTen;
    });
    
    // Cập nhật ảnh đại diện
    const anhDaiDienElements = document.querySelectorAll('.user-avatar, .mobile-avatar, .avatar-large');
    anhDaiDienElements.forEach(element => {
        element.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hoVaTen)}&background=4ADE80&color=fff&size=${element.classList.contains('avatar-large') ? '128' : element.classList.contains('mobile-avatar') ? '32' : '40'}`;
    });
}

function xuLyChinhSuaAnh() {
    hienThiThongBao('Tính năng thay đổi ảnh đại diện sẽ được cập nhật trong phiên bản tiếp theo!', 'thong-tin');
}

// chức năng tiện ích 
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

function dangXuat() {
    localStorage.removeItem('nguoi_dung_hien_tai');
    window.location.href = 'dn.html';
}

// cập nhật hồ sơ 
document.addEventListener('DOMContentLoaded', () => {
    
    const nguoiDungHienTai = layNguoiDungHienTai();
    if (nguoiDungHienTai) {
        
        const hoVaTenInput = document.getElementById('ho-va-ten');
        const emailInput = document.querySelector('#ho-so-form input[type="email"]'); 
        
        if (hoVaTenInput) {
            hoVaTenInput.value = nguoiDungHienTai.name;
        }
        if (emailInput) {
            emailInput.value = nguoiDungHienTai.email;
        }

        
        const tenNguoiDungElements = document.querySelectorAll('.user-name, .user-name-large');
        tenNguoiDungElements.forEach(element => {
            element.textContent = nguoiDungHienTai.name;
        });

        
        const anhDaiDienElements = document.querySelectorAll('.user-avatar, .mobile-avatar, .avatar-large');
        anhDaiDienElements.forEach(element => {
            
            const size = element.classList.contains('avatar-large') ? '128' : 
                         element.classList.contains('mobile-avatar') ? '32' : '40';
            element.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nguoiDungHienTai.name)}&background=4ADE80&color=fff&size=${size}`;
        });
    }
    
    
    hienThiTrang('trang-chu');
    
    // kiểm tra quyền người dùng
    checkUserPermissions();
    
    
    const gopYForm = document.getElementById('gop-y-form');
    if (gopYForm) {
        gopYForm.addEventListener('submit', xuLyGuiGopY);
    }
    

    const hoSoForm = document.getElementById('ho-so-form');
    if (hoSoForm) {
        hoSoForm.addEventListener('submit', xuLyLuuHoSo);
    }
    
    
    const avatarEditBtn = document.getElementById('avatar-edit-btn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', xuLyChinhSuaAnh);
    }
    
    
    const addVideoForm = document.getElementById('add-video-form');
    if (addVideoForm) {
        addVideoForm.addEventListener('submit', saveNewVideo);
    }
    
    
    const mucTieuOptions = document.querySelectorAll('.muc-tieu-option');
    mucTieuOptions.forEach(option => {
        option.addEventListener('click', function() {
            
            mucTieuOptions.forEach(opt => opt.classList.remove('selected'));
            
            this.classList.add('selected');
        });
    });
});