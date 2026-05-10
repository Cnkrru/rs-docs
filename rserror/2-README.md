# rserror - Rust 错误处理库

rserror 是一个零依赖的简化错误处理库，覆盖错误创建、上下文追加、链式传播和全局配置等场景。

### 特性

- 🚀 **即用即走** — `err!("描述")` 替代枚举定义
- 📎 **上下文追加** — `.context("描述")` 替代 `.map_err()`
- ⚡ **快捷宏** — `err!()` / `bail!()` / `ensure!()`
- 🏷️ **错误分类** — `ErrorKind::NotFound` / `Io` / `Parse` 等
- 🔗 **错误链** — 完整 `source()` 链支持
- 🪄 **Source 宏** — `bail!("msg", source)` 正确附加来源错误
- 🔄 **互操作** — `From<Box<dyn Error + Send + Sync>>` 支持
- 🔍 **回溯(可选)** — `backtrace` feature 自动捕获堆栈
- ⚙️ **全局配置** — `ErrorConfig` Builder 模式，`log_errors` 实际生效
- 🪶 **零依赖** — 仅使用 Rust 标准库

### 快速开始

在 `Cargo.toml` 中添加：

```toml
[dependencies]
rserror = { path = "../rserror" }
```

#### 基本使用

```rust
use rserror::{err, bail, ensure, Context, RsResult, ErrorConfig};

ErrorConfig::init(
    ErrorConfig::builder()
        .include_location(true)
        .build()
);

fn read_config(path: &str) -> RsResult<String> {
    std::fs::read_to_string(path)
        .context("读取配置文件失败")
}

fn validate(value: i32) -> RsResult<()> {
    ensure!(value > 0, "值必须大于 0，当前 {}", value);
    ensure!(value < 100, "值 {} 超出范围", value);
    Ok(())
}

fn divide(a: i32, b: i32) -> RsResult<i32> {
    if b == 0 { bail!("除数不能为零"); }
    Ok(a / b)
}
```

#### 错误链遍历

```rust
use rserror::RsError;
use std::error::Error;

let err = RsError::new("数据库连接失败")
    .with_source(std::io::Error::new(
        std::io::ErrorKind::ConnectionRefused,
        "connection refused"
    ))
    .context("初始化服务时发生错误");

for e in err.chain() {
    println!("{}", e);
}
```

#### 配置选项

| 选项 | 类型 | 默认 | 描述 |
|------|------|------|------|
| `include_location` | `bool` | `false` | 附加 `file!()` + `line!()` |
| `log_errors` | `bool` | `false` | 自动打印错误到 stderr |