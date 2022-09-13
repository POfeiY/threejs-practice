# 前端技术部落THREEJS主题分享

## [WebGL基础](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)
- WebGL简介

WebGL经常被当成3D API，人们总想“我可以使用WebGL和一些神奇的东西做出炫酷的3D作品”。 事实上WebGL仅仅是一个光栅化引擎，它可以根据你的代码绘制出点，线和三角形。
WebGL在电脑的GPU中运行。因此你需要使用能够在GPU上运行的代码。 这样的代码需要提供成对的方法。每对方法中一个叫顶点着色器， 另一个叫片断着色器，并且使用一种和C或C++类似的强类型的语言 GLSL。

几乎整个WebGL API都是关于如何设置这些成对方法的状态值以及运行它们。 对于想要绘制的每一个对象，都需要先设置一系列状态值，然后通过调用 gl.drawArrays 或 gl.drawElements 运行一个着色方法对，使得你的着色器对能够在GPU上运行。

着色器获取数据的4种方法： 1、属性（Attributes）和缓冲； 2、全局变量（Uniforms）； 3、纹理（Textures）；4、可变量（Varyings）；

渲染：在绘制之前我们应该调整画布（canvas）的尺寸以匹配它的显示尺寸。画布就像图片一样有两个尺寸。 一个是它拥有的实际像素个数，另一个是它显示的大小。CSS决定画布显示的大小。 你应该尽可能用CSS设置所需画布大小 ，因为它比其它方式灵活的多。

如果你想做三维渲染，你需要提供合适的着色器将三维坐标转换到裁剪空间坐标，因为WebGL只是一个光栅化API。

- WebGL工作原理

WebGL在GPU上的工作基本上分为两部分，第一部分是将顶点（或数据流）转换到裁剪空间坐标， 第二部分是基于第一部分的结果绘制像素点

WebGL每次绘制需要两个着色器，顶点着色器、片断着色器（为当前光栅化的像素提供颜色值）

光栅化 === 用像素画出来

对于每一个像素，它会调用你的片断着色器询问你使用什么颜色。 你通过给片断着色器的一个特殊变量gl_FragColor设置一个颜色值，实现自定义像素颜色

GLSL全称是 Graphics Library Shader Language （图形库着色器语言），是着色器使用的语言。它有一些不同于JavaScript的特性，主要目的是为栅格化图形提供常用的计算功能。

WebGL的全部内容就是创建不同的着色器，向着色器提供数据然后调用gl.drawArrays 或 gl.drawElements 让WebGL调用当前顶点着色器处理每个顶点，调用当前片断着色器渲染每个像素

- WebGL兼容性检查（WebGL compatibility check）

## WebGL Hello World


## Three.js 

### 基础

- Three.js与WebGL的关系

Three.js经常会和WebGL混淆， 但也并不总是，three.js其实是使用WebGL来绘制三维效果的。 WebGL是一个只能画点、线和三角形的非常底层的系统. 想要用WebGL来做一些实用的东西通常需要大量的代码， 这就是Three.js的用武之地。它封装了诸如场景、灯光、阴影、材质、贴图、空间运算等一系列功能，让你不必要再从底层WebGL开始写起。

## three.js 应用结构

- Renderer(渲染器) three.js的主要对象。你传入一个场景(Scene)和一个摄像机(Camera)到渲染器(Renderer)中，然后它会将摄像机视椎体中的三维场景渲染成一个二维图片显示在画布上。

- Scene(场景图) 一个树状结构，由很多对象组成，比如图中包含了一个场景(Scene)对象 ，多个网格(Mesh)对象，光源(Light)对象，群组(Group)，三维物体(Object3D)，和摄像机(Camera)对象。

- Camera(摄像机) 可以一半在场景图中，一半在场景图外的。这表示在three.js中，摄像机(Camera)和其他对象不同的是，它不一定要在场景图中才能起作用。相同的是，摄像机(Camera)作为其他对象的子对象，同样会继承它父对象的位置和朝向

- Mesh(网格) 用一种特定的材质(Material)来绘制的一个特定的几何体(Geometry)。材质(Material)和几何体(Geometry)可以被多个网格(Mesh)对象使用。比如在不同的位置画两个蓝色立方体，我们会需要两个网格(Mesh)对象来代表每一个立方体的位置和方向。

- Material(材质) 代表绘制几何体的表面属性，包括使用的颜色，和光亮程度。一个材质(Material)可以引用一个或多个纹理(Texture)，这些纹理可以用来，打个比方，将图像包裹到几何体的表面

- Geometry(几何体) 如球体、立方体、平面、狗、猫、人、树、建筑等物体的顶点信息。Three.js内置了许多基本几何体 。也可以创建自定义几何体或从文件中加载几何体。

- Light(光源)

## 开发基础

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

常见光源： AmbientLight 环境光 HemisphereLight 半球光 DirectionalLight 方向光 PointLight 点光源

1、环境光 （AmbientLight）只是简单地将材质的颜色与光照颜色进行叠加（PhotoShop 里的正片叠底模式），再乘以光照强度。可以看到场景内的物体看起来没有立体感。它没有方向，无法产生阴影，场景内任何一点受到的光照强度都是相同的，除了改变场景内所有物体的颜色以外，不会使物体产生明暗的变化，看起来并不像真正意义上的光照。通常的作用是提亮场景，让暗部不要太暗。

2、半球光
半球光（HemisphereLight）的颜色是从天空到地面两个颜色之间的渐变，与物体材质的颜色作叠加后得到最终的颜色效果。一个点受到的光照颜色是由所在平面的朝向（法向量）决定的 —— 面向正上方就受到天空的光照颜色，面向正下方就受到地面的光照颜色，其他角度则是两个颜色渐变区间的颜色。

场景基本上也没有太大的立体感。半球光 （HemisphereLight） 与其他类型光照结合使用，可以很好地表现天空和地面颜色照射到物体上时的效果。所以最好的使用场景就是与其他光照结合使用，或者作为环境光（AmbientLight）的一种替代方案。

3、方向光 DirectionalLight

方向光（DirectionalLight）常常用来表现太阳光照的效果。方形的小平面代表了一个方向光（DirectionalLight），方向光表示的是来自一个方向上的光，并不是从某个点发射出来的，而是从一个无限大的平面内，发射出全部相互平行的光线

4、点光源 PointLight 从一个点朝各个方向发射出光线的一种光照效果

- 摄像机

- 阴影

- 雾

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
