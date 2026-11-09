# 绑定 v1 映射

> 本文档的英文原版见 [rig-mapping.md](rig-mapping.md)（英文版本为准）。

坐标使用源图像像素。旋转角度使用弧度。参数范围以及弹簧/运动调校仍作为引擎行为常量。

| 绑定字段 | 参考来源 |
| --- | --- |
| image | rig.js IMG |
| head | HEAD、headWeight、turnWeight |
| body | BODY、呼吸/侧倾衰减带、胸部和肩部高斯 |
| face, buns | baseWeights 高斯以及眉毛/下颌衰减带 |
| eyes.opening, eyes.roi | build_layers.py EYES |
| eyes.x0/x1/top/bot | built/layers.json eyes（24 个采样点，拆分前的权威曲线） |
| mouth | rig.js MOUTH 和 sprites.js MOUTH_AREA |
| cheeks | rig.js CHEEKS |
| strands | rig.js STRANDS |
| accessories | rig.js TASSELS、build_layers.py 搜索框和红色占比阈值 |
| hand | rig.js 骨骼、FOREARM_SHARE 和权重带；build_layers.py HAND_POLY、JAW_VISIBLE、JAW_X、BG_BEHIND_HAND |
| mesh | createMeshAvatar.js 图层单元尺寸和精细矩形；sprites.js 差分单元 |
| view | createMeshAvatar.js padTop/padSide 默认值 |
| view.gazeCenter（可选） | motion.js 指针跟随原点；省略时默认使用头部中心 |
| view.irisTravel（可选） | 视线为 ±1 时 createMeshAvatar.js 的虹膜偏移，px；省略时默认为 7 |

变形公式使用的解剖中心（眉毛、眼睛和胸部）也来自绑定的对应高斯中心。发髻弹簧锚点使用其高斯中心。可选组会被省略或留空；不提供替换的 miko-qipao 坐标。

对眼睛多边形、手部拆分几何和饰品框的修改会把图层标记为过期。拆分前的眼睛曲线和图像矩形会保留，直到计划中的图层构建器运行；仅靠编辑拆分多边形本身，无法通过修改坐标重新生成缺失的图像像素。

发束折线在编辑器中可以有两个或更多节点。物理会把它们的静止位置重采样为四个节点，以便参考的四节点弹簧算法保持不变。基准样本（fixture）原有的四节点发束会被原样使用，以保持精确的回归结果。

特定于图像的变形常量已在上文映射。图像处理的核尺寸以及颜色混合/修补算法属于计划中的图层构建器。
