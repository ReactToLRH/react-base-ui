import React from 'react'
import { storiesOf } from '@storybook/react'

storiesOf('Welcome page', module)
  .add('welcome', () => {
    return (
      <>
        <h1>欢迎来到 react-base-ui 组件库</h1>
        <h3>安装</h3>
        <code>
          npm install react-base-ui --save
        </code>
      </>
    )
  }, { info : { disable: true }})