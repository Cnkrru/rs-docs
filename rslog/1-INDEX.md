# rslog 中文文档

欢迎来到 rslog 中文文档！rslog 是一个完全使用 Rust 标准库构建的零依赖轻量级日志库。

## 文档导航

### 入门指南
- [快速开始](2-README.md) - 安装和基本使用
- [API 指南](3-API_GUIDE.md) - 完整的 API 参考和用法示例

### 核心功能
- **零依赖** - 纯标准库实现
- **六级日志** - Trace, Debug, Info, Warn, Error, Critical
- **双通道输出** - 控制台彩色输出 + 文件异步写入
- **日志轮转** - 按大小 / 按时间自动轮转，支持 gzip 压缩
- **模块过滤** - 按模块路径设置不同日志级别
- **格式化宏** - `trace!` / `debug!` / `info!` / `warn!` / `error!` / `critical!`
- **多格式输出** - Text / JSON / 自定义模式
- **ANSI 彩色** - 完整的 ANSI 颜色方案支持
- **编译时过滤** - Cargo features 在编译时剥离低级别日志
- **Builder 模式** - 流畅的配置构建 API
- **单例模式** - 线程安全全局实例

## 快速示例

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

## 在线资源

- [GitHub 仓库](https://github.com/Cnkrru/rslog)
- [crates.io](https://crates.io/crates/rslog)
- [docs.rs](https://docs.rs/rslog)