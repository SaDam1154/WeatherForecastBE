# Weather Forecast API

Ứng dụng backend này cung cấp thông tin thời tiết bao gồm thời tiết hiện tại và dự báo, cùng với các tính năng đăng ký nhận thông báo thời tiết qua email hàng ngày.

## Mục lục

-   [Cài đặt](#cài-đặt)
-   [Cấu hình](#cấu-hình)
-   [Sử dụng](#sử-dụng)
-   [Endpoints](#endpoints)
    -   [Weather](#weather)
    -   [Subscription](#subscription)

## Cài đặt

Clone repository và cài đặt các dependencies:

```bash
npm install
```

## Cấu hình

Thiết lập file `.env` với các biến sau:

```plaintext
WEATHER_API_KEY=
PORT = 3000
DB_CONNECTION_STRING =
GMAIL_USER=
GMAIL_PASS=
DOMAIN= //Domain deployFE
```

## Sử dụng

Khởi động server:

```bash
npm run start:dev
```

## Endpoints

### Weather

Base URL: `/weather`

-   **[GET] /weather/current**

    Lấy thông tin thời tiết hiện tại cho một thành phố cụ thể.

    -   **Tham số query**:

        -   `city`: Tên của thành phố (bắt buộc).

    -   **Phản hồi**:
        -   200: Trả về dữ liệu thời tiết hiện tại (nhiệt độ, điều kiện, tốc độ gió, độ ẩm, v.v.).
        -   404: Không tìm thấy thành phố
        -   400: Tên thành phố không hợp lệ
        -   500: Lỗi server

-   **[GET] /weather/forecast**

    Lấy thông tin dự báo thời tiết cho các ngày sắp tới cho một thành phố cụ thể.

    -   **Tham số query**:

        -   `city`: Tên của thành phố (bắt buộc).
        -   `days`: Số ngày dự báo (mặc định là 4, tùy chọn).

    -   **Phản hồi**:
        -   200: Trả về dữ liệu dự báo cho số ngày yêu cầu.
        -   404: Không tìm thấy thành phố
        -   400: Tên thành phố không hợp lệ
        -   500: Lỗi server

### Subscription

Base URL: `/subscribe`

-   **[POST] /subscribe**

    Đăng ký nhận thông báo thời tiết hàng ngày cho một thành phố cụ thể.(hiện là mỗi giờ 1 email)

    -   **Tham số body**:

        -   `email`: Địa chỉ email của người dùng (bắt buộc).
        -   `city`: Tên của thành phố cho thông báo hàng ngày (bắt buộc).

    -   **Phản hồi**:
        -   200: Đăng ký thành công nhận thông báo hàng ngày.
        -   400: Email hoặc tên thành phố không hợp lệ
        -   500: Lỗi server

-   **[GET] /subscribe/verify**

    Xác thực email của người dùng để xác nhận đăng ký.

    -   **Tham số query**:

        -   `token`: Mã xác thực duy nhất được cung cấp trong email xác nhận (bắt buộc).

    -   **Phản hồi**:
        -   200: Xác thực email thành công.
        -   400: Mã xác thực không hợp lệ hoặc đã hết hạn
        -   500: Lỗi server

-   **[POST] /subscribe/unsub**

    Hủy đăng ký nhận thông báo thời tiết hàng ngày.

    -   **Tham số body**:

        -   `email`: Địa chỉ email của người dùng (bắt buộc).
        -   `city`: Tên của thành phố cần hủy đăng ký (bắt buộc).

    -   **Phản hồi**:
        -   200: Hủy đăng ký thành công.
        -   400: Email hoặc tên thành phố không hợp lệ
        -   500: Lỗi server
