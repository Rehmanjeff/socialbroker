const puppeteer = require('puppeteer')
import axios from 'axios'
import { PlatformResponse, UsernameStatus } from '../types'
import { Browser } from 'puppeteer'

const proxy = {
    ip: '38.154.227.167',
    port: 5868,
    username: 'svidsdjy',
    password: 'dqwxvd9rxb4r'
}

export const getAvailability = async (id: number, url: string, username: string) => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    try {
        if (id == 1) {
            response = await isFacebookAvailable(url, username)
        } else if (id == 2) {
            response = await isInstagramAvailable(url, username)
        } else if (id == 3) {
            response = await isLinkedInAvailable(url, username)
        } else if (id == 4) {
            response = await isTwitchAvailable(url, username)
        } else if (id == 5) {
            response = await isYouTubeAvailable(url, username)
        } else if (id == 6) {
            response = await isPintrestAvailable(url, username)
        } else if (id == 7) {
            response = await isFiverrAvailable(url, username)
        } else if (id == 8) {
            response = await isImgurAvailable(url, username)
        } else if (id == 9) {
            response = await isAskFmAvailable(url, username)
        } else if (id == 10) {
            response = await isMediumAvailable(url, username)
        } else if (id == 11) {
            response = await isSoundCloudAvailable(url, username)
        } else if (id == 12) {
            response = await isBandcampAvailable(url, username)
        } else if (id == 13) {
            response = await isGravatarAvailable(url, username)
        } else if (id == 14) {
            response = await isDribbbleAvailable(url, username)
        } else if (id == 15) {
            response = await isTwitterAvailable(url, username)
        } else if (id == 16) {
            response = await isAboutMeAvailable(url, username)
        } else if (id == 17) {
            response = await isGithubAvailable(url, username)
        } else if (id == 18) {
            response = await isPatreonAvailable(url, username)
        } else if (id == 19) {
            response = await isDisqusAvailable(url, username)
        } else if (id == 20) {
            response = await isKickstarterAvailable(url, username)
        } else {
            response = await getStatusCode(url)
        }

        return response
    } catch (error) {
        console.log(error)
        return response
    }
}

const getStatusCode = async (url: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    try {
        const res = await axios.get(url)
        response.status = res.status == 200 ? 'taken' : 'available'

        return response
    } catch (error) {
        response.error = error as string
        return response
    }
}

const isFacebookAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    const browser : Browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const email : string = 't7851493@gmail.com'
    const password : string = 'bewareNAR(@'
    const checkUsernameUrl : string = 'https://accountscenter.facebook.com/profiles/61560075389144/username/?entrypoint=fb_account_center'
    const timeout : number = 120000
    let response : PlatformResponse = {
        status: null,
        error: null
    }

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: timeout })

        await page.type('#email', email)
        await page.type('#pass', password)
        await page.click('button[name="login"]')
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: timeout })

        await page.goto(checkUsernameUrl, { waitUntil: 'networkidle2', timeout: timeout })

        const inputField = await page.$(`input[type="text"]`)
        await inputField?.click({ clickCount: 3 })
        await inputField?.press('Backspace')
        await inputField?.type(username)

        await new Promise(function(resolve) {
            setTimeout(resolve, 2000)
        })

        const status = await page.evaluate(() => {
            const spans = Array.from(document.querySelectorAll('span'))
            for (const span of spans) {
                if (span.innerText.includes("Username is not available")) {
                    return 'taken'
                } else if (span.innerText.includes("Contains invalid characters")) {
                    return 'special_charac_not_allowed'
                } else if (span.innerText.includes("Must be at least 5 characters")) {
                    return 'too_little_characters'
                } else if (span.innerText.includes("Max length exceeded")) {
                    return 'too_many_characters'
                }
            }

            return 'available'
        })

        response.status = status as UsernameStatus
        await browser.close()

        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isLinkedInAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9]+$/
    if (username.length < 3){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 100) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser : Browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const email : string = 't7851493@gmail.com'
    const password : string = 'bewareNAR(@'
    const timeout : number = 120000

    try {

        const buttonSelector = 'button[type="submit"].btn__primary--large.from__button--floating'

        await page.goto(`${url}/login`)
        await page.waitForSelector(buttonSelector, { visible: true })
        await new Promise(function(resolve) {
            setTimeout(resolve, 2000)
        })
        await page.type('#username', email)

        await new Promise(function(resolve) {
            setTimeout(resolve, 1000)
        })
        await page.type('#password', password)

        await new Promise(function(resolve) {
            setTimeout(resolve, 1000)
        })
        await page.click(buttonSelector)
        await page.waitForSelector('a.ember-view.block', { visible: true })

        await page.goto(`${url}/in/${username}/`, { timeout: timeout })

        const status = await page.evaluate(() => {
            const h2s = Array.from(document.querySelectorAll('h2'))
            for (const h2 of h2s) {
                if (h2.innerText.includes("This page doesn’t exist")) {
                    return 'available'
                }
            }

            return 'taken'
        })

        response.status = status as UsernameStatus
        await browser.close()

        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isInstagramAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_.]+$/
    if (username.length < 5){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 30) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser : Browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000
    const resHolderSpanClass = 'xo3uz88'
    const errHolderSpanClass = 'x1nxxyus'

    try {

        await page.goto(`${url}/accounts/emailsignup/`, { waitUntil: 'networkidle2', timeout: timeout })

        const inputField = await page.$(`input[type="text"][name="username"]`)
        await inputField?.click({ clickCount: 3 })
        await inputField?.press('Backspace')
        await inputField?.type(username)
        await page.click('div._aai0')

        await new Promise(function(resolve) {
            setTimeout(resolve, 2000)
        })

        const spanElement = await page.evaluateHandle((input: any, resHolderSpanClass: string) => {
            const parentDiv = input.closest('div')
            if (!parentDiv) return null
            return parentDiv.querySelector(`span.${resHolderSpanClass}`)
        }, inputField, resHolderSpanClass)

        const isError = await page.evaluate((span, errHolderSpanClass) => {
            return !span || span.classList.contains(errHolderSpanClass)
        }, spanElement, errHolderSpanClass)

        response.status = isError ? 'taken' : 'available'
        await browser.close()

        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isTwitchAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_]+$/
    if (username.length < 4){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 25) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser : Browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000
    const errHolderClass = 'kfKMUE'

    try {

        const buttonSelector = 'button[data-a-target="signup-button"]'
        await page.goto(`${url}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector(buttonSelector, { visible: true })
        await page.click(buttonSelector)
        await page.waitForSelector('input#signup-username', { visible: true })

        const inputField = await page.$('input#signup-username')
        await inputField?.click({ clickCount: 3 })
        await inputField?.press('Backspace')
        await inputField?.type(username)
        await page.click('h2#modal-root-header')

        await new Promise(function(resolve) {
            setTimeout(resolve, 3000)
        })

        const isError = await page.evaluate((errHolderClass) => {
            const element = document.querySelector(`p.${errHolderClass}`)
            return element !== null
        }, errHolderClass)

        response.status = isError ? 'taken' : 'available'
        await browser.close()

        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isYouTubeAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_.]+$/
    if (username.length < 3){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 30) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const { statusCode, finalUrl } = await checkStatusCode(`${url}/@${username}`)
    response.status = statusCode == 404 ? 'available' : 'taken'
    return response
}

const isPintrestAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_]+$/
    if (username.length < 3){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 30) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser : Browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000
    const email : string = 't7851493@gmail.com'
    const password : string = 'bewareNAR(@'

    try {

        await page.goto(`${url}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('button')
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('button')
            buttons.forEach(button => {
                const div = Array.from(button.querySelectorAll('div')).find(div => div.innerText.includes('Log in'))
                if (div) {
                    button.click()
                }
            })
        })

        const divSelector = 'div[data-test-id="registerFormSubmitButton"]'
        await page.waitForSelector(divSelector)
        await new Promise(function(resolve) {
            setTimeout(resolve, 2000)
        })
        await page.type('#email', email)
        await new Promise(function(resolve) {
            setTimeout(resolve, 2000)
        })
        await page.type('#password', password)
        await page.evaluate((divSelector: string) => {
            const targetDiv = document.querySelector(divSelector)
            if (targetDiv) {
                const button = targetDiv.querySelector('button[type="submit"]') as HTMLElement
                if (button) {
                    button.click()
                }
            }
        }, divSelector)

        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: timeout })
        await page.goto(`${url}/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('div[data-test-id="notifications-button"]')

        const isError = await page.evaluate((text) => {
            const spans = document.querySelectorAll('span')
            for (const span of spans) {
                if (span?.textContent?.includes(text)) {
                    return false
                }
            }
            return true
        }, username)

        response.status = isError ? 'available' : 'taken'

        await browser.close()

        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isFiverrAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z][a-zA-Z0-9_]*$/
    if (username.length < 6){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 30) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser : Browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('body')
        const isError = await page.evaluate(() => {
            return document.body.classList.contains('not-found-page')
        })

        response.status = isError ? 'available' : 'taken'

        await browser.close()

        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isImgurAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9]+$/
    if (username.length < 4){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 63) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser : Browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/register`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('input#username')

        const inputField = await page.$(`input#username`)
        await inputField?.click({ clickCount: 3 })
        await inputField?.press('Backspace')
        await inputField?.type(username)
        const emailField = await page.$(`input#email`)
        await emailField?.click()

        await new Promise(function(resolve) {
            setTimeout(resolve, 500)
        })

        const status = await page.evaluate(() => {
            const isNotAvailable = Array.from(document.querySelectorAll('div.error-tipsy'))
            return isNotAvailable.length ? 'taken' : 'available'
        })

        response.status = status

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isAskFmAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_]+$/
    if (username.length < 3){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 30) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser : Browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('a.icon-askfm-logo')

        const status = await page.evaluate(() => {
            const isAvailable = Array.from(document.querySelectorAll('a[title="Return to main page"]'))
            return isAvailable.length ? 'available' : 'taken'
        })

        response.status = status

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isMediumAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_.]+$/
    if (username.length < 4){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 30) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser : Browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/@${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('a[data-testid="headerMediumLogo"]')

        const exists = await page.evaluate(() => {
            const div = Array.from(document.querySelectorAll('div')).find(div => div.innerText.includes('PAGE NOT FOUND'))
            if (div) {
                return false
            }

            return true
        })

        response.status = exists ? 'taken' : 'available'

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isSoundCloudAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-z0-9_-]+$/
    if (username.length < 3){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 25) {
        response.status = 'too_many_characters'
        return response
    } else if (/[A-Z]/.test(username)) {
        response.status = 'upper_case_letters_not_allowed'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('a.header__logoLink')

        const notExists = await page.evaluate((className: string) => {
            const div = document.querySelector(`div.${className}`);
            return !!div
        }, 'errorPage')

        response.status = notExists ? 'available' : 'taken'

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isBandcampAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-z0-9_-]+$/
    if (username.length < 3){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 60) {
        response.status = 'too_many_characters'
        return response
    } else if (/[A-Z]/.test(username)) {
        response.status = 'upper_case_letters_not_allowed'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('div#pgFt')

        const exists = await page.evaluate(() => {
            const h2 = Array.from(document.querySelectorAll('h2')).find(h2 => h2.innerText.includes('Sorry, that something isn’t here.'))
            if (h2) {
                return false
            }

            return true
        })

        response.status = exists ? 'taken' : 'available'

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isGravatarAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-z0-9]+$/
    if (username.length < 4){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 50) {
        response.status = 'too_many_characters'
        return response
    } else if (/[A-Z]/.test(username)) {
        response.status = 'upper_case_letters_not_allowed'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('div#unified-header')

        const exists = await page.evaluate(() => {
            const h2 = Array.from(document.querySelectorAll('h2')).find(h2 => h2.innerText.includes('Uh oh. Page not found'))
            if (h2) {
                return false
            }

            return true
        })

        response.status = exists ? 'taken' : 'available'

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isDribbbleAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_-]+$/
    if (username.length < 2){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 30) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000
    const email : string = 't7851493@gmail.com'
    const password : string = 'bewareNAR(@'

    try {

        const buttonSelector = 'input[type="submit"].btn2'

        await page.goto(`${url}/session/new`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector(buttonSelector, { visible: true })
        await new Promise(function(resolve) {
            setTimeout(resolve, 1000)
        })
        await page.type('#login', email)
        await new Promise(function(resolve) {
            setTimeout(resolve, 1000)
        })
        await page.type('#password', password)
        await new Promise(function(resolve) {
            setTimeout(resolve, 1000)
        })
        await page.click(buttonSelector)
        await page.waitForSelector('div.nav-v2', { visible: true })
        await page.goto(`${url}/${username}/about`, { timeout: timeout })
        await page.waitForSelector('body', { visible: true })

        const exists = await page.evaluate(() => {
            const h1 = Array.from(document.querySelectorAll('h1')).find(h1 => h1.innerText.includes('Whoops, that page is gone.'))
            if (h1) {
                return false
            }

            return true
        })

        response.status = exists ? 'taken' : 'available'
        await browser.close()

        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isTwitterAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_]+$/
    if (username.length < 4){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 15) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser = await puppeteer.launch({
        headless: false,
        args: [`--proxy-server=http://${proxy.ip}:${proxy.port}`]
    })
    const page = await browser.newPage()
    await page.authenticate({
        username: proxy.username,
        password: proxy.password
    })
    const timeout : number = 120000

    try {

        await page.goto(`${url}/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('nav[role="navigation"]')

        const exists = await page.evaluate((username: string) => {
            const span = Array.from(document.querySelectorAll('span')).find(span => span.innerText.includes('This account doesn’t exist'))
            if (span) {
                return false
            }

            return true
        }, username)

        const isSuspended = await page.evaluate((username: string) => {
            const span = Array.from(document.querySelectorAll('span')).find(span => span.innerText.includes('Account suspended'))
            if (span) {
                return true
            }

            return false
        }, username)

        response.status = exists ? 'taken' : (isSuspended ? 'suspended' : 'available')

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isAboutMeAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z][a-zA-Z0-9-._][a-z0-9A-Z]*$/
    if (username.length < 3){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 32) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('ul.applinks')

        const exists = await page.evaluate((username: string) => {
            const div = Array.from(document.querySelectorAll('div')).find(div => div.innerText.includes('Please check the name and try again.'))
            if (div) {
                return false
            }

            return true
        }, username)

        response.status = exists ? 'taken' : 'available'

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isGithubAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9]+(-?[a-zA-Z0-9]+)*$/
    if (username.length < 4){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 39) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('div.logged-out')

        const hasImage = await page.evaluate((altText: string) => {
            return !!document.querySelector(`img[alt="${altText}"]`)
        }, "404 “This is not the web page you are looking for”")

        response.status = hasImage ? 'available' : 'taken'

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isPatreonAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_]+$/
    if (username.length < 3){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 64) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    } else if (!/^(?![^a-zA-Z]*$).*/.test(username)) {
        response.status = 'must_contain_letter'
        return response
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/${username}/creators`, { waitUntil: 'networkidle2', timeout: timeout })
        await page.waitForSelector('div#__next')

        const exists = await page.evaluate(() => {
            const h4 = Array.from(document.querySelectorAll('h4')).find(h4 => h4.innerText.includes('This page could not be found'))
            if (h4) {
                return false
            }

            return true
        })

        response.status = exists ? 'taken' : 'available'

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isDisqusAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9_]+$/
    if (username.length < 2){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 30) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/by/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await new Promise(function(resolve) {
            setTimeout(resolve, 3000)
        })

        const exists = await page.evaluate(() => {
            const h1 = Array.from(document.querySelectorAll('h1')).find(h1 => h1.innerText.includes('Oops! This page could not be found!'))
            if (h1) {
                return false
            }

            return true
        })

        response.status = exists ? 'taken' : 'available'

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

const isKickstarterAvailable = async (url: string, username: string): Promise<PlatformResponse> => {

    let response : PlatformResponse = {
        status: null,
        error: null
    }

    // Testing on platform's basic conditions first
    const pattern = /^[a-zA-Z0-9-]+$/
    if (username.length < 3){
        response.status = 'too_little_characters'
        return response
    } else if (username.length > 20) {
        response.status = 'too_many_characters'
        return response
    } else if (!pattern.test(username)) {
        response.status = 'special_charac_not_allowed'
        return response
    } else if (!/^(?![^a-zA-Z]*$).*/.test(username)) {
        response.status = 'must_contain_letter'
        return response
    }

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const timeout : number = 120000

    try {

        await page.goto(`${url}/profile/${username}`, { waitUntil: 'networkidle2', timeout: timeout })
        await new Promise(function(resolve) {
            setTimeout(resolve, 3000)
        })

        const exists = await page.evaluate(() => {
            const p = Array.from(document.querySelectorAll('p')).find(p => p.innerText.includes('We can’t find this page'))
            if (p) {
                return false
            }

            return true
        })

        response.status = exists ? 'taken' : 'available'

        await browser.close()
        return response
    } catch (error) {
        console.log(error)
        await browser.close()
        response.error = error as string
        return response
    }
}

async function checkStatusCode(url: string, maxRedirects: number = 1) {
    try {
        const response = await axios.head(url, { maxRedirects: maxRedirects })
        return {statusCode: response.status, finalUrl: response.request.res.responseUrl || url}
    } catch (error: any) {
        if (error.response) {
            return {statusCode: error.response.status, finalUrl: url}
        } else if (error.request) {
            console.error('No response received:', error.request)
            return {statusCode: null, finalUrl: url}
        } else {
            console.error('Error in request setup:', error.message)
            return {statusCode: null, finalUrl: url}
        }
    }
}
