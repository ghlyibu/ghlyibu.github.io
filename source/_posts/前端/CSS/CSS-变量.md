---
title: CSS 居中布局
date: 2023-03-17 12:24:39
tags: css
---
## 变量
CSS变量又名CSS自定义属性，指可在整个文档中重复使用的值。它由自定义属性--xxx和函数var(--xxx)组成，var()用于引用自定义属性。

示例：

```css
/* 不使用变量 */
.title {
    background-color: red;
}
.desc {
    background-color: red;
}
/* 使用变量 */
:root {
    --bg-color: red;
}
.title {
  	--red-color:red;
  	color:--red-color;
    background-color: var(--bg-color);
}
.desc {
    background-color: var(--bg-color);
}
```

看完可能会觉得使用变量的代码多了点，但如果有一天我们的网站需要一个换肤的功能，那这些变量就排上用场了。

CSS变量的优点

- 减少样式代码的重复性
- 增加样式代码的扩展性
- 提高样式代码的灵活性
- 增加一种CSS与JS的通讯方式

那么问题来了，sass和less早就实现了变量的特性，何必再多此一举呢？对比一下，变量确实有它的过人之处。

- 浏览器原生特性，无需经过任何转译可直接运行
- DOM对象一员，极大便利了CSS与JS间的联系

## 认识

关于CSS变量的认识，阮一峰老师的 《CSS 变量教程》 ，讲的就很好。

- 声明：--变量名
- 读取：var(--变量名, 默认值)
- 类型
  - 普通：只能用作属性值不能用作属性名 。
错误的示范
:root{
    ---margint:margin-top;
}
.title{
    var(---margint):20px;
}
  - 字符：与字符串拼接
.title{
   --world:"world";
   content: "hello,"var(--world);
}
  - 数值：使用calc() 与数值单位连用
.title{
   --gap: 20;
   margin-top: calc(var(--gap) * 1px);
}
- 作用域
  - 范围：在当前节点块作用域及其子节点块作用域下有效
  - 优先级别：内联样式 = 外联样式 > ID选择器 > 类选择器 = 伪类选择器 = 属性选择器 > 标签选择器 = 伪元素选择器 > 通配选择器 = 后代选择器 = 兄弟选择器

## 例子

### 条形加载条

```html
<ul class="strip-loading">
    <li v-for="v in 6" :key="v" :style="`--line-index: ${v}`"></li>
</ul>
```

普通写法

```css
.strip-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    li {
        border-radius: 3px;
        width: 6px;
        height: 30px;
        background-color: #f66;
        animation: beat 1s ease-in-out infinite;
        & + li {
            margin-left: 5px;
        }
        &:nth-child(2) {
            animation-delay: 200ms;
        }
        &:nth-child(3) {
            animation-delay: 400ms;
        }
        &:nth-child(4) {
            animation-delay: 600ms;
        }
        &:nth-child(5) {
            animation-delay: 800ms;
        }
        &:nth-child(6) {
            animation-delay: 1s;
        }
    }
}
@keyframes beat {
    0%,
    100% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(.5);
    }
}
```

css变量的写法

```css
.strip-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    li {
        --time: calc((var(--line-index) - 1) * 200ms);
        border-radius: 3px;
        width: 6px;
        height: 30px;
        background-color: #f66;
        animation: beat 1.5s ease-in-out var(--time) infinite;
        & + li {
            margin-left: 5px;
        }
    }
}
@keyframes beat {
    0%,
    100% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(.5);
    }
}
```

### 悬浮跟踪按钮

```html
<a class="track-btn" @mousemove="move">
    <span>妙用CSS变量，让你的CSS变得更心动</span>
</a>
```

```css
.track-btn {
    overflow: hidden;
    position: relative;      

    border-radius: 25px;
    width: 400px;
    height: 50px;
    background-color: #66f;
    cursor: pointer;
    line-height: 50px;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    color: #fff;
    span {
        position: relative;
        pointer-events: none;
    }
    &::before {
        --size: 0;
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: var(--size);
        height: var(--size);
        background-image: radial-gradient(circle closest-side, #09f, transparent);
        content: "";
        transform: translate3d(-50%, -50%, 0);
        transition: width 200ms ease, height 200ms ease;
    }
    &:hover::before {
        --size: 400px;
    }
}
```

```js
<script>
export default {
    name: "track-btn",
    methods: {
        move(e) {
            const x = e.pageX - e.target.offsetLeft;
            const y = e.pageY - e.target.offsetTop;
            e.target.style.setProperty("--x", `${x}px`);
            e.target.style.setProperty("--y", `${y}px`);
        }
    }
};
</script>
```

### 悬浮视差按钮

```html
<div ref="bg" class="bruce flex-ct-x" data-title="悬浮视差按钮">
    <a ref="btn" class="parallax-btn" data-name="妙用CSS变量，让你的CSS变得更心动" @mousemove="move" @mouseup="up" @mousedown="down" @mouseleave="leave"></a>
</div>
```

```css
.bruce {
	transform: perspective(800px);
	transform-style: preserve-3d;
}
.parallax-btn {
	position: relative;
	width: 400px;
	height: 50px;
	cursor: pointer;
	user-select: none;
	line-height: 50px;
	text-align: center;
	font-size: 18px;
	color: #fff;
	&::before {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		border-radius: 4px;
		background: linear-gradient(135deg, #6e8efb, #a777e3);
		box-shadow: 0 2px 5px rgba(#000, .2);
		content: "";
		will-change: transform;
		transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0)) rotateY(var(--ry, 0)) translateZ(var(--tz, -12px));
		transition: box-shadow 500ms ease, transform 200ms ease;
	}
	&::after {
		display: inline-block;
		position: relative;
		font-weight: bold;
		content: attr(data-name);
		will-change: transform;
		transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0)) rotateY(var(--ry, 0));
		transition: transform 200ms ease;
	}
	&:hover::before {
		box-shadow: 0 5px 15px rgba(#000, .3);
	}
}
```

```js
<script>
export default {
	mounted() {
		this.bgStyle = this.$refs.bg.style;
		this.btnRect = this.$refs.btn.getBoundingClientRect();
	},
	methods: {
		down(e) {
			this.bgStyle.setProperty("--tz", "-25px");
		},
		leave(e) {
			this.bgStyle.setProperty("--ty", "0");
			this.bgStyle.setProperty("--rx", "0");
			this.bgStyle.setProperty("--ry", "0");
		},
		move(e) {
			const dx = e.offsetX - this.btnRect.width / 2;
			const dy = e.offsetY - this.btnRect.height / 2;
			this.bgStyle.setProperty("--rx", `${dy / -1}deg`);
			this.bgStyle.setProperty("--ry", `${dx / 10}deg`);
		},
		up() {
			this.bgStyle.setProperty("--tz", "-12px");
		}
	}
};
</script>
```