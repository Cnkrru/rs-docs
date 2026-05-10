# rslog API 指南

## 日志级别

```rust
use rslog::LogLevel;

// 六级日志，从低到高
LogLevel::Trace
LogLevel::Debug
LogLevel::Info
LogLevel::Warn
LogLevel::Error
LogLevel::Critical
```

## 宏

```rust
use rslog::{trace, debug, info, warn, error, critical};

trace!("最低级别日志");
debug!("调试信息: x = {}", 42);
info!("用户 {} 登录成功", username);
warn!("磁盘使用率 {}%", 85);
error!("连接失败: {}", err);
critical!("系统崩溃！");
```

## 配置 (ConfigBuilder)

```rust
use rslog::{ConfigBuilder, RotationStrategy, OutputFormat};

let config = ConfigBuilder::new()
    .log_dir("logs")                    // 日志目录
    .file_prefix("myapp")               // 文件名前缀
    .log_level(LogLevel::Debug)         // 最低日志级别
    .output_format(OutputFormat::Text)  // 输出格式
    .console_output(true)               // 控制台输出
    .file_output(true)                  // 文件输出
    .rotation_strategy(                 // 轮转策略
        RotationStrategy::SizeBased {
            max_size: 10 * 1024 * 1024, // 10MB
            max_files: 5,               // 保留 5 个
            compress: true,             // gzip 压缩
        }
    )
    .async_write(true)                  // 异步写入
    .build();
```

## 轮转策略

### 按大小轮转

```rust
RotationStrategy::SizeBased {
    max_size: 10 * 1024 * 1024, // 10MB
    max_files: 5,
    compress: true,
}
```

### 按时间轮转

```rust
RotationStrategy::TimeBased {
    interval: rslog::RotationInterval::Daily,
    max_files: 30,
    compress: true,
}
```

## 输出格式

```rust
use rslog::OutputFormat;

OutputFormat::Text              // 文本格式（默认）
OutputFormat::Json              // JSON 格式
OutputFormat::Pattern("{level}: {message}")  // 自定义模式
```

## 模块过滤

```rust
use rslog;

// 设置特定模块的日志级别
rslog::set_module_level("myapp::network", LogLevel::Warn);
rslog::set_module_level("myapp::db", LogLevel::Debug);

// 清除模块过滤
rslog::clear_module_level("myapp::network");
rslog::clear_all_module_levels();
```

## 编译时过滤 (Cargo Features)

```toml
[dependencies]
rslog = { path = "../rslog", features = ["max_level_info"] }
```

可选 features:
- `max_level_trace` (默认，不剥离)
- `max_level_debug`
- `max_level_info`
- `max_level_warn`
- `max_level_error`

## v0.1.4 改进

- **Flush 通道分离:**
  之前使用空 `LogEntry`（level="" + message=""）作为 flush 信号，现已改为专用 `FlushSignal` 通道，避免与正常日志条目混淆。
  
- **critical! 宏一致化:**
  `critical!` 现在与其他级别宏使用相同的 `_log_enabled_critical!()` 辅助宏，而不是原始的 `MAX_LEVEL < 6` 比较。

## 更多资源

- [快速开始](2-README.md)
- [GitHub 仓库](https://github.com/Cnkrru/rslog)