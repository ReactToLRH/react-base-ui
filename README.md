# react-base-ui

## 使用插件

+ [fortawesome](https://github.com/FortAwesome/react-fontawesome)
+ [react-transition-group](https://github.com/reactjs/react-transition-group)
+ UI文档生成工具
  + Storybook: UI组件开发管理的工具
  + react-docgen-typescript-loader
  + 代码注释 —— JSDoc's规范
+ [rimraf](https://www.npmjs.com/package/rimraf): 跨平台删除插件
+ [husky](https://www.npmjs.com/package/husky): git 提交前进行校验
  
  ```json
  // package.json 配置
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:nowatch && npm run lint"
    }
  },
  ```

## 知识点

+ scss - @import 分音 (Partials)

  如果需要导入 SCSS 或者 Sass 文件，但又不希望将其编译为 CSS，只需要在文件名前添加下划线，这样会告诉 Sass 不要编译这些文件，但导入语句中却不需要添加下划线。
+ 使用 `npm link` 本地测试组件库
+ 使用 `travis` 自动运行测试以及自动发布文档页面

## 目录结构

``` txt
src/
  components/
    Button/
      button.tsx
      button.test.tsx
      style.scss
  styles/
    _mixins.scss (全局 mixins)
    _reboot.scss (Normalize.css - 可以定制的CSS文件，它让不同的浏览器在渲染网页元素的时候形式更统一)
    _variables.scss (各种变量以及可配置设置)
    _functions.scss (全局 functions)
  index.tsx
package.json
tsconfig.json
```
