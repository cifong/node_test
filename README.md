# node_test
自動簽到
使用到的外部模块
superagent   http 方面的库，可以发起 get 或 post 请求。 用來抓取 需要的頁面資料，與模擬登入。
cheerio   Node.js 版的 jquery，用来从网页中以 css selector 取数据，使用方式跟 jquery 一样一样的。處理抓回來的資料。

使用方法
1.安裝 node.js 環境
2.新建一个文件夹，进去之后 npm init
3.安装依赖 npm install --save PACKAGE_NAME
4.修改 config 內容 
5.修改 bat 檔內容路徑為檔案路徑
6.如果要開機就自動登入 可以把bat 檔案 放進 C:\Users\你的使用者名稱\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup 資料夾即可
