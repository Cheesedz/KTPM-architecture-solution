# CASE STUDY 2
Dưới đây là một chương trình có nhiệm vụ chuyển file ảnh tiếng Anh sang một file `pdf` tiếng Việt. Các bước xử lý lần lượt bao gồm: chuyển đổi ảnh sang text, dịch tiếng Anh sang tiếng Việt, chuyển đổi nội dung text thành file `pdf`. Chương trình chính chỉ demo các tính năng này tuần tự.

## Hướng dẫn cài đặt
Yêu cầu cài đặt trước [tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) trên hệ điều hành của bạn. 

```sh
# Cài đặt các gói liên quan
$ npm install
# Tạo folder cho output
$ mkdir output
# Khởi chạy ứng dụng demo
$ npm start
```

## Mô Tả
| File | Chức năng |
|--|:--|
| utils/ocr.js | Chuyển đổi ảnh sang text |
| utils/translate.js | Dịch tiếng Anh sang tiếng Việt |
| utils/pdf.js | Chuyển đổi text sang PDF |

## Yêu cầu
 - Hoàn thiện chương trình sử dụng `express.js` cho phép upload một file ảnh và trả về một file `pdf` tương ứng
 - Sử dụng `Pipes and Filters pattern` và `message queue` để hoàn thiện chương trình trên.

## Cài đặt
#### Khởi chạy Rabbitmq và Nginx
```sh
$ docker compose up
```
#### Khởi chạy các instance server
```sh
$ npm run start:instance1
```
#### Khởi chạy thêm (tuỳ ý)
```sh
$ npm run start:instance2
$ npm run start:instance3
```
#### Khởi chạy các consumer
```sh
$ pm2 start ecosystem.config.js
```

## Giám sát
#### Bật monitor plugin 
```bash
$ docker exec -it rabbitmq sh
$ rabbitmq-plugins enable rabbitmq_management
```
#### Truy cập vào port 15672 để theo dõi Rabbitmq
```sh
username: guest
password: guest
```
#### Xem logs của worker
```sh
$ pm2 logs
```
#### Xem trạng thái hoạt động của worker, try cập
https://app.pm2.io/
