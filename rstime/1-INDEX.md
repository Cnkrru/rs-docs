# rstime 中文文档

欢迎来到 rstime 中文文档！rstime 是一个完全使用 Rust 标准库构建的零依赖增强时间库。

## 文档导航

### 入门指南
- [快速开始](2-README.md) — 安装和基本使用
- [API 指南](3-API_GUIDE.md) — 完整的 API 参考和用法示例

### 核心功能
- **日期时间类型** — `Date` / `Time` / `DateTime` / `Duration` / `TimeDelta`
- **格式化输出** — 自定义格式串 `{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}`
- **字符串解析** — 从字符串解析日期时间，支持 ISO 8601
- **时间计算** — 日期时间加减、差值计算
- **时钟功能** — 系统时钟获取当前时间、单调时钟用于计时
- **星期计算** — 任意日期的星期几（蔡勒公式）
- **闰年判断** — 内置闰年逻辑
- **零依赖** — 纯标准库实现

## 快速示例

```rust
use rstime::{DateTime, Date, Time, Duration, TimeFormat};

fn main() {
    let now = DateTime::now();
    println!("现在: {}", now);

    let s = now.format("{YYYY}年{MM}月{DD}日 {HH}:{mm}:{ss}");
    println!("格式化: {}", s);

    let tomorrow = Date::today() + Duration::DAY;
    println!("明天: {}", tomorrow);

    println!("今天是: {}", Date::today().weekday());
}
```

## 在线资源

- [GitHub 仓库](https://github.com/Cnkrru/rust-package)