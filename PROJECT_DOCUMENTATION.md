# Tài Liệu Kỹ Thuật - Hệ Thống Cửa Hàng Sneaker One

## 1. Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework:** React.js (Sử dụng Functional Components & Hooks).
- **Styling:** Tailwind CSS (Thiết kế giao diện hiện đại, responsive).
- **Routing:** React Router DOM v6 (Quản lý chuyển trang, URL params).
- **State Management:** React Context API (Sử dụng `useAuth` hook để quản lý trạng thái đăng nhập).
- **API Client:** Axios (Đã cấu hình base client tại `api/client`).
- **Utilities:** Cấu trúc module hóa cho định dạng tiền tệ, nhãn trạng thái đơn hàng.

### Backend
- **Runtime:** Node.js.
- **Framework:** Express.js.
- **Database:** MySQL (Sử dụng `mysql2` với kết nối Pool).
- **Authentication:** JSON Web Token (JWT) & Bcryptjs (Mã hóa mật khẩu).
- **Email Service:** Nodemailer (Gửi mã OTP qua email).
- **Kiến trúc:** Service-Repository Pattern (Tách biệt logic nghiệp vụ và truy vấn dữ liệu).

---

## 2. Phạm Vi Chức Năng (Function Scope)

Dựa trên mã nguồn, hệ thống hiện thực hóa 5 luồng nghiệp vụ chính:

### 2.1. Xác thực & Phân quyền (Authentication & Authorization)
- **Đăng ký:** Cho phép người dùng đăng ký tài khoản mới, mật khẩu được băm (hash) trước khi lưu.
- **Xác thực OTP:** Cơ chế gửi mã OTP qua email để kích hoạt tài khoản hoặc đặt lại mật khẩu.
- **Đăng nhập:** Phân quyền giữa `user` (thành viên) và `admin` (quản trị viên).
- **Quên mật khẩu:** Luồng gửi OTP reset mật khẩu có thời hạn (10 phút) và chế độ `devMode` để kiểm tra cục bộ.

### 2.2. Quản lý Sản phẩm (Product Management)
- **Trang chủ:** Hiển thị Banner khuyến mãi, tin tức, sản phẩm mới nhất (New Arrivals) và sản phẩm bán chạy (Best Sellers).
- **Danh sách sản phẩm:**
    - Hỗ trợ lọc theo danh mục (Sneaker Cao Cấp, Chạy Bộ, Streetwear).
    - Tính năng phân trang (Pagination) và tải thêm dữ liệu (Infinite Scroll/Lazy Loading).
- **Chi tiết sản phẩm:** Xem thông tin mô tả, thuộc tính (màu sắc, chất liệu), ảnh và danh sách sản phẩm liên quan. Tự động tăng lượt xem (`views_count`).

### 2.3. Giỏ hàng & Đặt hàng (Cart & Order) - *Dựa trên API xử lý đơn hàng*
- **Đặt hàng:** Lưu thông tin giao hàng (tên, số điện thoại, địa chỉ, ghi chú).
- **Thanh toán:** Hỗ trợ nhiều phương thức thanh toán.
- **Trạng thái:** Tự động hóa trạng thái đơn hàng (Mới -> Đã xác nhận -> Đang giao -> Hoàn tất).

### 2.4. Theo dõi & Quản lý đơn hàng (Order Tracking)
- **Lịch sử:** Xem danh sách đơn hàng đã mua.
- **Chi tiết đơn hàng:** 
    - Trình theo dõi trạng thái trực quan (Status Tracker).
    - Cơ chế tự động cập nhật dữ liệu mỗi 30 giây (Polling).
    - Tính năng hủy đơn hàng (hoặc gửi yêu cầu hủy nếu shop đang chuẩn bị hàng).

### 2.5. Hồ sơ người dùng (User Profile)
- **Xem hồ sơ:** Hiển thị thông tin cá nhân, avatar, vai trò.
- **Cập nhật:** Cho phép sửa đổi tên hiển thị, số điện thoại, ảnh đại diện và đồng bộ tức thì với Context API.
- **Admin Profile:** Trang quản trị riêng biệt cho nhân viên shop.

---

## 3. Cấu Trúc Cơ Sở Dữ Liệu (Database Schema)

Hệ thống sử dụng cơ sở dữ liệu `single_product_shop` với các bảng chính:
1. **`users`**: Lưu trữ thông tin định danh, vai trò và trạng thái kích hoạt.
2. **`categories`**: Quản lý các loại giày sneaker.
3. **`products`**: Lưu thông tin giày, sử dụng kiểu dữ liệu `JSON` cho cột `images` và `attributes` để tăng tính linh hoạt.
4. **`otp_tokens`**: Quản lý mã xác thực, loại token và thời gian hết hạn.

---

## 4. Điểm Mạnh Về Kỹ Thuật
- **Dữ liệu mẫu (Seed Data):** Hệ thống đã được chuẩn bị sẵn dữ liệu Sneaker thực tế (Air Jordan, Yeezy, Ultraboost) để kiểm thử.
- **Xử lý lỗi:** Frontend có cơ chế bắt lỗi API (Error Boundaries) tránh treo màn hình "Đang tải".
- **Hiệu suất:** Tận dụng `useCallback` và `useEffect` để tối ưu hóa việc gọi API trong React.
- **Bảo mật:** Sử dụng `password_hash` và xác thực JWT cho mọi yêu cầu nhạy cảm.