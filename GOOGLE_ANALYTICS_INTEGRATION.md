# Google Analytics 事件跟踪集成说明

## 概述

已成功为MediaGet应用集成Google Analytics 4 (GA4)事件跟踪功能，用于监控用户与analyze按钮和download按钮的交互行为，从而了解各个支持平台的使用情况。

## 集成的Analytics ID

```
G-1FGK5KKNVX
```

## 跟踪的事件类型

### 1. 分析按钮点击 (`analyze_button_click`)
当用户点击analyze按钮时触发，包含以下参数：
- `platform`: 媒体平台名称(YouTube, TikTok, Instagram等)
- `url_domain`: URL域名
- `event_category`: 'engagement'
- `event_label`: 'analyze_media'
- `custom_parameter_platform`: 平台名称(自定义维度)

### 2. 下载按钮点击 (`download_button_click`) 
当用户点击下载按钮时触发，包含以下参数：
- `platform`: 媒体平台名称
- `media_type`: 媒体类型(video/audio/image)
- `format`: 选择的格式
- `is_playlist`: 是否为播放列表下载
- `event_category`: 'conversion'
- `event_label`: 'start_download'
- `custom_parameter_platform`: 平台名称(自定义维度)
- `custom_parameter_media_type`: 媒体类型(自定义维度)

### 3. 下载完成 (`download_complete`)
当下载任务完成时触发，包含以下参数：
- `platform`: 媒体平台名称
- `media_type`: 媒体类型
- `format`: 下载格式
- `success`: 下载是否成功(true/false)
- `file_count`: 下载的文件数量
- `event_category`: 'conversion'
- `event_label`: 'download_success' 或 'download_failure'
- `custom_parameter_platform`: 平台名称(自定义维度)
- `custom_parameter_media_type`: 媒体类型(自定义维度)

### 4. 平台使用统计 (`platform_usage`)
跟踪每个平台的analyze和download操作，包含以下参数：
- `platform`: 媒体平台名称
- `action`: 操作类型('analyze' 或 'download')
- `event_category`: 'platform_analytics'
- `event_label`: '{platform}_{action}'
- `custom_parameter_platform`: 平台名称(自定义维度)

## 支持的平台识别

系统能自动识别以下平台：
- YouTube / YouTube Music
- Twitter/X
- Instagram
- TikTok
- Bilibili
- Facebook
- Reddit
- Vimeo
- Dailymotion
- Twitch
- SoundCloud
- Spotify
- LinkedIn
- Pinterest
- Tumblr
- Flickr
- Archive.org
- Bandcamp
- Mixcloud
- Amazon
- BBC
- CNN
- ESPN
- HBO
- Netflix
- Disney
- Paramount
- TED
- Udemy
- Zoom
- VKontakte
- Niconico
- 以及更多...

## 实现的文件

### 1. `/src/utils/analytics.ts`
核心分析工具函数，包含：
- `trackEvent()` - 发送自定义事件
- `trackAnalyzeClick()` - 跟踪分析按钮点击
- `trackDownloadClick()` - 跟踪下载按钮点击
- `trackDownloadComplete()` - 跟踪下载完成
- `trackPlatformUsage()` - 跟踪平台使用
- `getPlatformFromUrl()` - 从URL识别平台
- `determineMediaTypeFromFormat()` - 确定媒体类型

### 2. `/src/components/Hero.tsx`
主页Hero组件，在以下位置添加了事件跟踪：
- `handleAnalyze()` - 分析按钮点击时
- `handleDownload()` - 下载按钮点击时
- `pollTaskStatus()` - 下载完成时

### 3. `/src/components/Dashboard.tsx`
仪表板组件，在以下位置添加了事件跟踪：
- `handleDownloadFile()` - 下载文件按钮点击时
- `downloadCurrentFile()` - MediaPlayer中下载当前文件时
- `downloadAllFiles()` - MediaPlayer中下载所有文件时

### 4. `/index.html`
已包含Google Analytics代码：
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1FGK5KKNVX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-1FGK5KKNVX');
</script>
```

## 测试和验证

### 1. 本地测试文件
- `/test-analytics.js` - 控制台测试脚本
- `/public/analytics-test.html` - 可视化测试页面

### 2. 访问测试页面
在开发服务器运行时访问：
```
http://localhost:5173/analytics-test.html
```

### 3. Google Analytics实时报告
1. 访问 [Google Analytics](https://analytics.google.com)
2. 选择媒体属性
3. 点击 "实时" → "概览"
4. 在测试页面或应用中触发事件
5. 在实时报告中查看事件数据

## 数据分析建议

### 1. 平台受欢迎程度
通过`analyze_button_click`和`download_button_click`事件的`platform`参数，可以分析：
- 哪些平台最受用户欢迎
- 各平台的转化率(分析→下载)
- 平台使用趋势

### 2. 媒体类型偏好
通过`media_type`参数分析：
- 用户更喜欢下载视频、音频还是图片
- 不同平台的媒体类型分布
- 播放列表下载的使用情况

### 3. 格式选择
通过`format`参数了解：
- 用户最常选择的格式
- 高质量vs标准质量的偏好
- 不同平台的格式使用分布

### 4. 成功率分析
通过`download_complete`事件分析：
- 整体下载成功率
- 各平台的成功率差异
- 失败原因分析

## 自定义维度建议

在Google Analytics中设置以下自定义维度：
1. `custom_parameter_platform` - 媒体平台
2. `custom_parameter_media_type` - 媒体类型

这样可以创建更详细的报告和分析。

## 隐私说明

所有跟踪的数据都是匿名的，不包含：
- 具体的URL内容
- 用户个人信息
- 下载的文件内容

仅跟踪平台使用模式和功能交互，用于改进服务质量。
