# 概述
这里是 ofo 充电系统监控平台的 server 部分，分为两个部分，http 部分和 tcp 部分。http 部分提供监控平台前端的接口，tcp 部分负责和板卡通信。

## Git-Flow
代码托管在 Github 私人仓库

代码提交大致遵循git-flow。即master分支为发布分支，dev分支为开发分支，feature/xxx分支为功能分支，hotfix/xxx分支为bug修复分支。xxx为分支英文名称。dev分支为开发起点。feature、hotfix分支均从dev分支开出。开发完毕提交pr合并进dev分支。发布时合并进master分支。

## 后期愿景
- [ ] CI持续集成，CD持续部署
