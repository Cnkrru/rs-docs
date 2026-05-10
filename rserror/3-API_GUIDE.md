# rserror API 指南

## 核心组件

### RsError - 统一错误类型

所有错误的统一容器，内置 message、source 链、context 栈和错误分类。

```rust
use rserror::RsError;

let err = RsError::new("文件未找到");
let err = RsError::new("IO 操作失败").with_source(io_error);
let err = RsError::new("数据库错误")
    .context("查询用户时发生错误")
    .kind(ErrorKind::Internal);
```

### RsResult<T> - 结果类型别名

```rust
use rserror::RsResult;

fn parse_number(s: &str) -> RsResult<i32> {
    s.parse::<i32>().map_err(|e| rserror::err!("解析失败: {}", e))
}
```

### ErrorKind - 错误分类

```rust
use rserror::{RsError, ErrorKind};

let err = RsError::new("config.toml not found")
    .kind(ErrorKind::NotFound);

match err.get_kind() {
    ErrorKind::NotFound => println!("资源未找到"),
    ErrorKind::Permission => println!("权限不足"),
    ErrorKind::Io => println!("IO 错误"),
    ErrorKind::InvalidInput => println!("输入无效"),
    ErrorKind::Parse => println!("解析失败"),
    ErrorKind::Internal => println!("内部错误"),
    ErrorKind::Other => println!("其他错误"),
}
```

### ErrorChain - 错误链迭代器

```rust
use rserror::RsError;
use std::error::Error;

let err = RsError::new("顶层错误")
    .with_source(std::io::Error::new(
        std::io::ErrorKind::NotFound, "底层错误"
    ));

for e in err.chain() {
    println!("{}", e);
}
```

## Context Trait

为 `Result` 和 `Option` 扩展 `.context()` 方法。

```rust
use rserror::Context;

fn read_file(path: &str) -> rserror::RsResult<String> {
    std::fs::read_to_string(path)
        .context(format!("读取文件 '{}' 失败", path))
}

fn find_user(id: u32) -> rserror::RsResult<User> {
    let user = get_user(id).context("用户不存在")?;
    Ok(user)
}
```

### 方法

| 方法 | 描述 |
|------|------|
| `.context(msg)` | 附加静态上下文消息 |
| `.with_context(f)` | 附加延迟计算的上下文消息 |

## ErrorConfig - 全局配置

使用 Builder 模式配置错误处理环境。

```rust
use rserror::ErrorConfig;

ErrorConfig::init(
    ErrorConfig::builder()
        .include_location(true)
        .log_errors(true)
        .build()
);
```

### 配置选项

| 选项 | 类型 | 默认 | 描述 |
|------|------|------|------|
| `include_location` | `bool` | `false` | 在 `err!()` 中附加文件路径和行号 |
| `log_errors` | `bool` | `false` | 创建错误时自动输出到 stderr |

## 宏

### err!() - 创建错误

```rust
err!("文件未找到");
err!("值 {} 超出范围 [0, {}]", 42, 100);
```

### bail!() - 快速返回错误

```rust
fn process(x: i32) -> rserror::RsResult<()> {
    if x < 0 { bail!("x 不能为负数"); }
    Ok(())
}
```

### ensure!() - 条件断言

```rust
fn validate(email: &str) -> rserror::RsResult<()> {
    ensure!(!email.is_empty(), "邮箱不能为空");
    ensure!(email.contains('@'), "邮箱格式无效: {}", email);
    Ok(())
}
```

## 配置选项

| 选项 | 类型 | 默认 | 描述 |
|------|------|------|------|
| `include_location` | `bool` | `false` | 在 `err!()` 中附加文件路径和行号 |
| `log_errors` | `bool` | `false` | 创建错误时自动输出到 stderr（含回溯信息） |

### log_errors 用法示例

```rust
use rserror::ErrorConfig;

ErrorConfig::init(
    ErrorConfig::builder()
        .log_errors(true)
        .build()
);

// 此后所有 err!() 创建的错误的自动输出到 stderr
let e = err!("数据库连接失败");  // 终端会看到 [ERROR] 数据库连接失败
```

## 内置 From 转换

| 来源类型 | 说明 |
|----------|------|
| `String` | 直接包装为 RsError |
| `&str` | 转为 String 后包装 |
| `std::io::Error` | 自动分类 IO 错误 |
| `std::fmt::Error` | 包装格式化错误 |
| `Box<dyn Error + Send + Sync>` | 包装任意错误类型，自动分类 kind |

## bail! 与 source 结合

```rust
use rserror::bail;
use std::io;

fn read_config() -> rserror::RsResult<String> {
    let io_err = io::Error::new(io::ErrorKind::NotFound, "config.toml");
    // source 被正确附加到错误链中
    bail!("读取配置失败", io_err);
}
```

## 回溯支持（可选）

在 `Cargo.toml` 中启用：

```toml
[dependencies]
rserror = { version = "0.1", features = ["backtrace"] }
```

启用后，每个 `err!()` 创建的错误自动捕获堆栈，`log_errors` 输出时会打印回溯信息。