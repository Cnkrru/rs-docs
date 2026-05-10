# rstime API 指南

## 类型概览

| 类型 | 说明 | 精度 |
|------|------|------|
| `Date` | 日期，年/月/日 | 天 |
| `Time` | 时间，时/分/秒/毫秒 | 毫秒 |
| `DateTime` | 日期时间组合 | 毫秒 |
| `Duration` | 纯正时长 | 纳秒 |
| `TimeDelta` | 带符号时长 | 纳秒 |
| `Weekday` | 星期枚举 | — |
| `SystemClock` | 系统时钟 | — |
| `MonotonicClock` | 单调时钟（计时用）| — |
| `RstimeError` | 错误类型 | — |
| `RstimeResult<T>` | `Result<T, RstimeError>` | — |

---

## Date

```rust
use rstime::Date;

let d = Date::new(2026, 5, 10);
```

| 方法 | 返回 | 说明 |
|------|------|------|
| `Date::today()` | `Date` | 今天的日期 |
| `d.is_leap_year()` | `bool` | 是否闰年 |
| `d.weekday()` | `Weekday` | 星期几 |
| `d.day_of_year()` | `u16` | 一年中第几天 |
| `d.days_in_month()` | `u8` | 当月天数 |
| `d.at_time(t)` | `DateTime` | 组合日期和时间 |
| `d + TimeDelta` | `Date` | 加天数 |
| `d1 - d2` | `TimeDelta` | 日期差 |

---

## Time

```rust
use rstime::Time;

let t = Time::new(14, 5, 9, 37);
let t = Time::from_hms(14, 5, 9);
```

| 常量/方法 | 说明 |
|-----------|------|
| `Time::MIDNIGHT` | 00:00:00.000 |
| `Time::NOON` | 12:00:00.000 |
| `Time::MAX` | 23:59:59.999 |
| `t.hour12()` | 返回 `(u8, bool)` 12小时制 |
| `t.is_pm()` | 是否下午 |

---

## DateTime

```rust
use rstime::DateTime;

let dt = DateTime::from_ymd_hms(2026, 5, 10, 14, 5, 9);
let dt = DateTime::from_ymd_hms_milli(2026, 5, 10, 14, 5, 9, 37);
```

| 方法 | 说明 |
|------|------|
| `DateTime::now()` | 当前日期时间 |
| `dt.unix_timestamp()` | Unix 时间戳（秒）|
| `dt.unix_timestamp_millis()` | Unix 时间戳（毫秒）|
| `DateTime::from_unix(secs)` | 从秒构建 |
| `DateTime::from_unix_millis(ms)` | 从毫秒构建 |
| `dt + TimeDelta` | 加时长 |
| `dt1 - dt2` | 差值 |

---

## Duration / TimeDelta

```rust
use rstime::{Duration, TimeDelta};

Duration::ZERO     // 0
Duration::SECOND   // 1 秒
Duration::MINUTE   // 60 秒
Duration::HOUR     // 3600 秒
Duration::DAY      // 86400 秒

// Duration 严格为正，使用 try_new 安全构造
let d = Duration::try_new(1500, 0).unwrap();  // 1500 秒
let d = Duration::from_millis(1500);           // 1.5 秒
assert!(Duration::try_new(-1, 0).is_none());   // 负数返回 None

// TimeDelta 支持负数
let td = TimeDelta::new(-86400, 0);   // -1 天
let abs = td.abs();                    // Duration(1天)
```

---

## 格式化

```rust
use rstime::TimeFormat;

let dt = DateTime::from_ymd_hms(2026, 5, 10, 14, 5, 9);
dt.format("{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}");
```

### 格式标记

| 标记 | 含义 | 示例 |
|------|------|------|
| `{YYYY}` | 四位年份 | `2026` |
| `{YY}` | 两位年份 | `26` |
| `{MM}` | 两位月份 | `05` |
| `{DD}` | 两位日 | `10` |
| `{HH}` | 两位24小时 | `14` |
| `{hh}` | 两位12小时 | `02` |
| `{mm}` | 两位分钟 | `05` |
| `{ss}` | 两位秒 | `09` |
| `{SSS}` | 三位毫秒 | `037` |
| `{W}` | 星期简写 | `Sun` |
| `{WW}` | 星期全称 | `Sunday` |
| `{AMPM}` | 上/下午 | `PM` |

---

## 解析

```rust
use rstime::{parse_datetime, parse_iso8601, RstimeResult};

fn example() -> RstimeResult<()> {
    let dt = parse_iso8601("2026-05-10T14:05:09")?;
    let dt = parse_iso8601("2026-05-10")?;
    let dt = parse_iso8601("2026-05-10T14:05:09.037")?;

    let dt = parse_datetime("10/05/2026", "{DD}/{MM}/{YYYY}")?;
    Ok(())
}
```

## RstimeError / RstimeResult

所有解析函数统一返回 `RstimeResult<T>`（即 `Result<T, RstimeError>`），替代之前的裸 `String`：

```rust
use rstime::{RstimeError, RstimeResult, parse_iso8601};

// 自定义错误类型，实现 Display + Error
let err = RstimeError::new("invalid date");
assert_eq!(err.to_string(), "invalid date");

// RstimeResult 别名
fn parse_date(s: &str) -> RstimeResult<()> {
    let _ = parse_iso8601(s)?;
    Ok(())
}
```

---

## 时钟

```rust
use rstime::{SystemClock, MonotonicClock};

let clock = SystemClock;
let now = clock.now();

let timer = MonotonicClock::start();
let elapsed = timer.elapsed();
println!("耗时: {}ms", elapsed.total_millis());
```

---

## 更多资源

- [快速开始](2-README.md)
- [GitHub 仓库](https://github.com/Cnkrru/rust-package)