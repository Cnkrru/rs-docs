# rscsv API 指南

## 核心组件

### CsvConfig - 配置

使用 Builder 模式创建 CSV 解析配置。

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

### CsvReader - 读取器

从实现了 `BufRead` 的任意来源读取 CSV 数据。

```rust
use rscsv::{CsvConfig, CsvReader};
use std::io::Cursor;

let config = CsvConfig::builder().has_headers(true).build();
let data = "name,age,city\nAlice,30,NYC\nBob,25,LA\n";
let mut reader = CsvReader::from_reader(Cursor::new(data))
    .with_config(config);

reader.read_headers()?;
println!("表头: {:?}", reader.headers());
let records = reader.read_all()?;
```

#### 迭代器模式

```rust
for result in reader.records() {
    let record = result?;
    println!("{:?}", record);
}
```

> **注意:** `CsvConfig` 已实现 `Debug` trait，可在调试时直接打印。

> **v0.1.1 改进:** `needs_quoting` 现在感知 `trim` 配置。仅当 `trim: true` 时，前后空格才会触发自动加引号；当 `trim: false` 时保留原样不额外加引号，确保往返一致性。多行引用字段读取时也正确识别转义字符（`\`）后的引号。

#### FileReader - 从文件读取

```rust
use rscsv::FileReader;

let mut reader = FileReader::open("data.csv")?;
let records = reader.read_all()?;
```

### CsvWriter - 写入器

```rust
use rscsv::CsvWriter;

let mut buf = Vec::new();
let mut writer = CsvWriter::from_writer(&mut buf);

writer.write_headers(&["name", "age", "city"])?;
writer.write_record(&["Alice", "30", "NYC"])?;
writer.write_record(&["Bob".to_string(), "25".to_string(), "LA".to_string()])?;
```

### StringRecord - 记录类型

```rust
use rscsv::StringRecord;

let record = StringRecord::new(vec!["Alice".to_string(), "30".to_string()]);

println!("字段数: {}", record.len());
println!("字段数: {}", record.field_count());
println!("第一个: {:?}", record.first());
println!("最后一个: {:?}", record.last());

let fields: Vec<String> = record.into_vec();

for field in StringRecord::new(vec!["x".to_string(), "y".to_string()]) {
    println!("{}", field);
}
```

## 配置详解

### escape - 转义字符

```rust
let config = CsvConfig::builder().escape(b'\\').build();
// "hello \"world\"" 解析后 → hello "world"
```

### comment - 注释行

```rust
let config = CsvConfig::builder().comment(b'#').build();
// # 这行被跳过
// a,b  ← 这行被读取
```

### flexible - 灵活模式

```rust
let config = CsvConfig::builder()
    .has_headers(true).flexible(true).build();
// 允许各行字段数不一致
```

### trim - 去除空格

```rust
let config = CsvConfig::builder().trim(true).build();
// "  a  ,  b  " → ["a", "b"]
```

## 往返测试

```rust
let mut buf = Vec::new();
let data = vec![vec!["a", "b"], vec!["c", "d"]];

let mut writer = CsvWriter::from_writer(&mut buf);
writer.write_all(&data)?;

let mut reader = CsvReader::from_reader(Cursor::new(&buf));
let records = reader.read_all()?;
assert_eq!(records, data);
```

## 更多资源

- [GitHub 仓库](https://github.com/Cnkrru/rust-package)
- [快速开始](2-README.md)