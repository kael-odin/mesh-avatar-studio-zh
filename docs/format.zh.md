# 虚拟形象文件与文件夹格式

> 本文档的英文原版见 [format.md](format.md)（英文版本为准）。

版本 1 在项目文件夹和 `.mavatar` 归档中使用相同的文件。项目文件夹是工作副本；`.mavatar` 是一个 ZIP，这些文件位于其根目录。绑定以源图像坐标描述运动，构建出的 PNG 提供纹理。几何与变形设置见[绑定字段](rig-fields.zh.md)。

## 文件

```text
avatar.json                    manifest; required in an archive, optional in a folder
rig.json                       complete version 1 rig, including sampled eye curves
built/
  layers.json                  image size, layer rectangles and sampled eye curves
  base.png                     image with movable parts removed and inpainted
  base_cloth.png               required only for nonempty rig.cloth; base without garments
  cloth_<name>.png              garment cutout for each rig.cloth entry
  hairmask.png                 full-size hair mask, read from the red channel
  <name>.png                   one image for every entry in layers.json.layers
  sprites/                     optional drawn eye and mouth variants
    sprites.json               sprite rectangles
    <name>.png                 one image for every entry in sprites.json.layers
  overlays/                    optional overlay layers (glasses and other accessories)
    overlays.json              overlay names and image files
    <file>.png                 one full-size image for every entry in overlays.json.overlays
source.png                     optional original illustration; needed for editing
thumbnail.png                  optional preview image
```

即使 `layers.json` 中没有对应的矩形条目，`base.png` 和 `hairmask.png` 也是必需的。只有当绑定包含手部和饰品时，才需要这些图层。整个 `sprites/` 目录可以不存在。此时渲染器会为生成的眼睛图层和程序化嘴部制作动画，而不使用绘制的差分。`overlays/` 目录同样是可选的；没有它时，虚拟形象的渲染效果与之前完全一致。

读取器会忽略未知文件和未知 JSON 键。项目还可能包含草稿、源图变体、蒙版和审查图像；这些都不是播放所必需的。

当 `rig.cloth` 非空时，`base_cloth.png` 是一张全尺寸图像，每件服装在 `layers.json.layers` 中都有一个 `cloth_<name>` 矩形以及与之匹配的裁剪 PNG。播放器依次绘制后层服装、`base_cloth`、眼睛/嘴部图层、前层服装、饰品，然后是可选的 `hand`。`base.png` 保留服装，因此旧版播放器仍会显示穿着服装的插画。`pack-avatar` 会同时打包两个底图和服装拆分图。可选的编辑输入 `source_under.png` 与 `source.png` 具有相同的尺寸和对齐方式，只是去掉了服装；播放不需要它，`pack-avatar` 也不会包含它。缺少它时，图层构建器会对被覆盖的区域进行修补。

## 清单：`avatar.json`

```json
{
  "format": "mesh-avatar",
  "version": 1,
  "name": "My avatar",
  "author": "Artist name",
  "source": "source.png",
  "thumbnail": "thumbnail.png",
  "studio": { "version": "0.1.0" }
}
```

| 字段 | 含义 |
| --- | --- |
| `format` | 必需的字面量 `"mesh-avatar"`。 |
| `version` | 必需的格式版本，当前为 `1`。 |
| `name` | 必需的非空显示名称。它不是文件系统路径。 |
| `author` | 可选的作者或署名文本。 |
| `license` | 可选的许可证文本，或指向作品条款的引用。运行时的 MIT 许可证不授予对作品的任何权利。 |
| `source` | 可选的原始图像文件名，相对于根目录，通常为 `source.png`。 |
| `thumbnail` | 可选的预览图像文件名，相对于根目录，通常为 `thumbnail.png`。 |
| `lipSync` | 可选的嘴部运动设置：`granularity`、`openness`、`closeSpeed`（各自可选，有限值 0–1，默认 0.5）。可选的 `preset` 记录编辑器中的选择（`calm`、`default`、`lively`、`subtle`、`big`、`custom`）；播放始终使用数值。省略或留空的配置块会保留现有行为。 |
| `expressions` | 可选的按表情设置，用于 `setExpression` 显示的直播表情，以表情名称为键（`smile`、`shy`、`surprise`、`halfLidded`、`angry`、`sad`、`wink`）。每个条目可设置 `mouthOpen`（有限值，0–1），即该表情静止时的张嘴幅度。省略配置块或字段则保留内置值。 |
| `studio.version` | 可选的版本字符串，标识准备该虚拟形象的 Studio。 |

例如，`"lipSync": { "granularity": 0, "openness": 0.5, "closeSpeed": 0, "preset": "calm" }` 会选择更平滑、更少出现的闭合。较低的 `granularity` 只对较大的响度下降作出反应，并把较短的假名音拍归为一组；较高的值会区分更小的下降。`openness` 把张嘴幅度缩放为原始量的 0.55 到 1.25 倍（上限为 1），在 0.5 时恰好等于原始量。`closeSpeed` 把释放从缓慢变为迅速。三者默认均为 0.5，完全保留现有的动画。`preset` 不会改变数值，也不会触发播放。

编辑器独立于绑定保存此配置块，并在导出/导入时保留它。预览音频绝不会存入归档。加载器和 Live/Player 会应用已保存的设置；显式的运行时设置会覆盖对应的已保存字段。音频驱动的口型同步需要由应用提供分析过的响度。仅加载虚拟形象不会启动麦克风。旧版读取器会忽略这个可选键。格式版本和现有字段保持不变。配置块中的未知字段会被忽略。

例如，`"expressions": { "surprise": { "mouthOpen": 0.45 } }` 会把惊讶表情的静止张嘴幅度设得比内置的 0.6 更小，这适合画有小“o”形嘴的插图。其他表情在未指定张开值时为闭嘴（0）。表情显示期间，静止时以及说话的安静间隙中都会保持该张开幅度；更响的音节仍会让嘴张得更大。运行时不认识的表情名称和未知字段会被忽略，为 `neutral` 提供的条目不会产生效果，也会以同样的方式被忽略；超出 0–1 的值属于错误。加载器会应用该配置块，显式的运行时设置会覆盖对应的已保存字段。用 `setEmotion` 启动的动作表情会保留各自的值。旧版读取器会忽略这个可选键。Studio 在保存口型同步设置时和导出时都会保留该配置块；它没有针对该配置块的编辑器控件。

导入时，Studio 会把原始图像保存为 `source.png`，并在文件名不同时更新 `avatar.json.source`。

没有 `avatar.json` 的现有文件夹，其有效清单为 `{ "format": "mesh-avatar", "version": 1, "name": "<folder name>" }`。归档必须包含显式清单。`parseManifest` 校验已知字段，返回一个包含这些字段的新对象，并在字段无效时抛出点名 `avatar.json` 的错误。它会忽略未知键，包括 `studio` 内部的键。

## 构建图层：`built/layers.json`

| 字段 | 含义 |
| --- | --- |
| `version` | 元数据版本 `1`；省略也表示 `1`。 |
| `size` | `[width, height]`，以源像素为单位，与 `rig.image` 完全一致。两个维度都是正整数。 |
| `build` | 构建输入的非空缓存失效哈希。它不是格式版本。 |
| `layers` | 把每个图层名称映射到 `[x, y, width, height]` 的对象。 |
| `eyes` | 两个对象，包含 `x0`、`x1`、`top` 和 `bot`，眼睛顺序与绑定相同。 |

矩形原点是非负整数；宽度和高度是正整数。矩形位于源图像内部。每个对应的 PNG 都裁剪到其矩形的宽度和高度。名称使用字母、数字、连字符或下划线，不带扩展名或路径分隔符。

| 保留名称 | 内容 |
| --- | --- |
| `base` | 移除眼睛、可选手部和饰品并对裸露区域进行修补后的全尺寸插画。 |
| `hairmask` | 全尺寸蒙版，其红色通道控制头发变形。 |
| `hand` | 可移动的手部和手臂拆分图；当 `rig.hand` 存在时出现。 |
| `eye0_ball`, `eye1_ball` | 眼白和虹膜，运行时被眼睑曲线裁剪。 |
| `eye0_low`, `eye1_low` | 下眼睑描线。 |
| `eye0_crease`, `eye1_crease` | 眼睑褶皱描线。未绘制褶皱时，透明图像是有效的。 |
| `eye0_lash`, `eye1_lash` | 上睫毛描线。 |

每只眼睛的四个部件都是必需的。饰品名称来自 `rig.accessories[*].name`；每个饰品都需要一个矩形和对应的 PNG。饰品名称必须唯一，且不得复用保留图层名称。

每只眼睛跨越有限的 `x0 < x1` 值。`top` 和 `bot` 各自包含 24 个在该跨度上采样的有限 y 坐标；每个 top 值都位于对应 bot 值之上，或与其重合。这些字段与 `rig.eyes[*].x0`、`x1`、`top` 和 `bot` 重复。图层构建器会写入两份副本，它们的值必须完全一致。未来的格式可能只把它们保留在 `layers.json` 中；版本 1 要求两者都存在。

## 绘制差分：`built/sprites/sprites.json`

可选的差分元数据包含 `version`、`build` 和 `layers`。`version` 为 `1`（旧文件可能省略），`build` 是缓存失效哈希。`layers` 是一个矩形映射，与图层元数据相同：

```json
{
  "build": "example-build-hash",
  "layers": {
    "mouth_a": [100, 200, 80, 40]
  },
  "version": 1
}
```

列出的每个差分在 `built/sprites/` 下都有一张 PNG。它使用相同的源像素矩形约定，包括边界和整数要求。各个差分都可以单独省略；读取器不得要求完整的集合。

| 名称 | 绘制内容 |
| --- | --- |
| `eyes_closed_0`, `eyes_closed_1` | 眼睑放松的闭眼。 |
| `eyes_half_0`, `eyes_half_1` | 半睁的眼睛。 |
| `eyes_smile_0`, `eyes_smile_1` | 微笑时的闭眼。 |
| `eyes_sad_0`, `eyes_sad_1` | 悲伤表情的睁眼。 |
| `eyes_surprise_0`, `eyes_surprise_1` | 惊讶表情的睁大眼。 |
| `mouth_a` | “a”的张口嘴型。 |
| `mouth_a_half` | 半张的“a”；也复用于“e”。 |
| `mouth_i` | “i”的宽嘴型。 |
| `mouth_o` | “o”的圆嘴型；也以减小的宽度复用于“u”。 |
| `mouth_angry` | 愤怒表情的闭嘴嘴型（嘴角向下）。 |
| `mouth_sad` | 悲伤表情的闭嘴嘴型（嘴角下垂）。 |

眼睛后缀是 `rig.eyes` 中的索引，而不是单独的左右约定。当直播表情（`setExpression`：`sad`、`surprise`）或情绪标签（`setEmotion`：`sad`、`surprised`）激活时，表情眼睛会替换睁开和半睁的眼睛；眨眼仍会切换到 `eyes_closed`。它们覆盖与其他眼睛绘制相同的区域，且不包含眉毛，眉毛由绑定移动。愤怒表情保留 `eyes_half`。当愤怒或悲伤表情或情绪标签激活时，表情嘴型会替换闭嘴嘴型；说话时，张口嘴型会绘制在它们之上。没有这些绘制时，这些表情看起来与之前相同。否则，闭嘴嘴型由原始底图提供。

## 叠加层：`built/overlays/overlays.json`

叠加层是可选的全尺寸绘制，例如眼镜，应用可以通过 `setOverlays` 按名称显示或隐藏它们。元数据包含 `version` 和 `overlays`。`version` 为 `1`（或省略）。`overlays` 是 `{ name, file }` 条目的数组：

```json
{
  "overlays": [
    { "name": "glasses", "file": "glasses.png" }
  ],
  "version": 1
}
```

`name` 和文件名主干使用字母、数字、`_` 和 `-`；`file` 以 `.png` 结尾，且名称必须唯一。每张图像位于 `built/overlays/` 下，与 `base.png` 大小相同，并以源图像坐标绘制，在饰品之外为透明。运行时只对不透明区域（外加几个像素的留白）生成网格，因此小型饰品的动画开销依然很低。

所有叠加层初始都是隐藏的。`setOverlays(['glasses'])` 显示列出的叠加层并隐藏其他叠加层；未知名称会被忽略，`setOverlays([])` 会全部隐藏。隐藏的叠加层不会被变形。叠加层绘制在绘制的眼睛和嘴部差分之上、流苏和手部之下，并像底图一样跟随头部和身体。眉毛、下颌和头发的运动不会移动它们。

不认识叠加层的运行时会忽略该目录，因此带有叠加层的虚拟形象在这些运行时上仍可播放，只是没有饰品。

## 归档规则与兼容性

`.mavatar` 文件是一个 ZIP，条目采用存储方式（压缩方法 0），使用 UTF-8 名称和正斜杠。把 `avatar.json`、`rig.json` 和 `built/` 直接放在其根目录，不要包裹一层项目目录。条目名称不得是绝对路径、包含 `..` 段或使用反斜杠。导入器会拒绝条目超过 200 个或任何条目大于 64 MB 的归档。

缺少 `avatar.json` 仅允许出现在文件夹中。缺少 `version` 仅允许出现在 `layers.json`、`sprites.json` 和 `overlays.json` 中，此时它表示 `1`。`rig.json` 以及任何存在的 `avatar.json` 都必须指定版本 `1`。读取器会以指明文件和版本的错误拒绝不支持的版本，例如 `built/layers.json.version: unsupported version 2 (expected 1)`。未知条目和未知对象键不会改变已知字段的解释。已列出的图层或差分仍然需要其 PNG，即使名称不熟悉。加载文件夹时，`openAvatar` 会在校验绑定之前用 `layers.json.eyes` 填充缺失的 `eyes[*].x0`、`x1`、`top` 和 `bot` 字段；已有的值会保留。

为重新编辑准备归档时，默认应包含 `source.png`。为播放而准备时可以省略它，但 `built/base.png` 已经包含插画的大部分内容：省略原图对作品几乎没有保护作用。分享这些文件中的任何一个之前，请检查作品的条款。

## 打包与校验

在仓库根目录，安装 Node 依赖之后：

```sh
npm run validate-avatar -- samples/miko-qipao
npm run validate-avatar -- projects/my-avatar
npm run pack-avatar -- projects/my-avatar
npm run validate-avatar -- projects/my-avatar.mavatar
npm run pack-avatar -- projects/my-avatar --no-source -o projects/playback.mavatar
```

校验接受文件夹和 `.mavatar` 文件。它读取常规文件，不跟随符号链接，对有效输入返回退出状态 0，对无效输入返回 1，并打印带有受影响相对文件名的错误。归档需要 `avatar.json`。打包默认写出同级的 `.mavatar`，并拒绝覆盖已有的输出。它包含清单、绑定、构建资源以及可选的缩略图和原图；草稿、差分和工作文件会被排除。`--no-source` 会省略原始图像。没有清单的文件夹会获得一个以文件夹名称为名称的清单。

`validateAvatarFiles(files)` 在无需文件系统或网络访问的情况下执行相同的检查。传入一个从根目录相对、以正斜杠分隔的路径到 `Uint8Array` 字节的映射。对于图像，可以用 `{ size: number }` 代替字节；JSON 始终需要字节。校验器检查 JSON 模式、受支持的版本、必需的非空文件、矩形边界、匹配的图像尺寸元数据以及匹配的眼睛曲线。它忽略未知文件和 JSON 字段，并保持输入不变。它不会解码 PNG，也不会验证其实际尺寸是否与矩形匹配，并且不评判画作或动画质量。校验后请审查渲染出的虚拟形象。

## 运行时加载

`openAvatar(source, { version?, rigFile? })` 接受文件夹 URL、`.mavatar` URL、`Blob`、`ArrayBuffer`、`Uint8Array` 或已打开的 `AvatarPackage`。二进制输入视为归档；以 `.mavatar` 结尾的 URL 路径会作为归档获取。其他 URL 视为文件夹。相对 URL 相对于当前页面解析。已存在的包会原样返回。对于文件夹，`rigFile` 选择绑定文件名（默认 `rig.json`），`version` 会为元数据和图像 URL 添加 `v` 查询参数。可选的清单、差分或叠加层元数据可以不存在；其他 HTTP 错误会被报告。文件夹图像保持为 URL，由渲染器读取。

返回的包包含 `manifest`、已校验的 `rig`、`assets` URL 映射和 `release()`。归档资源使用对象 URL；用完 `openAvatar` 包后请调用 `release()`。重复调用是安全的。文件夹包不会分配对象 URL。

`loadMeshAvatar(canvas, source, options)` 打开来源，并用现有的动作和表情 API 创建虚拟形象。返回的虚拟形象还暴露 `package`。销毁它会释放加载器打开的包，包括在创建失败时。如果调用方提供了已有的包，则调用方保留所有权，并且必须在所有使用它的虚拟形象都结束后释放它。

`packAvatar(files, { manifest? })` 校验并打包字节映射，`avatar.json` 排在最前。除非提供了清单覆盖，否则保留已有的文件，包括清单字节。没有现有清单时，默认名称为 `Avatar`。`unpackAvatar(bytes)` 检查归档路径和限制并返回字节映射；请使用 `validateAvatarFiles` 或 `openAvatar` 校验虚拟形象的内容。

直播视图接受 `?avatar=<folder-or-.mavatar-URL>`。当两者同时存在时，显式的 `project` 查询参数优先。
