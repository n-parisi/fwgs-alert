const chromium = require('chrome-aws-lambda');
const AWS = require('aws-sdk');

const ALERT_MSG = "Fine Wine & Good Spirits site is now taking orders! https://www.finewineandgoodspirits.com";
const TOPIC_ARN = "";

exports.handler = async (event, context, callback) => {
    let isDown = null;
    let browser = null;
    let args = chromium.args.slice();
    args.push('--disable-software-rasterizer');
    args.push('--disable-gpu');

    try {
        browser = await chromium.puppeteer.launch({
            args: args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        let page = await browser.newPage();
        await page.goto("https://www.finewineandgoodspirits.com", { waitUntil: "networkidle0" });
        let url = await page.url();
        console.log(url);

        //If routed to SpecialAccessLandingPage, then the site is down
        isDown = url.includes('SpecialAccessLandingPage');
        console.log(isDown);

        if (!isDown) {
            generateAlert();
        }

    } catch (error) {
        return callback(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
    const response = {
        statusCode: 200,
        headers: { "Content-type": "application/json" },
        body: isDown
    };
    return callback(null, response);
}

function generateAlert() {
    var sns = new AWS.SNS();
    var params = {
        Message: ALERT_MSG,
        TopicArn: TOPIC_ARN
    };
    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}




