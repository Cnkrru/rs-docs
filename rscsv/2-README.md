# rscsv - Rust CSV 库

rscsv 是一个完全使用 Rust 标准库构建的零依赖 CSV 读取和写入库。

### 特性

- 📖 **CSV 读取** — 迭代器模式，支持表头自动识别
- ✍️ **CSV 写入** — 泛型写入接口，自动处理引号和转义
- ⚙️ **灵活配置** — Builder 模式，支持灵活的行长度
- 🔧 **自定义分隔符** — 支持任意分隔符
- 💬 **引号和转义** — 支持引号字段、双引号转义、escape 字符
- 📝 **注释行** — 支持跳过以指定字符开头的行
- 🧹 **字段修剪** — 自动去除字段首尾空白
- 🪶 **零依赖** — 仅使用 Rust 标准库

### 快速开始

在 `Cargo.toml` 中添加：

```toml
[dependencies]
rscsv = { path = "../rscsv" }
```

#### 读取 CSV

```rust
use rscsv::{CsvConfig, CsvReader};
use std::io::Cursor;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let data = "name,age,city\nAlice,30,NYC\nBob,25,LA\n";

    let config = CsvConfig::builder()
        .has_headers(true)
        .build();

    let mut reader = CsvReader::from_reader(Cursor::new(data))
        .with_config(config);

    let records = reader.read_all()?;
    println!("表头: {:?}", reader.headers());
    for rec in records {
        println!("{:?}", rec);
    }
    Ok(())
}
```

#### 写入 CSV

```rust
use rscsv::CsvWriter;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut buf = Vec::new();
    let mut writer = CsvWriter::from_writer(&mut buf);

    writer.write_headers(&["name", "age"])?;
    writer.write_record(&["Alice", "30"])?;
    writer.flush()?;

    println!("{}", String::from_utf8(buf)?);
    Ok(())
}
```

### 配置选项

```rust
use rscsv::CsvConfig;

let config = CsvConfig::builder()
    .delimiter(b',')
    .quote(b'"')
    .escape(b'\\')
    .has_headers(true)
    .flexible(false)
    .trim(false)
    .comment(b'#')
    .build();
```

### 更多文档

- [API 指南](3-API_GUIDE.md) — 完整的 API 参考和用法示例

### 许可证

MIT License