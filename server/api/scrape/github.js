import puppeteer from 'puppeteer'
import { eventHandler } from 'h3'

export default eventHandler(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" })
    const page = await browser.newPage()

    // await page.goto("https://github.com/FranktheFurter?tab=repositories")
    await page.goto('https://www.lcbo.com/en/products#t=clp-products&sort=relevancy&layout=card&f:@lcbo_current_offer=[Aeroplan%20Offers]', {
      waitUntil: 'networkidle2'
    })

    // await page.waitForSelector('#loadMore', { timeout: 5_000 })
    // await page.waitForSelector('#loadMore')

    const loadMore = await page.$$eval('#loadMore')
    console.log('loadMore', loadMore)

    
    // const products = await page.$$eval('#coveo-result-list2')
    // console.log('products', products)



    // const products = await page.$$eval(
    //   "#coveo-result-list2 > .coveo-result-list-container > div",
    //   (listItems) => {
    //     console.log('listItems', listItems)
    //     return listItems.map((div) => {
    //       return div
    //     })
    //   }
    // )

    await browser.close()

    return { bleh: ['meh'] }

    return { products }


    // const repositoriesList = await page.$$eval(
    //   "#user-repositories-list > ul > li",
    //   (listItems) => {
    //     return listItems.map((li) => {
    //       const titleElement = li.querySelector(
    //         'a[itemprop="name codeRepository"]'
    //       )
    //       const title = titleElement ? titleElement.innerText.trim() : null
    //       const link = titleElement
    //         ? `https://github.com${titleElement.getAttribute("href")}`
    //         : null

    //       const descriptionElement = li.querySelector(
    //         '[itemprop="description"]'
    //       )
    //       const description = descriptionElement
    //         ? descriptionElement.innerText.trim()
    //         : null

    //       const languageElement = li.querySelector(
    //         '[itemprop="programmingLanguage"]'
    //       )
    //       const language = languageElement
    //         ? languageElement.innerText.trim()
    //         : null

    //       const updateTimeElement = li.querySelector("relative-time")
    //       const updateTime = updateTimeElement
    //         ? updateTimeElement.getAttribute("datetime")
    //         : null

    //       return { title, link, description, language, updateTime }
    //     })
    //   }
    // )

    // await browser.close()

    // return { repositoriesList }
  } catch (error) {
    console.error("Error scraping:", error)
    throw new Error("An error occurred while scraping.")
  }
})
