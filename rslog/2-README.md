# rslog - Rust 日志库

rslog 是一个完全使用 Rust 标准库构建的零依赖日志库。

### 特性

- **零依赖**: 仅使用 Rust 标准库
- **六级日志**: Trace, Debug, Info, Warn, Error, Critical
- **双通道输出**: 控制台彩色输出 + 文件异步写入
- **日志轮转**: 按大小/按时间自动轮转，支持 gzip 压缩
- **模块过滤**: 按模块路径设置不同日志级别
- **格式化宏**: `trace!` / `debug!` / `info!` / `warn!` / `error!` / `critical!`
- **多格式输出**: Text / JSON / 自定义模式
- **ANSI 彩色**: 完整的 ANSI 颜色方案支持
- **编译时过滤**: Cargo features 在编译时剥离低级别日志

### 快速开始

在 `Cargo.toml` 中添加：

```toml
[dependencies]
rslog = { path = "../rslog" }
```

#### 基本使用

```rust
use rslog::{info, warn, error, debug};

fn main() {
    rslog::init();
    info!("应用启动成功");
    debug!("调试信息");
    warn!("警告信息");
    error!("错误信息");
}
```

#### 文件输出配置

```rust
use rslog::{ConfigBuilder, RotationStrategy, OutputFormat};

fn main() {
    let config = ConfigBuilder::new()
        .log_dir("logs")
        .file_prefix("app")
        .log_level(rslog::LogLevel::Debug)
        .output_format(OutputFormat::Json)
        .rotation_strategy(RotationStrategy::SizeBased {
            max_size: 10 * 1024 * 1024,
            max_files: 5,
            compress: true,
        })
        .build();

    rslog::init_with_config(config).unwrap();
    rslog::info!("带文件输出的日志");
}
```

#### 模块过滤

```rust
rslog::set_module_level("my_app::network", rslog::LogLevel::Warn);
rslog::set_module_level("my_app::database", rslog::LogLevel::Debug);
```

### 更多文档

- [API 指南](3-API_GUIDE.md) - 完整 API 参考

### 许可证

MIT License