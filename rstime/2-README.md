# rstime - Rust 增强时间库

rstime 弥补了 Rust 标准库 `std::time` 的功能不足，提供完整的日期时间、格式化、解析和时间计算能力。

### 特性

- 📅 **日期类型** — `Date`（年/月/日），支持星期计算、闰年判断
- ⏰ **时间类型** — `Time`（时/分/秒/毫秒），支持 12/24 小时制
- 🗓 **日期时间** — `DateTime` 组合类型，Unix 时间戳互转
- ⏱ **时长类型** — `Duration`（严格正时长）和 `TimeDelta`（带符号时长）
- 📝 **格式化** — 自定义格式串 `{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}`
- 🔍 **解析** — 从字符串解析日期时间，支持 ISO 8601
- 🕐 **时钟** — 系统时钟获取当前时间、单调时钟用于性能计时
- ➕ **计算** — 日期时间加减、差值计算
- 🛡️ **安全类型** — `RstimeError` 自定义错误类型，`Duration::try_new()` 确保正值
- 🪶 **零依赖** — 仅使用 Rust 标准库

### 快速开始

在 `Cargo.toml` 中添加：

```toml
[dependencies]
rstime = "0.1"
```

#### 当前时间

```rust
use rstime::{DateTime, Date, Time};

fn main() {
    let now = DateTime::now();
    println!("{}", now);
    println!("今天: {}", Date::today());
    println!("此刻: {}", Time::now());
}
```

#### 格式化输出

```rust
use rstime::{DateTime, TimeFormat};

fn main() {
    let dt = DateTime::from_ymd_hms(2026, 5, 10, 14, 5, 9);

    println!("{}", dt.format("{YYYY}-{MM}-{DD}T{HH}:{mm}:{ss}"));
    // → 2026-05-10T14:05:09

    println!("{}", dt.format("{YYYY}年{MM}月{DD}日 {HH}:{mm}:{ss}"));
    // → 2026年05月10日 14:05:09

    println!("{}", dt.format("{hh}:{mm} {AMPM}"));
    // → 02:05 PM
}
```

#### 安全时长构造

```rust
use rstime::{Duration, TimeDelta};

fn main() {
    // try_new 返回 Option<Duration>，负数返回 None
    let d = Duration::try_new(5, 500_000_000).unwrap();
    assert_eq!(d.total_seconds(), 5.5);

    assert!(Duration::try_new(-1, 0).is_none());
    assert!(Duration::try_new(0, -1).is_none());

    // TimeDelta 支持负数
    let td = TimeDelta::new(-86400, 0);   // -1 天
}
```

#### 日期计算

```rust
use rstime::{DateTime, Duration, TimeDelta};
use rstime::error::RstimeResult;

fn main() -> RstimeResult<()> {
    let dt = DateTime::from_ymd_hms(2026, 1, 1, 0, 0, 0);

    let next_day = dt + TimeDelta::new(86400, 0);
    println!("第二天: {}", next_day);

    let minus_hour = dt - Duration::HOUR;
    println!("一小时前: {}", minus_hour);
    Ok(())
}
```

#### Unix 时间戳

```rust
use rstime::DateTime;

fn main() {
    let now = DateTime::now();
    let ts = now.unix_timestamp();
    let ts_ms = now.unix_timestamp_millis();
    let back = DateTime::from_unix_millis(ts_ms);
}
```

#### 字符串解析

```rust
use rstime::{parse_iso8601, RstimeResult};

fn main() -> RstimeResult<()> {
    let dt = parse_iso8601("2026-05-10T14:05:09")?;
    let with_ms = parse_iso8601("2026-05-10T14:05:09.037")?;
    Ok(())
}
```

### 更多文档

- [API 指南](3-API_GUIDE.md) — 完整 API 参考

### 许可证

MIT License