

const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

async function scrapeProduct(url, data) {
    const data2 = data
    const browser = await puppeteer.launch({
        headless: false,
    });
   
    const page = await browser.newPage()
   
    page.setDefaultNavigationTimeout(120000);
    await page.goto(url, {waitUntil: "networkidle0"})
    await page.waitForSelector('#username')

    console.log(data2[0])

    await page.$eval('#username', (el, data2) => el.value = data2[0], data2);
    await page.$eval('#password', (el, data2) => el.value = data2[1], data2);
    await page.click('button[type="submit"]');

    await page.waitForSelector('#fddAtpSelectorInputTopDiv > div > div > div > span > i')
    let carat = await page.$('#fddAtpSelectorInputTopDiv > div > div > div > span > i')
    await page.evaluate(el => el.click(), carat)

    if(data2[4] == 'S') {
        await page.waitForSelector('#ui-select-choices-row-0-1 > a')
        let spring = await page.$('#ui-select-choices-row-0-1 > a')
        await page.evaluate(el => el.click(), spring)
    } else if (data2[4] == 'F') {
        
        await page.waitForSelector('#ui-select-choices-row-0-0 > a')
        let fall = await page.$('#ui-select-choices-row-0-0 > a')
        await page.evaluate(el => el.click(), fall)
    }
   

    await page.waitForSelector('#showRegistrations')
    let tabularView = await page.$('#showRegistrations')
    await page.evaluate(el => el.click(), tabularView)

    await page.waitForSelector('#tabularCCRegistrationSelectorcourseOfferingHeader');

    let texts = await page.evaluate(() => {
        const data = []
        let elements = document.querySelectorAll("span.ng-binding")
        for (var element of elements)
            data.push(element.textContent.trim());

        data.splice(0, 22)
        index = data.indexOf("Section")
        data.length = index;
        return data;
    });
    var size = 11; 
    let arrayOfArrays = [];
    for (var i=0; i< texts.length; i+=size) {
        arrayOfArrays.push(texts.slice(i,i+size));
    }
    let remaining_items = []
    arrayOfArrays.forEach(element => {
        if (remaining_items.length != 0) {
            remaining_items.reverse().forEach(item => {
                element.unshift(item)
            });
            remaining_items = []
        }
        else if(element[0] == '' && element[1] == '' && element[2] == '' && element.at(-1) != ''){
            let mark = 0;
            element.forEach(item => {
                if(item != '') {
                    mark++
                }
                if(mark == 2) {
                    length = element.indexOf(item) - 1
                    num_to_add = 10 - length
                    reverse = num_to_add * -1
                    remaining_items = element.slice(reverse)
                    element.splice(length + 1, num_to_add, '')
                    for(var y = 0; y < num_to_add - 1; y++) {
                        element.push('')
                    }
                    mark++
                }
            })
        }
    });
    console.log(arrayOfArrays);
    setTimeout(() => console.log(arrayOfArrays[0][1]))
    console.log(typeof arrayOfArrays)
    console.log(arrayOfArrays.length)


    const calendar = 'https://calendar.google.com/calendar/u/0/r'
    await page.goto(calendar, {waitUntil: 'networkidle0'})
    await page.waitForSelector('#identifierId')
    await page.$eval('#identifierId', (el, data2) => el.value = data2[2], data2);
    await page.keyboard.press('Enter');
    await page.waitForSelector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input')
    await page.$eval('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', (el, data2) => el.value = data2[3], data2);
    await page.waitForSelector('#passwordNext > div > button')
    let btn = await page.$('#passwordNext > div > button')
    await page.evaluate(el => el.click(), btn)
    await page.keyboard.press('Enter');

    page.setDefaultNavigationTimeout(120000);
    

    
    for(var x = 0; x < arrayOfArrays.length; x++) {
        let course, days, startTime, endTime, location;
        if( arrayOfArrays[x][0] == '' && arrayOfArrays[x][1] == '') {
            console.log('here')
            if(arrayOfArrays[x][4].includes('AM') || arrayOfArrays[x][4].includes('PM')) {
                course = arrayOfArrays[x - 1][1]
                days = arrayOfArrays[x - 1][3].split(" ")
                const time = arrayOfArrays[x][4]
                const timeArr = time.split("-")
                startTime = timeArr[0].replace(/\s+/g, '').toLowerCase()
                endTime = timeArr[1].replace(/\s+/g, '').toLowerCase()
                const location = arrayOfArrays[x][6] + " " + arrayOfArrays[x][7]
                console.log(course, days, time, location)
            } else{
                continue
            }
            
        } else {
            course = arrayOfArrays[x][1]
            days = arrayOfArrays[x][3].split(" ")
            const time = arrayOfArrays[x][4]
            const timeArr = time.split("-")
            startTime = timeArr[0].replace(/\s+/g, '').toLowerCase()
            endTime = timeArr[1].replace(/\s+/g, '').toLowerCase()
            location = arrayOfArrays[x][6] + " " + arrayOfArrays[x][7]
            console.log(course, days, time, location)
        }
        
        await page.waitForTimeout(1000)
        await page.waitForSelector('body > div.tEhMVd > div.pSp5K > div.KKOvEb > div.dwlvNd > div > button')
        let create = await page.$('body > div.tEhMVd > div.pSp5K > div.KKOvEb > div.dwlvNd > div > button')
        await page.evaluate(el => el.click(), create)
        await page.waitForSelector('#yDmH0d > div > div > div.RDlrG.Inn9w.iWO5td > span > div > div.q2nced > div.K0f0Xc > div.ZX9XLb > div.mvRfff > div.rFrNMe.shdZ7e.Uj1FAb.zKHdkd > div.aCsJod.oJeWuf > div > div.Xb9hP > input')
        const titleBox = await page.$('#yDmH0d > div > div > div.RDlrG.Inn9w.iWO5td > span > div > div.q2nced > div.K0f0Xc > div.ZX9XLb > div.mvRfff > div.rFrNMe.shdZ7e.Uj1FAb.zKHdkd > div.aCsJod.oJeWuf > div > div.Xb9hP > input')
        await titleBox.type(course)

        await page.waitForTimeout(2000)

       
        const startt = await page.$('#tabEvent > div > div:nth-child(1) > div > div.Lvl1Vd > div > div > div.tsUyod.XsN7kf.K4rTkf.YS68Af > div.DX1o3 > div > span > span > div.s6I1Kd.XAsDAf > div > span:nth-child(1) > span')
       
        await page.waitForTimeout(1000)
        await startt.click()
        await page.waitForTimeout(500)
       
        await startt.type(startTime)
        await page.waitForTimeout(500)
        await page.keyboard.press("Enter")
        await page.waitForTimeout(300)
      
        await page.waitForSelector('div.uRdMwe > div > div:nth-child(1) > div > div.tsUyod.XsN7kf.K4rTkf.gkP7ud > div > div.JHD0Fd > div:nth-child(3) > div:nth-child(1) > div > label > div.mVuQpd > div > input')
        
        const endd = await page.$('div.uRdMwe > div > div:nth-child(1) > div > div.tsUyod.XsN7kf.K4rTkf.gkP7ud > div > div.JHD0Fd > div:nth-child(3) > div:nth-child(1) > div > label > div.mVuQpd > div > input')
        await endd.click()
        await page.waitForTimeout(500)
        
        await endd.type(endTime)
        await page.waitForTimeout(500)
        await page.keyboard.press("Enter")
        await page.waitForTimeout(500)

        const escape = await page.$('div.uRdMwe')
        await escape.click()
       
        let timebox = await page.$('#tabEvent > div > div:nth-child(1) > div > div.Lvl1Vd > div > div > div.tsUyod.XsN7kf.K4rTkf.YS68Af > div.DX1o3 > div > span > span > div.NAgJzc > div > ul > li:nth-child(2)')
        await page.evaluate(el => el.click(), timebox)
        await page.waitForTimeout(2000);
        await page.waitForSelector('div.uRdMwe > div > div.fy8IH > div.tsUyod.XsN7kf.DteUPd > div.bINkEb > div > div > div > div:nth-child(1) > div.ry3kXd.Ulgu9 > div.MocG8c.mZytBb.LMgvRb.KKjvXb > span', { visible: true })
        let doesNotRepeat = await page.$('div.uRdMwe > div > div.fy8IH > div.tsUyod.XsN7kf.DteUPd > div.bINkEb > div > div > div > div:nth-child(1) > div.ry3kXd.Ulgu9 > div.MocG8c.mZytBb.LMgvRb.KKjvXb > span')
        await page.evaluate(el => el.click(), doesNotRepeat)
        await page.waitForTimeout(500);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(300);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(300);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(300);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(300);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(300);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(500);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);


        const d = new Date();
        let day = d.getDay();
        let dayLetter;
        switch(day) {
            case 0:
            dayLetter = 'Sun'
            break;
            case 1:
            dayLetter = 'M'
            break;
            case 2:
            dayLetter = 'T'
            break;
            case 3:
            dayLetter = 'W'
            break;
            case 4:
            dayLetter = 'Th'
            break;
            case 5:
            dayLetter = 'F'
            break;
            case 6:
            dayLetter = 'Sat'
            break;
        }
        console.log(dayLetter)
        
        if(dayLetter == 'Sun') {
            const elements = await page.$x('//*[@id="xRecDay0"]')
            await elements[0].click() 
            await page.waitForTimeout(300)
        } else if (dayLetter == "Sat") {
            const elements = await page.$x('//*[@id="xRecDay6"]')
            await elements[0].click() 
            await page.waitForTimeout(300)
        }

        if(days.includes('M') && dayLetter != 'M') {
            const elements = await page.$x('//*[@id="xRecDay1"]')
            await elements[0].click() 
            await page.waitForTimeout(300)
        }
        if(days.includes('T') && dayLetter != 'T') {
            const elements = await page.$x('//*[@id="xRecDay2"]')
            await elements[0].click() 
            await page.waitForTimeout(300)
        }
        if(days.includes('W') && dayLetter != 'W') {
            const elements = await page.$x('//*[@id="xRecDay3"]')
            await elements[0].click() 
            await page.waitForTimeout(300)
        }
        if(days.includes('Th') && dayLetter != 'Th') {
            const elements = await page.$x('//*[@id="xRecDay4"]')
            await elements[0].click() 
            await page.waitForTimeout(300)
        }
        if(days.includes('F') && dayLetter != 'F') {
            const elements = await page.$x('//*[@id="xRecDay5"]')
            await elements[0].click() 
            await page.waitForTimeout(300)
        }

        if(!days.includes(dayLetter)) {
            let selector = 'xRecDay' + (day).toString()
            const elements2 = await page.$x('//*[@id="' + selector + '"]')
            await elements2[0].click() 
            await page.waitForTimeout(300)
        }
        await page.waitForTimeout(2000)
        const doneButton = await page.$x('/html/body/div[4]/div[2]/div/div[2]/div[3]/div[2]')
        await doneButton[0].click()
        await page.waitForTimeout(2000)
       
        console.log('here')
       
        const locationArea = await page.$x('//*[@id="tabEvent"]/div/div[5]/div[1]/div/div[2]/div/div/span')
        await locationArea[0].click()
        console.log('here2')
        await page.waitForTimeout(2000)
        const inputLocation = await page.$('.HU9Kad > div:nth-child(2) > div.tsUyod.XsN7kf > div > div.Lvl1Vd > div > div')
        await inputLocation.click()
        console.log('here3')
        await page.waitForTimeout(2000)
       
        const locationInput = await page.$('div.uRdMwe > div > div > div.TwDMuc > span > div > div.d1dlne.WvJxMd > div.rFrNMe.Ax4B8.ULpymb.zKHdkd.Tyc9J > div.aCsJod.oJeWuf > div > div.Xb9hP > input')
        
        await locationInput.type(location)
        await page.waitForTimeout(1000)
       
        const doneBtn2 = await page.$x('//*[@id="yDmH0d"]/div/div/div[2]/span/div/div[1]/div[3]/div[2]/div[4]/span/span')
        await doneBtn2[0].click() 
        
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
    };
   
}
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("What is your Agora Username? ", function(username) {
    rl.question("What is your Agora password? ", function(password) {
        rl.question("What is your bc email? ", function(email) {
            rl.question("What is your bc email password? ", function(epassword) {
                rl.question("Type 'S' for Spring courses, and 'F' for fall courses :) ", function(semester) {
                    if((semester == 'F' || semester == "S") && email.includes("bc.edu")) {
                        const path = [username, password, email, epassword, semester]
                        scrapeProduct('https://eaen.bc.edu/student-registration/#/', path)
                    } else {
                        console.log('Please insert valid inputs. Restart program to try again!')
                    }
                })
               
            })
        })
    });
});

