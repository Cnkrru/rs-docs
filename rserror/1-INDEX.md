# rserror 中文文档

欢迎来到 rserror 中文文档！rserror 是一个零依赖的简化错误处理库，让你用最少的样板代码完成 Rust 错误处理。

## 文档导航

### 入门指南
- [快速开始](2-README.md) - 安装和基本使用
- [API 指南](3-API_GUIDE.md) - 完整的 API 参考和用法示例

### 核心功能
- **统一错误类型** — 一个 `RsError` 处理所有场景，无需定义枚举
- **上下文链** — `.context()` 方法一行添加错误描述
- **快捷宏** — `err!()` / `bail!()` / `ensure!()` 零依赖替代 `anyhow`
- **错误分类** — 内置 `ErrorKind`（`NotFound`、`Io`、`Parse` 等）
- **全局配置** — 一次配置，全局生效（位置追踪、错误日志自动输出）
- **Source 链** — 完整 `std::error::Error::source()` 支持，`bail!("msg", source)` 正确附加
- **`From<Box<dyn Error>>`** — 与第三方错误类型互操作
- **回溯支持** — 条件编译 `backtrace` feature 自动捕获堆栈
- **零依赖** — 纯标准库实现

### 与原生 Rust 对比

| 原生写法 | rserror 写法 |
|----------|-------------|
| `enum MyError { ... }` 定义变体 | `err!("描述")` 即用即走 |
| `impl Display + Debug + Error` | 自动实现 |
| `impl From<X> for MyError` | 内置常见 `From` |
| `.map_err(\|e\| MyError::Io(e))?` | `.context("描述")?` |

## 快速示例

```rust
use rserror::{err, bail, ensure, Context, RsResult, ErrorConfig};

// 一次性全局配置
ErrorConfig::init(
    ErrorConfig::builder()
        .include_location(true)
        .build()
);

// 创建错误
let e = err!("文件未找到");

// 上下文链
fn read_file(path: &str) -> RsResult<String> {
    std::fs::read_to_string(path).context("读取文件失败")
}

// 条件断言
fn set_age(age: u8) -> RsResult<()> {
    ensure!(age > 0, "年龄必须大于 0，当前 {}", age);
    Ok(())
}

// 提前返回
fn divide(a: i32, b: i32) -> RsResult<i32> {
    if b == 0 { bail!("除数不能为零"); }
    Ok(a / b)
}
```

## 在线资源

- [GitHub 仓库](https://github.com/Cnkrru/rust-package)
- [docs.rs](https://docs.rs/rserror)