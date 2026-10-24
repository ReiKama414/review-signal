import { SampleDataset } from '@/types';

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'ecommerce_tw',
    name: '電商購物平台顧客真實反饋',
    description: '涵蓋台灣綜合型電商 App 之物流時效、優惠券爭議、App 改版閃退與售後退貨等多元情境',
    industry: '電子商務 / 零售 App',
    icon: 'ShoppingCart',
    count: 36,
    reviews: [
      {
        id: 'ec-001',
        rating: 1,
        content: '更新後一直閃退！購物車裡面的折價券全部被清空，點結帳直接死機，太扯了，根本沒辦法買東西！',
        date: '2026-10-21',
        author: '林*豪',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['閃退', '折價券', '高急迫性'],
        device: 'iOS 18.2',
        version: 'v4.12.0'
      },
      {
        id: 'ec-002',
        rating: 1,
        content: '雙十一物流超慢，等了快兩個禮拜包裹才到超商，打開一看外包裝嚴重破損，裡面的玻璃瓶都碎了，客服還一直推卸責任！',
        date: '2026-10-18',
        author: 'Chen Emily',
        category: '物流配送與包裝 (Delivery)',
        tags: ['物流延遲', '包裝破損', '客服差'],
        device: 'Android 14',
        version: 'v4.11.2'
      },
      {
        id: 'ec-003',
        rating: 5,
        content: '出貨速度超級快！昨天下午下單今天中午就送到家了，包裝非常完整用心，商品質感好，值得推薦的好賣家！',
        date: '2026-10-24',
        author: '張小姐',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['出貨快速', '包裝良好', '五星推薦'],
        device: 'iOS 18.1',
        version: 'v4.12.0'
      },
      {
        id: 'ec-004',
        rating: 2,
        content: '客服態度差到極點，問個退款進度愛理不理，等了半小時只有機器人罐頭訊息，完全找不到真人客服處理問題。',
        date: '2026-10-20',
        author: 'Kevin Wu',
        category: '客戶服務與售後 (Customer Support)',
        tags: ['客服機器人', '無真人客服', '退款進度'],
        device: 'Android 15',
        version: 'v4.12.0'
      },
      {
        id: 'ec-005',
        rating: 1,
        content: '新版 UI 排版超級難用，商品分類改得亂七八糟，搜尋關鍵字跳出一堆無關的贊助廣告，字體又小，越改版越退步！',
        date: '2026-10-15',
        author: '王大明',
        category: '介面設計與易用性 (UI/UX)',
        tags: ['UI改版', '廣告過多', '易用性差'],
        device: 'iOS 17.6',
        version: 'v4.10.0'
      },
      {
        id: 'ec-006',
        rating: 2,
        content: '結帳時明明輸入折扣碼顯示折 200，最後信用卡扣款居然按原價扣，找客服反應還要我附截圖，系統 bug 憑什麼要買家承擔？',
        date: '2026-10-19',
        author: 'Huang Tina',
        category: '價格費用與退款 (Pricing & Refund)',
        tags: ['折扣碼失效', '扣錯款', '系統異常'],
        device: 'iOS 18.0',
        version: 'v4.11.5'
      },
      {
        id: 'ec-007',
        rating: 5,
        content: '商品品質優秀，材質比想像中厚實很多，顏色完全沒有色差，價格實惠，性價比超高，一定會再回購！',
        date: '2026-10-23',
        author: '許小芳',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['物美價廉', '回購', '品質滿意'],
        device: 'Android 14',
        version: 'v4.12.0'
      },
      {
        id: 'ec-008',
        rating: 1,
        content: '寄來的衣服有嚴重瑕疵，線頭亂七八糟還有明顯污漬，申請退貨居然要求買家自己付運費寄回，黑心賣家太扯了！',
        date: '2026-10-12',
        author: '廖*婷',
        category: '商品品質與期待 (Product Quality)',
        tags: ['商品瑕疵', '退貨爭議', '品質差'],
        device: 'iOS 18.1',
        version: 'v4.11.0'
      },
      {
        id: 'ec-009',
        rating: 4,
        content: '整體購物流程順暢，商品種類齊全，不過希望折價券的領取方式可以更直覺一點，現在藏在好多層選單裡面。',
        date: '2026-10-22',
        author: 'Derek Lin',
        category: '介面設計與易用性 (UI/UX)',
        tags: ['體驗良好', '建議改進', '選單動線'],
        device: 'Android 13',
        version: 'v4.12.0'
      },
      {
        id: 'ec-010',
        rating: 3,
        content: '物流速度普通，大概 4 天到貨。包裝只有一層破壞袋，幸好裡面的物品沒有壓壞，希望防撞氣泡紙可以包厚一點。',
        date: '2026-10-16',
        author: '周建華',
        category: '物流配送與包裝 (Delivery)',
        tags: ['包裝一般', '物流普通'],
        device: 'iOS 17.5',
        version: 'v4.10.2'
      },
      {
        id: 'ec-011',
        rating: 5,
        content: '客服人員非常親切！因為我填錯收件地址，半夜發訊息求助，隔天早上九點就主動打電話幫我更正並順利攔截出貨，太感謝了！',
        date: '2026-10-25',
        author: 'Samantha Kuo',
        category: '客戶服務與售後 (Customer Support)',
        tags: ['客服親切', '處理迅速', '暖心服務'],
        device: 'iOS 18.2',
        version: 'v4.12.0'
      },
      {
        id: 'ec-012',
        rating: 1,
        content: '每次滑到首頁中間就嚴重卡頓，滑動掉幀甚至直接卡死無回應，手機發燙超級嚴重，效能最佳化到底有沒有在做？',
        date: '2026-10-14',
        author: 'Chris Chang',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['卡頓', '手機發燙', '效能問題'],
        device: 'Android 12',
        version: 'v4.9.8'
      },
      {
        id: 'ec-013',
        rating: 4,
        content: '價格實惠比其他平台便宜不少，而且常有免運活動很划算。唯一小缺點是搜尋過濾的篩選器有時候會失效。',
        date: '2026-10-17',
        author: '郭育宏',
        category: '價格費用與退款 (Pricing & Refund)',
        tags: ['便宜實惠', '免運活動', '搜尋篩選'],
        device: 'iOS 18.0',
        version: 'v4.11.4'
      },
      {
        id: 'ec-014',
        rating: 1,
        content: '強制要求更新才能打開，更新完之後原本收藏的 50 多個商品清單全都不見了，登出再登入也找不回來，崩潰！',
        date: '2026-10-11',
        author: '楊雅涵',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['資料丟失', '強制更新', '收藏清單'],
        device: 'iOS 18.1',
        version: 'v4.11.0'
      },
      {
        id: 'ec-015',
        rating: 5,
        content: '退貨流程超級乾淨俐落！點選退貨後超商代碼立刻出來，貨寄出後兩天退款就入帳，完全沒有刁難，很令人放心的平台。',
        date: '2026-10-23',
        author: 'Vivian H.',
        category: '價格費用與退款 (Pricing & Refund)',
        tags: ['退款迅速', '售後良好', '信用良好'],
        device: 'iOS 18.2',
        version: 'v4.12.0'
      },
      {
        id: 'ec-016',
        rating: 2,
        content: '收到包裹時箱子都爛掉了，外層膠帶都開口笑，幸好裡面東西沒被偷。物流素質真的需要好好約束。',
        date: '2026-10-09',
        author: '趙柏翰',
        category: '物流配送與包裝 (Delivery)',
        tags: ['包裹破損', '物流粗暴'],
        device: 'Android 14',
        version: 'v4.10.1'
      },
      {
        id: 'ec-017',
        rating: 5,
        content: '介面乾淨俐落，現在深色模式做得很漂亮，晚上逛街眼睛舒服很多，讚！',
        date: '2026-10-24',
        author: 'Gary Tseng',
        category: '介面設計與易用性 (UI/UX)',
        tags: ['深色模式', '介面好看', '五星推薦'],
        device: 'iOS 18.2',
        version: 'v4.12.0'
      },
      {
        id: 'ec-018',
        rating: 1,
        content: '買了生鮮水果送到時全部發霉爛掉，酸臭味超重，跟照片完全不符，根本是黑心詐騙商品！',
        date: '2026-10-08',
        author: '彭美玲',
        category: '商品品質與期待 (Product Quality)',
        tags: ['生鮮發霉', '詐騙', '圖文不符'],
        device: 'Android 15',
        version: 'v4.9.5'
      },
      {
        id: 'ec-019',
        rating: 3,
        content: '東西不錯，但發票載具歸戶常常跳掉，每次結帳都要重新手動輸入手機條碼，有點麻煩。',
        date: '2026-10-13',
        author: 'Leo Kao',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['發票載具', '體驗小瑕疵'],
        device: 'iOS 17.6',
        version: 'v4.11.0'
      },
      {
        id: 'ec-020',
        rating: 5,
        content: '大推！商品品質精緻，出貨速度也快，已經連續回購三次了，身邊朋友都被我推坑。',
        date: '2026-10-25',
        author: 'Ruby Chen',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['大推', '品質精緻', '多次回購'],
        device: 'iOS 18.2',
        version: 'v4.12.0'
      },
      {
        id: 'ec-021',
        rating: 1,
        content: '更新 v4.12 後一直閃退，點進商品頁就黑屏退出，重裝三次還是一樣，請問工程師有在測試嗎？',
        date: '2026-10-25',
        author: 'Mark Tsai',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['黑屏', '閃退', '重裝無效'],
        device: 'Android 14',
        version: 'v4.12.0'
      },
      {
        id: 'ec-022',
        rating: 2,
        content: '商品少寄了一件，跟賣家與客服反映，兩個互相推諉，客服要我問賣家，賣家要我找平台，浪費我一整天時間！',
        date: '2026-10-17',
        author: '莊子萱',
        category: '客戶服務與售後 (Customer Support)',
        tags: ['缺件少寄', '推卸責任', '浪費時間'],
        device: 'iOS 18.1',
        version: 'v4.11.3'
      },
      {
        id: 'ec-023',
        rating: 4,
        content: '買到的耳機音質很好，價格比實體店便宜很多。物流兩天到算快，若包裝保護能再加強就完美了。',
        date: '2026-10-21',
        author: 'Andy Hsu',
        category: '商品品質與期待 (Product Quality)',
        tags: ['物超所值', '音質好', '包裝加強'],
        device: 'Android 15',
        version: 'v4.12.0'
      },
      {
        id: 'ec-024',
        rating: 1,
        content: '會員等級莫名其妙被降級，原本累積的折價券全部過期被回收，詢問客服只回一句系統規則變更，吃相難看！',
        date: '2026-10-07',
        author: '黃世榮',
        category: '價格費用與退款 (Pricing & Refund)',
        tags: ['會員權益', '折價券爭議', '吃相難看'],
        device: 'iOS 17.5',
        version: 'v4.9.0'
      },
      {
        id: 'ec-025',
        rating: 5,
        content: '客服專業且耐心回答！因為我對尺寸拿捏不定，客服小編量了實際尺寸給我參考，買回來剛剛好！',
        date: '2026-10-22',
        author: 'Peggy Liu',
        category: '客戶服務與售後 (Customer Support)',
        tags: ['客服耐心', '尺寸諮詢', '滿意度高'],
        device: 'iOS 18.0',
        version: 'v4.11.5'
      },
      {
        id: 'ec-026',
        rating: 1,
        content: '首頁全都是彈出式促銷廣告，關掉一個又跳出一個，不小心按到就跳轉去奇怪的博弈連結，這跟垃圾軟體有什麼兩樣？',
        date: '2026-10-10',
        author: '沈志強',
        category: '介面設計與易用性 (UI/UX)',
        tags: ['廣告轟炸', '誤觸跳轉', '垃圾軟體'],
        device: 'Android 13',
        version: 'v4.10.0'
      },
      {
        id: 'ec-027',
        rating: 4,
        content: '常在這裡買日用品，便宜又不用自己去賣場扛。配送員態度很親切，電梯大樓直接幫忙送到門口。',
        date: '2026-10-23',
        author: '蘇美娟',
        category: '物流配送與包裝 (Delivery)',
        tags: ['配送親切', '日常用品', '便利划算'],
        device: 'Android 14',
        version: 'v4.12.0'
      },
      {
        id: 'ec-028',
        rating: 1,
        content: '購買時寫現貨 24 小時出貨，下單後過了一個禮拜都沒動靜，去問才說工廠缺料要等一個月，騙人下單詐欺行為！',
        date: '2026-10-13',
        author: '賴冠宇',
        category: '物流配送與包裝 (Delivery)',
        tags: ['假現貨', '欺騙消費者', '延遲出貨'],
        device: 'iOS 18.1',
        version: 'v4.11.1'
      },
      {
        id: 'ec-029',
        rating: 5,
        content: 'App 介面更新後速度明顯變快很多，搜尋關鍵字精準，推薦商品也滿符合我的喜好，很棒的升級！',
        date: '2026-10-24',
        author: 'Eric Fan',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['速度提升', '搜尋精準', '推薦準確'],
        device: 'iOS 18.2',
        version: 'v4.12.0'
      },
      {
        id: 'ec-030',
        rating: 2,
        content: '退貨退款需要寄紙本折讓單，現在都什麼年代了還不能線上簽署？手續繁瑣得要命，根本是故意刁難消費者退貨！',
        date: '2026-10-16',
        author: '何宛玲',
        category: '價格費用與退款 (Pricing & Refund)',
        tags: ['紙本折讓單', '退貨繁瑣', '體驗不佳'],
        device: 'Android 14',
        version: 'v4.11.0'
      },
      {
        id: 'ec-031',
        rating: 5,
        content: '包裝超精緻！打開像收到禮物一樣，賣家還附上親手寫的感謝小卡，商品品質也沒話說，太用心了！',
        date: '2026-10-25',
        author: 'Cindy Yeh',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['包裝精緻', '手寫卡片', '用心店家'],
        device: 'iOS 18.2',
        version: 'v4.12.0'
      },
      {
        id: 'ec-032',
        rating: 1,
        content: '點進付款頁面卡住，按了兩次重新整理，結果收到銀行通知重複扣款兩筆！客服電話永遠忙線打不進去，急死人！',
        date: '2026-10-22',
        author: '錢家豪',
        category: '價格費用與退款 (Pricing & Refund)',
        tags: ['重複扣款', '付款卡住', '電話忙線'],
        device: 'iOS 18.1',
        version: 'v4.11.5'
      },
      {
        id: 'ec-033',
        rating: 3,
        content: '東西便宜，但商品頁面常常自動刷新跳回最頂部，看評論看到一半被刷掉很火大，麻煩工程師修一下這個 bug。',
        date: '2026-10-18',
        author: '羅文傑',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['頁面刷新bug', '體驗中等'],
        device: 'Android 13',
        version: 'v4.11.2'
      },
      {
        id: 'ec-034',
        rating: 5,
        content: '物流配送超神速！上午訂下午超商就簡訊通知取貨，而且保護墊包得很足夠，價格便宜又有免運，極度推薦！',
        date: '2026-10-25',
        author: '洪承佑',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['當日到貨', '免運', '強力推薦'],
        device: 'Android 15',
        version: 'v4.12.0'
      },
      {
        id: 'ec-035',
        rating: 1,
        content: '買到盜版假貨！官方旗艦店買的手機殼居然是粗糙劣質塑膠，邊角刮手味道刺鼻，投訴客服居然說無瑕疵不予退貨，極差！',
        date: '2026-10-14',
        author: '戴維倫',
        category: '商品品質與期待 (Product Quality)',
        tags: ['假貨爭議', '品質劣質', '客服拒退'],
        device: 'iOS 17.6',
        version: 'v4.10.1'
      },
      {
        id: 'ec-036',
        rating: 4,
        content: '功能齊全好上手，比以前好用多了。希望以後能增加夜間定時免打擾通知，半夜常被促銷推播吵醒。',
        date: '2026-10-20',
        author: '潘冠宇',
        category: '介面設計與易用性 (UI/UX)',
        tags: ['推播干擾', '好上手', '四星滿意'],
        device: 'iOS 18.0',
        version: 'v4.11.3'
      }
    ]
  },
  {
    id: 'saas_tool',
    name: 'SaaS 協作與敏捷專案工具反饋',
    description: '科技團隊與產品經理對專案管理工具之鍵盤快捷鍵、API 串接、白板效能與定價政策反饋',
    industry: 'B2B SaaS / 軟體工具',
    icon: 'Briefcase',
    count: 24,
    reviews: [
      {
        id: 'saas-001',
        rating: 1,
        content: '新版桌面版更新後狂卡頓！開啟大於 500 張票的看板直接死機卡死，記憶體飆到 6GB，嚴重影響團隊敏捷開發時程！',
        date: '2026-10-24',
        author: 'Senior Frontend Dev',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['記憶體暴增', '看板卡頓', '高急迫性'],
        device: 'macOS Sequoia',
        version: 'v2.18.0'
      },
      {
        id: 'saas-002',
        rating: 5,
        content: '快捷鍵操作太順暢了！命令列 Cmd+K 設計得極致優雅，幾乎不用碰滑鼠就能建票、指派工程師跟改狀態，團隊效率提升 40%！',
        date: '2026-10-25',
        author: 'Product Lead @Fintech',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['Cmd+K快捷鍵', '極致順暢', '效率倍增'],
        device: 'macOS Sequoia',
        version: 'v2.18.0'
      },
      {
        id: 'saas-003',
        rating: 1,
        content: '突然把 API 限流（Rate Limit）從 600 req/min 砍到 60 req/min，也沒寄信提前通知，我們 CI/CD 自動化建票全部掛掉！',
        date: '2026-10-20',
        author: 'DevOps Architect',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['API限流', 'CI/CD中斷', '無預警變更'],
        device: 'Ubuntu 24.04',
        version: 'API v2'
      },
      {
        id: 'saas-004',
        rating: 2,
        content: '取消了免費版的小型團隊 5 人方案，強制每人每月收 15 美金，否則唯讀封鎖！定價策略改得太激進，我們準備遷移到自建軟體。',
        date: '2026-10-18',
        author: 'Startup Founder',
        category: '價格費用與退款 (Pricing & Refund)',
        tags: ['定價爭議', '收費過高', '用戶流失'],
        device: 'Web Client',
        version: 'Cloud'
      },
      {
        id: 'saas-005',
        rating: 5,
        content: '與 GitHub 和 Slack 的 Webhook 整合做得非常穩定順暢，PR 合併自動關閉 Issue，通知乾淨不吵，推推！',
        date: '2026-10-23',
        author: 'Alex Chen',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['GitHub整合', 'SlackWebhook', '五星好評'],
        device: 'Web Client',
        version: 'v2.17.2'
      },
      {
        id: 'saas-006',
        rating: 2,
        content: '行動版 App 根本是閹割版，不能查看白板甘特圖，而且常常同步延遲，在外手機收不到緊急 bug 的即時推播。',
        date: '2026-10-15',
        author: 'QA Manager',
        category: '介面設計與易用性 (UI/UX)',
        tags: ['行動版閹割', '推播延遲', '甘特圖'],
        device: 'iOS 18.1',
        version: 'Mobile v1.4'
      },
      {
        id: 'saas-007',
        rating: 4,
        content: 'Markdown 編輯器支援表格跟 Mermaid 圖表非常棒，工程文件寫起來很舒服。希望搜尋可以支援正則表達式。',
        date: '2026-10-22',
        author: 'Tech Writer',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['Markdown', 'Mermaid圖表', '文件友善'],
        device: 'Windows 11',
        version: 'v2.18.0'
      },
      {
        id: 'saas-008',
        rating: 1,
        content: '離線模式有嚴重的衝突覆蓋 bug！在飛機上寫好的兩份需求規格，連上網路時直接被雲端舊版覆蓋沖掉，沒有任何歷史版本恢復！',
        date: '2026-10-12',
        author: 'Staff PM',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['離線衝突', '資料覆蓋丟失', '嚴重災難'],
        device: 'macOS Sonoma',
        version: 'v2.16.5'
      },
      {
        id: 'saas-009',
        rating: 5,
        content: '企業版客服支援速度驚人！遇到 SSO SAML 驗證問題，五分鐘內 Engineering Support 就拉專屬 Slack 頻道協助除錯解決。',
        date: '2026-10-24',
        author: 'IT Security Lead',
        category: '客戶服務與售後 (Customer Support)',
        tags: ['企業支援', 'SSO除錯', '秒回神速'],
        device: 'Web Client',
        version: 'Enterprise'
      },
      {
        id: 'saas-010',
        rating: 3,
        content: '權限設定（RBAC）太過複雜，Guest 跟 Member 的邊界模糊，好幾次實習生誤動到 Sprint 規劃的設定，權限層級需簡化。',
        date: '2026-10-16',
        author: 'Scrum Master',
        category: '介面設計與易用性 (UI/UX)',
        tags: ['權限混亂', 'RBAC複雜', 'UX需改進'],
        device: 'Web Client',
        version: 'v2.17.0'
      },
      {
        id: 'saas-011',
        rating: 1,
        content: '申請取消續約，按鈕藏在個人資料第 4 層選單，點了之後還強制彈出 5 次挽留問卷，最後一步還要寫信給專屬業務才給退訂，太噁心！',
        date: '2026-10-09',
        author: 'Finance Director',
        category: '價格費用與退款 (Pricing & Refund)',
        tags: ['黑心取消流程', '黑暗模式UX', '強迫續約'],
        device: 'Web Client',
        version: 'Billing Portal'
      },
      {
        id: 'saas-012',
        rating: 4,
        content: '自訂工作流程（Custom Workflows）自動化觸發器很強大，節省不少手動通知時間。介面若能提供更多官方模板就更棒了。',
        date: '2026-10-21',
        author: 'Operations Lead',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['工作流自動化', '節省時間', '模板需求'],
        device: 'macOS Sequoia',
        version: 'v2.18.0'
      }
    ]
  },
  {
    id: 'food_delivery',
    name: '外送美食與生鮮快送顧客評論',
    description: '餐飲外送平台的派送時效、包裝溢漏、地址備註遺漏與外送員暖心互動回饋',
    industry: '外送平台 / O2O 服務',
    icon: 'Utensils',
    count: 24,
    reviews: [
      {
        id: 'fd-001',
        rating: 1,
        content: '預估時間寫 25 分鐘，結果等了 75 分鐘！外送員在同一條街繞了半小時，送來的時候湯麵全部灑出，袋子底部破掉，餐點完全冷掉！',
        date: '2026-10-24',
        author: '陳小姐',
        category: '物流配送與包裝 (Delivery)',
        tags: ['外送嚴重延遲', '湯汁灑出', '餐點冷掉'],
        device: 'iOS 18.1',
        version: 'v8.3.0'
      },
      {
        id: 'fd-002',
        rating: 5,
        content: '下大雨辛苦外送員了！外送員非常細心把食物用防水袋包好兩層，送達時完全沒濕，還很親切說下雨天小心階梯濕滑，一定要給五星！',
        date: '2026-10-25',
        author: '林宏達',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['暖心外送員', '雨天防護', '貼心親切'],
        device: 'Android 15',
        version: 'v8.3.1'
      },
      {
        id: 'fd-003',
        rating: 1,
        content: '明明備註「嚴重海鮮過敏，絕對不要加蝦米」，店家完全沒看依然撒滿整碗，差點送急診！客服只賠 30 元折價券，人命只值 30 元嗎？',
        date: '2026-10-21',
        author: '張庭豪',
        category: '商品品質與期待 (Product Quality)',
        tags: ['備註忽視', '食物過敏', '賠償羞辱'],
        device: 'iOS 18.2',
        version: 'v8.3.0'
      },
      {
        id: 'fd-004',
        rating: 5,
        content: '遇到店家漏送飲料，在 App 點選回報問題，拍照上傳後 10 秒內 AI 客服直接核准退款至原信用卡，處理速度超級快又乾脆！',
        date: '2026-10-23',
        author: '黃怡君',
        category: '客戶服務與售後 (Customer Support)',
        tags: ['退款神速', '漏件秒賠', '滿意度高'],
        device: 'iOS 18.2',
        version: 'v8.3.1'
      },
      {
        id: 'fd-005',
        rating: 1,
        content: '會員訂閱費每個月自動扣款 129，結果外送費跟服務費完全沒免，店家餐點價格還比店內價貴了 35%，根本是在詐騙坑人！',
        date: '2026-10-19',
        author: '蔡宗憲',
        category: '價格費用與退款 (Pricing & Refund)',
        tags: ['會員訂閱爭議', '隱形加價', '收費不實'],
        device: 'Android 14',
        version: 'v8.2.8'
      },
      {
        id: 'fd-006',
        rating: 2,
        content: '外送員找不到地址，連一通電話都沒打，直接把餐點丟在一樓大馬路水溝蓋上就按已送達，等我下樓食物已經被野狗咬爛了，傻眼！',
        date: '2026-10-17',
        author: '許瑋婷',
        category: '物流配送與包裝 (Delivery)',
        tags: ['亂丟餐點', '沒打電話', '外送態度惡劣'],
        device: 'iOS 18.0',
        version: 'v8.2.5'
      },
      {
        id: 'fd-007',
        rating: 4,
        content: '附近餐廳選擇很多，配送員大概 30 分鐘內送到。唯獨即時地圖追蹤偶爾會卡住沒有即時更新 GPS 位置。',
        date: '2026-10-22',
        author: '郭俊偉',
        category: '滿意與產品讚譽 (Praise & Delight)',
        tags: ['送餐快速', 'GPS卡頓', '四星滿意'],
        device: 'Android 14',
        version: 'v8.3.0'
      },
      {
        id: 'fd-008',
        rating: 1,
        content: '更新後點進購物車按結帳就閃退，重新下載也是閃退，肚子餓得要命結果連點餐都點不了，爛透的 App！',
        date: '2026-10-25',
        author: '曾博文',
        category: '功能異常與閃退 (Bug & Crash)',
        tags: ['結帳閃退', '無法點餐', '緊急故障'],
        device: 'iOS 18.2',
        version: 'v8.3.1'
      }
    ]
  }
];

export function getSampleDataset(id: string): SampleDataset | undefined {
  return SAMPLE_DATASETS.find(d => d.id === id);
}
