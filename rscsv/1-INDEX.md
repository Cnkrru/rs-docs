# rscsv 中文文档

欢迎来到 rscsv 中文文档！rscsv 是一个完全使用 Rust 标准库构建的零依赖轻量级 CSV 库。

## 文档导航

### 入门指南
- [快速开始](2-README.md) - 安装和基本使用
- [API 指南](3-API_GUIDE.md) - 完整的 API 参考和用法示例

### 核心功能
- **CSV 解析** - 支持自定义分隔符、引号、转义符
- **CSV 读取** - 迭代器模式，支持表头自动识别
- **CSV 写入** - 泛型写入接口，自动处理引号和转义
- **灵活配置** - Builder 模式，支持 flexible / trim / comment 等
- **零依赖** - 纯标准库实现

### 配置选项
| 配置项 | 描述 | 默认值 |
|--------|------|--------|
| `delimiter` | 字段分隔符 | `,` |
| `quote` | 引号字符 | `"` |
| `escape` | 转义字符 | 无 |
| `has_headers` | 是否包含表头 | `false` |
| `flexible` | 是否允许不等长行 | `false` |
| `trim` | 是否去除字段首尾空格 | `false` |
| `comment` | 注释字符 | 无 |

## 快速示例

```rust
use rscsv::{CsvConfig, CsvReader};
use std::io::Cursor;

fn main() -> rscsv::CsvResult<()> {
    let config = CsvConfig::builder()
        .has_headers(true)
        .build();

    let mut reader = CsvReader::from_reader(Cursor::new("name,age\nAlice,30\nBob,25\n"))
        .with_config(config);

    let records = reader.read_all()?;
    println!("{:?}", reader.headers());
    println!("{:?}", records);
    Ok(())
}
```

## 在线资源

- [GitHub 仓库](https://github.com/Cnkrru/rust-package)