# 前端技术部落THREEJS主题分享

## [WebGL基础](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)

# 主题文字释义

“光锥之内皆是命运”
节选自刘慈欣的《三体2-黑暗森林》中斐兹罗将军的一段：
“光的传播沿时间轴呈锥状，物理学家们称为光锥，光锥之外的人不可能了解光锥内部发生的事件。想想现在，谁知道宇宙中有多少重大事件的信息正在以光速向我们飞来，有些可能已经飞了上亿年，但我们仍在这些事件的光锥之外。”
“光锥之内就是命运。”

在WebGL的世界中亦是如此，必须要在视锥中可见

# OpenGL简介

介绍WebGL之前，我们先简单了解一下OpenGL的相关知识点。OpenGL是计算机图形学的课程，用于计算机科学、工程学、数学和科学分支，自3.1版本之后OpenGL弃用了较老的立即模式、状态变量与OpenGL函数，转而更新为需要每个应用程序提供一个**顶点着色器、片段着色器（片元着色器）**对可视的场景内容进行渲染，涉及到的主题内容有：建模、几何、变换、照明与着色、纹理映射与像素处理。自2009年 OpenGL的研讨会上引出了WebGL，基于OpenGL ES2.0的图形API，通过HTML5 canvas 元素执行js的runtime环境；引入WebGL带来的优势在于，web技术是可交付媒体类型的自然发展，从文字过渡到图像，再到视频，再到交互式3D，集中体现在：

- 零要求

仅需一款网页浏览器与项目地址URL，无需安装其他软件

- 跨平台

WEB平台天然的跨平台优势

- 跨设备

支持WebGL 的web浏览器可以在电脑、平板、手机上使用

- 易开发

WebGL 调用基于上下文环境，不需要像OpenGL 那样的全局函数

- 强大的工具生态

chrome Firefox 提供出色的javascript调试器，以及WebGL Inspector 提供gDEBugger工具

- 性能

相信在座的同学有不少是C++的高手，该技术开发者的直觉反应javascript 运行是否会很慢，因其自身的松散的类型系统、功能特性、垃圾收集等因素。从实际实验数据对比，渲染场景中的网格数量的不断增加，C++ 在所有网格数量级上的速度都别js快，js仅支持双精度浮点数，而不支持单精度浮点数，因噪声函数在C++中使用的是float， 而js不支持该类型。同比之下js要比c++ 多花7.73-17.78倍的时间。因此我们将大量网格节点的运算从CPU迁移到GPU密集型应用程序，将大量的顶点着色器计算量放入GPU执行，经实验测评c++与javascript的耗时基本持平，并且在WebWorker的加持下，javascript的性能瓶颈将不再是问题，相比带来的跨端、技术生态优势是非常巨大的


# WebGL简介

WebGL经常被当成3D API，可以使用WebGL和一些神奇的东西做出炫酷的3D作品。 事实上WebGL是一个光栅化引擎，可以根据你的代码绘制出点，线和三角形。

WebGL在电脑的GPU中运行。因此你需要使用能够在GPU上运行的代码。 这样的代码需要提供成对的方法。每对方法中一个叫顶点着色器， 另一个叫片段着色器，并且使用一种和C或C++类似的强类型的语言 GLSL。 (GL着色语言)。 这一对组合起来称作一个 program（着色程序）。

顶点着色器的作用是计算顶点的位置。根据计算出的一系列顶点位置，WebGL可以对点， 线和三角形在内的一些图元进行光栅化处理。当对这些图元进行光栅化处理时需要使用片段着色器方法。 片段着色器的作用是计算出当前绘制图元中每个像素的颜色值。

每对方法中一个叫顶点着色器，顶点着色器的作用是计算顶点的位置。根据计算出的一系列顶点位置，WebGL可以对点， 线和三角形在内的一些图元进行光栅化处理。

另一个叫片段着色器，片段着色器的作用是计算出当前绘制图元中每个像素的颜色值。当对这些图元进行光栅化处理时需要使用片段着色器方法。

几乎整个WebGL API都是关于如何设置这些成对方法的状态值以及运行它们。 对于想要绘制的每一个对象，都需要先设置一系列状态值，然后通过调用 gl.drawArrays 或 gl.drawElements 运行一个着色方法对，使得你的着色器对能够在GPU上运行。

着色器获取数据的4种方法： 

1、属性（Attributes）和缓冲； 

缓冲是发送到GPU的一些二进制数据序列，通常情况下缓冲数据包括位置，法向量，纹理坐标，顶点颜色值等。 你可以存储任何数据。

属性用来指明怎么从缓冲中获取所需数据并将它提供给顶点着色器。 例如你可能在缓冲中用三个32位的浮点型数据存储一个位置值。 对于一个确切的属性你需要告诉它从哪个缓冲中获取数据，获取什么类型的数据（三个32位的浮点数据）， 起始偏移值是多少，到下一个位置的字节数是多少。

缓冲不是随意读取的。事实上顶点着色器运行的次数是一个指定的确切数字， 每一次运行属性会从指定的缓冲中按照指定规则依次获取下一个值。

2、全局变量（Uniforms）； 

全局变量在着色程序运行前赋值，在运行过程中全局有效。

3、纹理（Textures）；

纹理是一个数据序列，可以在着色程序运行中随意读取其中的数据。 大多数情况存放的是图像数据，但是纹理仅仅是数据序列， 你也可以随意存放除了颜色数据以外的其它数据。

4、可变量（Varyings）；

可变量是一种顶点着色器给片段着色器传值的方式，依照渲染的图元是点， 线还是三角形，顶点着色器中设置的可变量会在片段着色器运行中获取不同的插值。

渲染：在绘制之前我们应该调整画布（canvas）的尺寸以匹配它的显示尺寸。画布就像图片一样有两个尺寸。 一个是它拥有的实际像素个数，另一个是它显示的大小。CSS决定画布显示的大小。 你应该尽可能用CSS设置所需画布大小 ，因为它比其它方式灵活的多。

如果你想做三维渲染，你需要提供合适的着色器将三维坐标转换到裁剪空间坐标，因为WebGL只是一个光栅化API。

- WebGL工作原理

WebGL在GPU上的工作基本上分为两部分，第一部分是将顶点（或数据流）转换到裁剪空间坐标， 第二部分是基于第一部分的结果绘制像素点

WebGL每次绘制需要两个着色器，顶点着色器、片段着色器（为当前光栅化的像素提供颜色值）

光栅化 === 用像素画出来

对于每一个像素，它会调用你的片段着色器询问你使用什么颜色。 你通过给片段着色器的一个特殊变量gl_FragColor设置一个颜色值，实现自定义像素颜色

GLSL全称是 Graphics Library Shader Language （图形库着色器语言），是着色器使用的语言。它有一些不同于JavaScript的特性，主要目的是为栅格化图形提供常用的计算功能。

WebGL的全部内容就是创建不同的着色器，向着色器提供数据然后调用gl.drawArrays 或 gl.drawElements 让WebGL调用当前顶点着色器处理每个顶点，调用当前片段着色器渲染每个像素

- WebGL兼容性检查（WebGL compatibility check）
大部分的WebGL API在chrome 56+以上版本支持功能特性，当然建议升级到75及以上的版本，纯甄体验全量功能

当然今天我们的主角并不是高深莫测的WebGL，而是社区主流的工具库Three.js，使用该库能让我们快速搭建项目，完成我们设计好的3D场景，模拟工业化生产\全景数字化仓\AR虚拟现实等


## Three.js 

### 基础

- Three.js与WebGL的关系

Three.js经常会和WebGL混淆， 但也并不总是，three.js其实是使用WebGL来绘制三维效果的。 WebGL是一个只能画点、线和三角形的非常底层的系统. 想要用WebGL来做一些实用的东西通常需要大量的代码， 这就是Three.js的用武之地。它封装了诸如场景、灯光、阴影、材质、贴图、空间运算等一系列功能，让你不必要再从底层WebGL开始写起。

## three.js 应用结构

- Renderer(渲染器) three.js的主要对象。你传入一个场景(Scene)和一个摄像机(Camera)到渲染器(Renderer)中，然后它会将摄像机视椎体中的三维场景渲染成一个二维图片显示在画布上。

- Scene(场景图) 一个树状结构，由很多对象组成，比如图中包含了一个场景(Scene)对象 ，多个网格(Mesh)对象，光源(Light)对象，群组(Group)，三维物体(Object3D)，和摄像机(Camera)对象。

- Camera(摄像机) 可以一半在场景图中，一半在场景图外的。这表示在three.js中，摄像机(Camera)和其他对象不同的是，它不一定要在场景图中才能起作用。相同的是，摄像机(Camera)作为其他对象的子对象，同样会继承它父对象的位置和朝向

补充说明坐标系（垂直屏幕当作Z轴，显示器的水平方向当作X轴 显示器的垂直方向当作Y轴），相信在座的高手们对于右手坐标系是使用如喝汤一样丝滑，这里就不赘述了。

- Mesh(网格) 用一种特定的材质(Material)来绘制的一个特定的几何体(Geometry)。材质(Material)和几何体(Geometry)可以被多个网格(Mesh)对象使用。比如在不同的位置画两个蓝色立方体，我们会需要两个网格(Mesh)对象来代表每一个立方体的位置和方向。

- Material(材质) 代表绘制几何体的表面属性，包括使用的颜色，和光亮程度。一个材质(Material)可以引用一个或多个纹理(Texture)，这些纹理可以用来，打个比方，将图像包裹到几何体的表面，汽车车身钣金外喷涂的漆面

- Geometry(几何体) 如球体、立方体、平面、狗、猫、人、树、建筑等物体的顶点信息。Three.js内置了许多基本几何体 。也可以创建自定义几何体或从文件中加载几何体。

- Light(光源) 太阳 聚光灯 散射灯 萤火虫 等 

## WebGL Hello World

hello world demo简介

本次分享集中在基础原理讲解，后续会将全部demo代码开放，helloworld的案例分解

### renderer create

### camera create

### orbitControl create

### light create

### Mesh create (Geometry & Material)

### FontLoader apply

### RAF animation 

requestAnimationFrame也是面试常见web面试题，要不我们随机挑选一个同学对比下raf与setIntelval的差异点。当前相信在座的各位老师都可以秒回答这个问题。

## 开发基础

three.js中最常用的摄像机并且之前我们一直用的摄像机是透视摄像机PerspectiveCamera, 它可以提供一个近大远小的3D视觉效果.

- 摄像机

透视摄像PerspectiveCamera

在three.js中最常用的摄像机并且之前我们一直用的摄像机是透视摄像机 PerspectiveCamera, 它可以提供一个近大远小的3D视觉效果.

**人眼的视野大约是向外95°、向内60°、向上60°、向下75°**。弧度

PerspectiveCamera通过四个属性来定义一个视锥. near定义了视锥的前端, far定义了后端, fov是视野, 通过计算正确的高度来从摄像机的位置获得指定的以near为单位的视野, 定义的是视锥的前端和后端的高度. aspect间接地定义了视锥前端和后端的宽度, 实际上视锥的宽度是通过高度乘以aspect来得到的.

**透视摄像机demo演示**

正交摄像机 OrthographicCamera

第二种常见的摄像机是正交摄像机 OrthographicCamera, 和指定一个视锥不同的是, 它需要设置left, right top, bottom, near, 和far指定一个长方体, 使得视野是平行的而不是透视的.在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。这对于渲染2D场景是非常有用的。

绘制2D图像的时候会用到OrthographicCamera. 你可以自己决定摄像机的视野大小. 比如说你想让canvas的一个像素匹配摄像机的一个单位, 你可以这么做

纸片人视角、二次元视角、嘉然


使用图元是种很常见的做法，像使用球体作为地球，或者使用大量盒子来绘制 3D 图形

- 图元

常用图元: BoxGeometry(立方体)、CircleGeometry(平面圆)、CylinderGeometry(圆柱)、PlaneGeometry(2D平面)、SphereGeometry(球体)、TextGeometry(3D文字)

案例讲解： hello CIB

- 场景图

Three.js 的核心可以说是它的场景图（scene graph）。场景图在 3D 引擎是一个图中节点的层次结构，其中每个节点代表了一个局部空间（local space）。

- 材质

常见材质：MeshBasicMaterial 不受光照影响、MeshLambertMaterial 只在顶点计算光照、MeshPhongMaterial 会在每个像素计算光照， 还支持镜面高光

- 纹理

纹理一般是指我们常见的在一些第三方程序中创建的图像，如Photoshop或GIMP

- 光照

常见光源： DirectionalLight 方向光 PointLight 点光源 AmbientLight 环境光 HemisphereLight 半球光 

1、方向光 DirectionalLight

方向光（DirectionalLight）常常用来表现太阳光照的效果。方形的小平面代表了一个方向光（DirectionalLight），方向光表示的是来自一个方向上的光，并不是从某个点发射出来的，而是从一个无限大的平面内，发射出全部相互平行的光线

2、点光源 PointLight 从一个点朝各个方向发射出光线的一种光照效果, 如为萤火虫、灯塔等场景

3、环境光 （AmbientLight）只是简单地将材质的颜色与光照颜色进行叠加（PhotoShop 里的正片叠底模式），再乘以光照强度。可以看到场景内的物体看起来没有立体感。它没有方向，无法产生阴影，场景内任何一点受到的光照强度都是相同的，除了改变场景内所有物体的颜色以外，不会使物体产生明暗的变化，看起来并不像真正意义上的光照。通常的作用是提亮场景，让暗部不要太暗。

4、半球光
半球光（HemisphereLight）的颜色是从天空到地面两个颜色之间的渐变，与物体材质的颜色作叠加后得到最终的颜色效果。一个点受到的光照颜色是由所在平面的朝向（法向量）决定的 —— 面向正上方就受到天空的光照颜色，面向正下方就受到地面的光照颜色，其他角度则是两个颜色渐变区间的颜色。

场景基本上也没有太大的立体感。半球光 （HemisphereLight） 与其他类型光照结合使用，可以很好地表现天空和地面颜色照射到物体上时的效果。所以最好的使用场景就是与其他光照结合使用，或者作为环境光（AmbientLight）的一种替代方案。

5、聚光灯 potLight

聚光灯可以看成是一个点光源被一个圆锥体限制住了光照的范围。实际上有两个圆锥，内圆锥和外圆锥。光照强度在两个锥体之间从设定的强度递减到 0（具体可以看下方 penumbra 参数）。

聚光灯（SpotLight）类似方向光（DirectionalLight）一样需要一个目标点，光源的位置是圆锥的顶点，目标点处于圆锥的中轴线上。

6、矩形区域光 RectAreaLight

矩形区域光（RectAreaLight）, 顾名思义，表示一个矩形区域的发射出来的光照，例如长条的日光灯或者天花板上磨砂玻璃透进来的自然光。

RectAreaLight 只能影响 MeshStandardMaterial 和 MeshPhysicalMaterial，

- 材质

1、basic  基础材质不受光照影响

2、lambert 仅在顶点计算光照

3、phong 在每个像素计算光照，支持镜面高光（shininess 镜面光泽度）

既然MeshBasicMaterial、MeshLambertMaterial可以做到的，MeshPhongMaterial也可以做到，那为什么还要有这3种材质呢？原因是更复杂的材质会消耗更多的GPU功耗。在一个较慢的GPU上，比如说手机，你可能想通过使用一个不太复杂的材质来减少绘制场景所需的GPU功耗。同样，如果你不需要额外的功能，那就使用最简单的材质。如果你不需要照明和镜面高光，那么就使用 MeshBasicMaterial 。

4、toon 与phong材质类似，最大的区别在于它是非平滑地着色，而是使用渐变纹理来决定如何着色。默认使用的渐变图是前70%的部分使用70%的亮度，之后的部分使用100%的亮度，当然，你可以定义你自己的渐变图。这最终会给人一种2色调的感觉，看起来就像卡通一样

**后面要介绍的材质应用场景条件较苛刻，使用频率较低**

5、基于物理渲染（Physically Based Rendering）的材质，简称PBR。应用场景较少，简单了解即可。

上述4种材质使用简单的数学来制作，看起来是3D的，但它们并不是现实世界中实际存在的东西。基于物理渲染的2种PBR材质使用更复杂的数学来接近现实世界中的实际情况。

第一个是 MeshStandardMaterial。MeshPhongMaterial 和 MeshStandardMaterial 最大的区别是它们使用的参数不同。MeshPhongMaterial 有一个参数用来设置 shininess 属性。MeshStandardMaterial 有2个参数用来分别设置 roughness 和 metalness 属性。

在基本层面，roughness 是 shininess 的对立面。粗糙度（roughness）高的东西，比如棒球，就不会有很强烈的反光，而不粗糙的东西，比如台球，就很有光泽。粗糙度的范围从0到1。

另一个设定，metalness，说的是材质的金属度。金属与非金属的表现不同。0代表非金属，1代表金属。

各种标准材质的构建速度从最快到最慢：MeshBasicMaterial ➡ MeshLambertMaterial ➡ MeshPhongMaterial ➡ MeshStandardMaterial ➡ MeshPhysicalMaterial。构建速度越慢的材质，做出的场景越逼真，但在低功率或移动设备上，你可能需要思考代码的设计，使用构建速度较快的材质。

6、ShadowMaterial 用于获取阴影创建的数据

7、MeshDepthMaterial 渲染每个像素的深度，其中处在摄像机负近端面的像素其深度为0，处在摄像机负远端面的像素其深度为1

8、MeshNormalMaterial 会显示几何体的法线。法线是一个特定的三角形或像素所面对的方向

 TODO：截图配置

- 纹理

纹理一般是指我们常见的在一些第三方程序中创建的图像，如Photoshop或GIMP

最常用使用的纹理加载器是TextLoader，加载一个Texture类，内部使用ImageLoader来加载文件。

loader.load方法的参数定义：
url — 文件的URL或者路径，也可以为 Data URI. 从给定的URL开始加载并将完全加载的texture传递给onLoad。该方法还返回一个新的纹理对象，该纹理对象可以直接用于材质创建。 如果采用此方法，一旦相应的加载过程完成，纹理可能会在场景中出现。
onLoad — 加载完成时将调用。回调参数为将要加载的texture.
onProgress — 将在加载过程中进行调用。参数为XMLHttpRequest实例，实例包含total和loaded字节。
onError — 在加载错误时被调用。

**重复，偏移，旋转，包裹一个纹理**

纹理有重复、偏移和旋转纹理的设置。

默认情况下，three.js中的纹理是不重复的。要设置纹理是否重复，有2个属性，wrapS 用于水平包裹，wrapT 用于垂直包裹。

它们可以被设置为一下其中一个：

THREE.ClampToEdgeWrapping

每条边上的最后一个像素无限重复。

THREE.RepeatWrapping

纹理重复

THREE.MirroredRepeatWrapping

在每次重复时将进行镜像

比如说，要开启两个方向的包裹。

但需要注意的是，并不是所有的几何体类型都支持多种材质。BoxGeometry 和 BoxGeometry 可以使用6种材料，每个面一个。ConeGeometry 和 ConeGeometry 可以使用2种材料，一种用于底部，一种用于侧面。 CylinderGeometry 和 CylinderGeometry 可以使用3种材料，分别是底部、顶部和侧面。对于其他情况，你需要建立或加载自定义几何体和（或）修改纹理坐标。

在其他3D引擎中，如果你想在一个几何体上使用多个图像，使用 纹理图集（Texture Atlas） 更为常见，性能也更高。纹理图集是将多个图像放在一个单一的纹理中，然后使用几何体顶点上的纹理坐标来选择在几何体的每个三角形上使用纹理的哪些部分。

## 开发基础总结

以上即是Three.js库的基础知识，内容涉及面比较广，概念也比较多，需要大量的实例练习来熟悉。当然除了以上内容以外还有阴影、雾等扩展知识需要在后期处理进行配置以追求实现更逼真的场景还原。

阴影：Three.js 默认使用shadow maps（阴影贴图），阴影贴图的工作方式就是具有投射阴影的光能对所有能被投射阴影的物体从光源渲染阴影

雾： 在3D引擎里，雾通常是基于离摄像机的距离褪色至某种特定颜色的方式。

## DEMO演示
接下来我们讲解简要讲解两个案例

- 空间场景模拟

类似VR看房中的空间，将摄像机放置于渲染空间的正中心，通过环绕轨道调节摄像机的视角以实现立体全景视角的模拟呈现。

1、设计场景图

2、使用组件
渲染器renderer以及它的初始化，装载canvas画布
透视摄像机的使用与初始化，挂载到场景scene中
摄像机环绕轨道控制器初始化，目标视角点设置以及更新镜头视角视图
光源选择与设置，默认自然环境的太阳光选择方向光
背景贴纸选择的加载器CubeTextureLoader，指定6个面的纹理资源地址，资源加载完成后设置为场景scene的背景 scene.background

3、render 渲染
通过requestAnimationFrame调用渲染器的renderer.render(scene, camera)方法，绘制场景

@bilibili 我的三体系列，从1看到3，肉眼可见的技术爆炸

- glTFLoader案例讲解

.glTF文件讲解
glTF格式本质上是一个JSON文件。这一文件描述了整个3D场景的内容。它包含了对场景结构进行描述的场景图。场景中的3D对象通过场景结点引用网格进行定义。材质定义了3D对象的外观，动画定义了3D对象的变换操作(比如选择、平移操作)。蒙皮定义了3D对象如何进行骨骼变换，相机定义了渲染程序的视锥体设置。

### JSON结构

scene：glTF格式的场景结构描述条目。它通过引用node来定义场景图。
node：场景图中的一个结点。它可以包含一个变换(比如旋转或平移)，引用更多的子结点。它可以引用网格和相机，以及描述网格变换的蒙皮。
camera：定义了用于渲染场景的视锥体配置。
mesh：描述了场景中出现的3D对象的网格数据。它引用的accessor对象可以用来访问真实的几何数据。它引用的material对象定义了3D对象的外观。
skin：定义了用于蒙皮的参数，参数的值通过一个accessor对象获得。
animation：描述了一些结点如何随时间进行变换(比如旋转或平移)。
accessor：一个访问任意数据的抽象数据源。被mesh、skin和animation元素使用来提供几何数据，蒙皮参数和基于时间的动画值。它通过引用一个bufferView对象，来引用实际的二进制数据。
material：包含了定义3D对象外观的参数。它通常引用了用于3D对象渲染的texture对象。
texture：定义了一个sampler对象和一个image对象。sampler对象定义了image对象在3D对象上的张贴方式。

### 引用外部数据

二进制数据，比如3D对象的几何数据和纹理数据通常不被包含在JSON文件中，它们被存储在外部的文件中。JSON文件中只包含了到这些外部文件的链接。这使得二进制数据可以以非常紧凑的形式进行存储方便互联网传输，并且可以直接被渲染程序使用，无需额外的解码、预处理。

### 读取和管理外部数据

读取和处理glTF格式文件从分析JSON结构开始，JSON结构被分析完后，就可以使用buffers和images数组来索引访问buffer和image对象。每个buffer和image对象引用了一块二进制数据。通常会将二进制数据读取到内存中，以它们在原来buffers和images数组中的索引顺序进行存储，以便使用相同的索引来访问对象对应的二进制数据。

这里我们渲染了一个攻防一体的高科技头盔，钓鱼佬专用，相信都2022年了，没有人钓鱼不戴头盔吧！（手动狗头）

1、第一步呢还是照葫芦画瓢的老几样，初始化渲染器、场景、摄像机、轨道控制器、
2、当前从视角中看到我们是给场景背景做了纹理的，纹理贴图映射模式采用了EquirectangularReflectionMapping模式，用于等距圆柱投影的环境贴图，也被叫做经纬线映射贴图。等距圆柱投影贴图表示沿着其水平中线360°的视角，以及沿着其垂直轴向180°的视角。贴图顶部和底部的边缘分别对应于它所映射的球体的北极和南极。
3、然后到了最关键的一步，加载glTF的模型，其实这一步加载器已经帮我做好大部分事情，我们仅仅需要读取到json对象中的scene字段并挂载到我们的场景中即可（因我们渲染的是一个静态的攻防一体的头盔，不涉及动画、粒子效果、拖尾等特殊效果，所以仅需挂载好就行了）

4、大家可以在pc电脑上打开demo演示地址试试看，（小猴子的那个图标点一下就能跳转页面），有条件的同学可以开一下vpn，资源可以加载快一些。有兴趣的小伙伴可以点击下方连接0元拼团购买

- ColladaLoader

DAE 是纯文本的模型格式，其本质就是一个单纯的xml文件。相比fbx，对dae格式模型的载入我们拥有非常高的自由控制，这也是最复杂的地方。基本上，dae文件内一开始就把数据分成了好几大块。对我们来说最为有用的是VisualScenes(包含场景骨骼节点树)、Nodes(与VisualScenes类似，两者或互为补充)、Geometries（网格数据）、Materials/Effects/Images（材质相关信息）、Controllers（骨骼信息数据）、Animations（动画数据）、AnimationClips（全局的动画信息），其中静态模型一般也就包括VisualScenes和Geometries。

当然我们的三维文件格式还有abc、glTF、fbx、obj、dae、stl、3ds等等

渲染步骤还是如法炮制
1、第一步呢还是照葫芦画瓢的老几样，初始化渲染器、场景、摄像机、轨道控制器、
2、这里通过GridHelper加了一个地板纹理
3、然后到了最关键的一步，加载dae的模型，其实这一步加载器ColladaLoader已经帮我做好大部分事情，我们仅仅需要读取到json对象中的scene字段并挂载到我们的场景中,以及模型运动轨迹的动画节点数据混合和挂载操作）
4、黑色大猩猩的那个图标点一下就能跳转页面

## Features

- ⚡️ [Vue 3](https://github.com/vuejs/vue-next), [Vite 2](https://github.com/vitejs/vite), [pnpm](https://pnpm.js.org/), [ESBuild](https://github.com/evanw/esbuild) - born with fastness

- 🗂 [File based routing](./src/pages)

- 📦 [Components auto importing](./src/components)

- 🎨 [UnoCSS](https://github.com/antfu/unocss) - The instant on-demand atomic CSS engine.

- 😃 Use icons from any icon sets in [Pure CSS](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

- 🔥 Use the [new `<script setup>` style](https://github.com/vuejs/rfcs/pull/227)

- ✅ Use [Vitest](http://vitest.dev/) for unit and components testing

- 🦾 TypeScript, of course

- ☁️ Deploy on Netlify, zero-config


<br>

See [Vitesse](https://github.com/antfu/vitesse) for full featureset.


## Dropped Features from [Vitesse](https://github.com/antfu/vitesse)

- ~~i18n~~
- ~~Layouts~~
- ~~SSG~~
- ~~PWA~~
- ~~Markdown~~

## Pre-packed

### UI Frameworks

- [UnoCSS](https://github.com/antfu/unocss) - The instant on-demand atomic CSS engine.

### Icons

- [Iconify](https://iconify.design) - use icons from any icon sets [🔍Icônes](https://icones.netlify.app/)
- [Pure CSS Icons via UnoCSS](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

### Plugins

- [Vue Router](https://github.com/vuejs/vue-router)
  - [`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages) - file system based routing
- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Directly use Vue Composition API and others without importing
- [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) - components auto import
- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs

## Try it now!

### GitHub Template

[Create a repo from this template on GitHub](https://github.com/antfu/vitesse-lite/generate).

### Clone to local

If you prefer to do it manually with the cleaner git history

```bash
npx degit antfu/vitesse-lite my-vitesse-app
cd my-vitesse-app
pnpm i # If you don't have pnpm installed, run: npm install -g pnpm
```
