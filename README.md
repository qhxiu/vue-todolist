### 基础配置

1. npm install webpack vue vue-loader`

2. 根据安装时的提示安装需要的依赖`npm install css-loader`

3. 新建vue文件

4. 新建webpack.config.js配置文件

   - entry  入口文件路径，这里的路径用`path`模块生成一个绝对路径

     ```js
     entry: path.join(__dirname, 'src/index.js'),
     ```

   - output 出口文件，打包后的内容放在哪里

     - filename 文件名称
     - path 文件路径

     ```js
     output: {
       filename: 'bundle.js',
       path: path.join(__dirname, 'dist')
     }
     ```

   - module 

     - rules  存放需要的loader,loader的作用是将所有类型的文件转换成webpack能够处理的有效模块

     ```js
     module: {
       rules: [
         {
           test: /\.vue$/,
           loader: 'vue-loader'  //解析和转换.vue文件
         },
         {
           test: /\.css$/,
           loader: 'css-loader'  // 应用到普通的css文件以及vue中的<style>块
         }
       ]
     }
     ```

   - plugins 插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量

     - VueLoaderPlugin 这个插件是必须的，将你定义过的其它规则复制并应用到 `.vue` 文件里相应语言的块

     ```js
     const VueLoaderPlugin = require('vue-loader/lib/plugin')
     plugins: [
       new VueLoaderPlugin()
     ]
     ```

5. 在`package.json`中写入一条脚本

   ```
   "build": "webpack --config webpack.config.js"
   ```

6. 执行`npm run build`命令，打包完成，可以在`dist/bundle.js`看到打包后的文件内容

webpack的作用是把引用的资源打包成js，然后在html中引入js执行操作，在前端中，我们希望把零碎的js一起打包减少HTTP请求

### 配置静态资源及css预处理器

**css配置**

- vue-style-loader 把css打包到html文件的<style>标签中

  ```js
  {
    test: /.css$/,
    loader: ['vue-style-loader', 'css-loader']  // 应用到普通的css文件以及vue中的<style>块
  }
  ```

**资源路径**

> `file-loader` 可以指定要复制和放置资源文件的位置，以及如何使用版本哈希命名以获得更好的缓存，默认情况下，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名。此外，这意味着 **你可以就近管理图片文件，可以使用相对路径而不用担心部署时 URL 的问题**。使用正确的配置，webpack 将会在打包输出中自动重写文件路径为正确的 URL

> url-loader 当 Vue Loader 编译单文件组件中的 `template` 块时，它也会将所有遇到的资源 URL 转换为 **webpack 模块请求**，允许你有条件地将文件转换为内联的 base-64 URL (当文件小于给定的阈值)，这会减少小文件的 HTTP 请求数。如果文件大于该阈值，会自动的交给 `file-loader` 处理

**css预处理**

- stylus-loader 把styl文件转换为css文件

  ```js
  {
    test: /\.styl(us)?$/,
      loader: ['vue-style-loader', 'css-loader', 'stylus-loader']
  }
  ```

### webpack-dev-server

1. 安装 npm i webpack-dev-server

2. 通过命令行启用 `webpack-dev-server`

   ```js
   "dev": "webpack-dev-server --config webpack.config.js"
   ```

3. 配置文件同时用在正式环境和开发环境，所以这里的webpack配置是要根据不同环境做判断的，通过运行npm scripts设置的环境变量来标识当前时开发环境还是正式环境。这里变量需要安装一个包设置

   ```
   npm i cross-env
   ```

   使用

   ```js
   "build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
   "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
   ```

   在配置文件中通过`process.env.NODE_ENV === 'production'`判断当前环境

   在启动脚本时设置的这些环境变量全部存在`process.env`这个对象里的

4. 在配置文件中通过isDev判断在开发环境时配置devSever

   ```js
   if (isDev) {
     config.devServer = {
       port: 8000,
       host: '0.0.0.0',
       // overlay: 编译过程出现错误显示在网页上   
       overlay: {
         errors: true
       },
       // 启用模块的热更新
       hot: true
     }，
     config.plugins.push(
       // 启用webpack的热替换特性
       new webpack.HotModuleReplacementPlugin()
     )
   }
   ```

5. 还缺一个html入口，这里可以使用`html-webpack-plugin`这个插件，该插件将为你生成一个 HTML5 文件， 其中包括使用 `script` 标签的 body 中的所有 webpack 包。

   ```js
   const HtmlWebpackPlugin = require('html-webpack-plugin')
   
   plugins: [
     new HtmlWebpackPlugin()
   ]
   ```

6. `npm run dev`启动项目

7. `webpack`中还有一个`devtool`的属性，此选项控制是否生成，以及如何生成 source map，在开发环境中推荐`cheap-module-eval-source-map`，

   ```js
   config.devtool = '#cheap-module-eval-source-map'
   ```

### 配置postcss

PostCSS 的主要功能只有两个：第一个就是前面提到的把 CSS 解析成 JavaScript 可以操作的 抽象语法树结构，第二个就是**调用插件**来处理 AST 并得到结果。

1. 安装 `npm i postcss-loader`

2. 放在`css-loader`后面

   ```js
   {
     test: /.css$/,
     loader: ['vue-style-loader', 'css-loader', 'postcss-loader']
   }
   ```

3. `autoprefixer`时postcss中一个常用插件，作用是为 CSS 中的属性添加浏览器特定的前缀。

4. 先安装 `npm i autoprefixer -D`

5. 新建文件`postcss.config.js`

   ```js
   module.exports = {
     plugins: [
       require('autoprefixer')()
     ]
   }
   ```

postcss-loader配置

- sourceMap，如果postcss-loader后还有其他loader

  ```js
  {
    loader: 'postcss-loader',
    options: {
    	sourceMap: true // 在使用stylus-loader时会自动生成sourceMap,postcss-loader也可以生成sourceMap，但是当前面有处理器生成sourceMap后，可以直接使用前面生成的sourceMap来用，这样效率更快一些
    }
  }
  ```

  

### 配置vue的jsx写法

把jsx转换为浏览器能识别的代码，这是babel的作用，在babel执行编译过程中，会从项目的根目录下的`.babelrc`读取配置，`.babelrc`是一个`json`格式的文件。

在`.babelrc`文件中主要是对预设(presets)和插件(plugins)进行配置

- presets 告诉babel要转换的源码使用了哪些语法新特性，presets时一组plugins的集合

  - bebel-preset-env  可以根据目标环境的不同，按需加载插件，安装`npm i babel-preset-env -D`，根据安装后的提示安装需要的依赖

    ```json
    "presets": [
      "env"
    ]
    ```

- plugins 该属性是告诉babel要使用那些插件，这些插件可以控制如何转换代码。

  - babel-plugin-transform-vue-jsx 转换jsx代码，安装`npm i babel-plugin-trnasform-vue-jsx -D`，根据安装后的提示安装需要的依赖

    ```json
    "plugins": ["transform-vue-jsx"]
    ```

在`webpack`配置文件中为jsx文件配置babel-loader

```js
{
  test: /.jsx$/,
  loader: 'babel-loader'
}
```

如果还是报错，在`vue`文件的`script`标签中添加`lang`属性表示这里是`jsx`文件

```vue
<script lang="jsx">
```

### webpack配置css单独分离打包

该插件的主要是为了抽离 css 样式,防止将样式打包在 js 中文件过大和因为文件大网络请求超时的情况

> 请只在生产环境下使用 CSS 提取，这将便于你在开发环境下进行热重载

1. 安装 `mini-css-extract-plugin`

2. 引入 `const MiniCssExtractPlugin = require('mini-css-extract-plugin')`

3. 配置css

   ```json
   {
     test: /\.styl(us)?$/,
     use: [
       // 生产环境时把样式写在一个单独的css文件里，css-loader处理之后的内容已经够了
       isDev
       ? 'vue-style-loader'
       : MiniCssExtractPlugin.loader,
       'css-loader',
       // ...其他loader
     ]
   }
   
   plugins: [
     new MiniCssExtractPlugin({
       // contentHash是根据文件内容得到的hash值
       filename: 'styles.[contentHash:8].css'
     })
   ]
   ```

### webpack区分打包类库代码

单独打包类库文件也就是vue框架，为什么要把vue以及其他第三方包单独打包呢？因为这一类框架的代码稳定性是比较高的，业务代码是要经常更新迭代的，希望浏览器尽可能长的缓存静态文件，如果把类库代码和业务代码打包到一起，整个js文件都要跟着业务代码更新而更新，这样类库代码就不能很长时间的在浏览器缓存，我们希望更长时间的利用浏览器缓存来减少服务器流量以及加载速度更快，所以它们区分出来单独打包

optimization.splitChunks