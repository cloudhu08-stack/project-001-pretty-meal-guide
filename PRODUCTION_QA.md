# Pretty Meal Guide V1.0 公网交付

验收日期：2026-10-06（Asia/Shanghai）。状态：**SHIPPED，等待用户人工验收**。

- Public URL：<https://pretty-meal-guide.vercel.app/>
- 平台：Vercel，`fine-dining / pretty-meal-guide`，Hobby。
- 生产部署：`dpl_J7zWED7bHS4hTwRYbqAbJkZuyb88`，READY。
- 部署详情：<https://vercel.com/fine-dining/pretty-meal-guide/J7zWED7bHS4hTwRYbqAbJkZuyb88>
- 部署源提交：`11201b1 prepare v1.0 production deployment`。
- Production build：**PASS**，Vercel 执行 `npm run build`，输出 `dist`，无需应用环境变量或安装依赖。

## 匿名访问及文件一致性

使用未携带 Vercel 登录 cookie、授权头或 bypass token 的普通 HTTPS 请求访问正式域名：首页 HTTP 200，返回项目 HTML。43 个生产文件（首页、数据、41 个图片文件）均成功下载，SHA-256 与本地 `dist` 一致。未出现登录墙。

五张 Homepage 外部图片已在实际公网浏览器加载；详情页引用的 30 个本地图片全部已上传。每家详情的 10 个图片 DOM 实例（轮播及支持图片）在进入相应视口后全部具有非零自然宽度。延迟加载的图片仅在滚动进入视口后判断结果。

## 公网 E2E

所有餐厅首先由正式域名 Homepage 的真实卡片点击进入。五家菜单按钮均保留 `restaurant` 路由；返回、前进、详情初始加载及刷新均通过。Da Vittorio 数据保留，正式 Homepage 和生产导航没有入口。

| Restaurant | Homepage→Detail | Images | Menu | Price | Reservation | Refresh | Status |
|---|---|---|---|---|---|---|---|
| Taian Table | PASS | PASS | 54号十道精选套餐 | ¥2,888/位 | 官方订位页面可打开，显示 Book a Table | PASS | READY |
| Fu He Hui | PASS | PASS | 2026年8月历史菜单可展开；当前完整菜单未公开 | 历史 ¥998/位；当前待确认 | 正确的电话链接 `tel:+862139809188` | PASS | READY WITH LIMITATION |
| Sushi Oyama | PASS | PASS | 2025年11月历史 Omakase 可展开；当前未确认 | 历史午餐 ¥800/位、晚餐 ¥980/位或 ¥1,280/位；当前待确认 | 正确的历史记录电话 `tel:+8618017563295`，页面提示先确认 | PASS | READY WITH LIMITATION |
| 8½ Otto e Mezzo BOMBANA | PASS | PASS | 午餐、八道品鉴和2025年10月历史单点分开呈现 | 现有记录没有可靠价格，正确显示待更新 | Mozrest 页面显示人数、日期、时间控件 | PASS | READY WITH LIMITATION |
| Yi Long Court | PASS | PASS | 点心午餐、赏味、家庭套餐和单点分开呈现 | ¥298/位、¥988/位、¥2,088/套；单点价格未确认 | 半岛官方页面可打开，显示 BOOK A TABLE | PASS | READY WITH LIMITATION |

电话仅验证链接格式和可用按钮，没有实际拨号。外部渠道由正式页面 CTA 打开并检查目的页，不提交预约或个人资料，也不承诺可订座位。

## 浏览器与移动端验证方法

正式域名主标签页完成 Homepage 五家真实点击、菜单、历史内容及三家 HTTPS 预约目的页检查。后续用本地 QA 外壳容纳实际公网 iframe，分别提供 1280px 桌面和 390px 移动 CSS 视口；iframe 的 HTML、JavaScript、数据及图片全部从正式 HTTPS 域名加载，未替换为 localhost 内容。

五个独立详情 URL 分别在新的 iframe 文档初始加载。浏览器 back/forward 恢复正确页面；刷新外层 QA 页重新加载相同公网详情 URL，餐厅状态正确，无 404 或无限 loading。记录包含实际 iframe URL、标题及图片加载状态。

Mobile Basic QA：**PASS**。五张卡片均可点击，五家 Hero 可见，菜单和价格文字正常，预约按钮可操作；实际内宽 390px、文档宽 375px，无横向溢出。轮播下一张按钮均由 `01 / 05` 变为 `02 / 05`，新图片自然宽度非零，Hero 高度保持约 625px。主标签页亦观察到自动轮播推进，菜单跳转不重新创建详情。没有观察到严重布局或动画问题。

此项验证覆盖浏览器窄视口，不代表已经做过实体 iPhone/Android 或所有浏览器的兼容验收。产品未做 Mobile redesign。

生产主标签页和 QA 窗口的错误/警告控制台记录为空。Vercel 对 `engines >=22` 的未来自动版本升级提示不影响本次构建，未为此扩大修改范围。

## 已知限制与交接

- 福和慧、鮨大山的当前菜单和价格仍待确认；鮨大山电话亦来自历史记录。
- BOMBANA 当前菜单仅有用餐方式列表，历史单点仅有菜品描述，没有可靠价格；逸龙阁单点价格及家庭套餐逐道明细未公开。这些内容保持原有表达，未新增推测值。
- Homepage 图片与 Google Fonts 仍依赖既有第三方 HTTPS 来源；详情图片已由项目托管。外部预约系统的网络速度和席位供应不由本站控制。
- GitHub 未推送：当前没有配置 remote 或已认证 GitHub CLI。本地仓库和提交已准备好，Vercel CLI 发布已完成，不依赖 GitHub。

没有重新设计 Homepage/Detail，没有修改配色、产品文案、Schema 或餐厅数据。唯一应用阻塞修复是菜单按钮保留餐厅 hash；其余为构建、部署配置、QA 工具及文档。最终 QA 文档和本地测试外壳不改变已发布 `dist` 内容。

生产截图和测试记录保存在被 Git 忽略的 `artifacts/production-qa/`：`production-detail.jpg`、`public-mobile-menu.jpg`、`public-file-parity.json`、`desktop-public.json`、`mobile-public.json`。测试外壳仅存在于 `scripts/serve-local.mjs` 的 `/__qa/*` 路径，未进入 `dist`，未向生产域名发布。

## Post-launch Backlog

详见 `PRODUCT_BACKLOG.md`。保留 Da Vittorio routing/loading、Honor system、Dish Hover/Mobile Preview、Real-time Availability、Experience Layer、Spoiler、Further Mobile polish、Custom domain。

V1.0 Shipping 工作到此结束，不开始 V1.1；下一步由用户打开正式地址人工验收。
