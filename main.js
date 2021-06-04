const puppeteer = require("puppeteer");


const headless = false;  // 是否显示浏览器
const hueUrl = "http://hue-web-site:8889"  // hue地址
const pathHDFS = "/user/hue";  // 目的文件夹
const localFile = "C:\\Users\\root\\Desktop\\demo.txt";  // 待上传的文件
const username = "hue";
const password = "hue";

(async () => {
    // login
    const browser = await puppeteer.launch({headless: headless});
    const page = await browser.newPage();
    await page.goto(hueUrl);
    await page.$eval('#id_username', (el, user) => el.value = user, username);
    await page.$eval('#id_password', (el, passwd) => el.value = passwd, password);
    await page.focus('#id_password')
    await page.keyboard.press('Enter'); // enter
    console.log("login ok")

    await page.waitForNavigation();

    await page.goto(`${hueUrl}/hue/filebrowser/view=${pathHDFS}`,
        {"waitUntil": "networkidle0"});
    await page.setViewport({width: 1920, height: 1080})

    console.log("start upload")
    const uploadButton = await page.$('[id="upload-dropdown"]');
    await uploadButton.click();
    console.log("start transfer")
    const elementHandle = await page.$("input[type=file]");
    await elementHandle.uploadFile(localFile);

    console.log("done!");
    await browser.close();
})();