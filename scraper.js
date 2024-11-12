import Crawler from "crawler";
import { decode } from 'html-entities';

const allChildCareLinks = new Set();
const centresLinks = new Set();
const coordinatingOfficesLinks = new Set();

const c = new Crawler({
    maxConnections: 10, //use this for parallel, rateLimit for individual
    //rateLimit: 1000,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let baseWebLink = 'https://geoegl.msp.gouv.qc.ca/mfa/recherche-region.php';
            let englishWeb = '&langue=en';

            let $ = res.$; //get cheerio data, see cheerio docs for info

            let resultLinks = $('#results a');

            // let results = $('#results').children().find('.liste-resultats');

            // console.log($(results).find('a'));

            // $(resultLinks).each(function (i, link) {
            //     //Log out links
            //     var webLink = $(link).attr('href');
            //     if (webLink != undefined && webLink.includes('id=')) {
            //         console.log(webLink);
            //         allChildCareLinks.add(webLink + englishWeb);

            //         if (webLink.includes('fiche-service-garde')) {
            //             //figure out to separate for now
            //             centresLinks.add(webLink + englishWeb);
            //         } else {
            //             coordinatingOfficesLinks.add(webLink + englishWeb);
            //             c.add(baseWebLink + webLink + englishWeb);
            //         }

            //     }
            // });

            // let nextPaginationLink = $('[alt="Next"]').parent().attr('href');
            // console.log("add next page link: " + nextPaginationLink);
            // c.add(baseWebLink + nextPaginationLink);
            
            if(resultLinks.length === 0){//is a real page crawled on
                let allDetails = $('#fiche_descriptive');

                let address = allDetails.find('.adresse');
                // Loop through each element and process the content

                let addressContentHtml = $(address).html();
                let addressContentHtmlLines = addressContentHtml.split(/<br\s*\/?>/i);
                
                let streetAddress = addressContentHtmlLines[0].trim();
                let provinceAndPostalCode = addressContentHtmlLines[1].trim();
                
                console.log(decode(streetAddress));
                console.log(decode(provinceAndPostalCode));
                
                let content = allDetails.find('.contenu-fiche');

                let phoneData = content.children().eq(1).text().replace("Phone:", '').trim();
                let faxData = content.children().eq(2).text().replace("Fax:", '').trim();

                console.log(phoneData);
                console.log(faxData);
                
                let email = content.find('.electronique');
                let emailData = email.find('a').text();

                console.log(emailData);
                
                let resultsType = allDetails.find('.resultsType')
                let resultsTypeData = $(resultsType).text();
                let resultsTypeNumbersData = $(resultsType).parent().text().split(":")[1].replace("places", '').trim();

                console.log(resultsTypeData + resultsTypeNumbersData);

                let childCareProvidersNumData = content.find('.responsable').text().split(":")[1];

                console.log(childCareProvidersNumData); 

                let territoryCovered = allDetails.find('.territoire-couvert').find('.ficheTextNormal');

                let territoryManaged = territoryCovered.eq(0).html();
                let territoryManagedContent = territoryManaged.split(/<br\s*\/?>/i);
                
                let territoryManagedData = territoryManagedContent.map(item => item.trim()).filter(item => item.length > 0);

                console.log(territoryManagedData);

                let territoryMunicipalities = territoryCovered.eq(1).html();
                let territoryMunicipalitiesContent = territoryMunicipalities.split(/<br\s*\/?>/i);
                territoryMunicipalitiesContent.shift();
                let territoryMunicipalitiesData = territoryMunicipalitiesContent.map(item => item.trim()).filter(item => item.length > 0);;
                
                // territoryMunicipalitiesContent.forEach(line => {
                //     territoryMunicipalitiesData += line.trim();
                //   });

                console.log(territoryMunicipalitiesData);
            }
            
        }
        done();
    }
});

//Triggered when the crawler queue becomes empty
c.on('drain', async function () {
    console.log("Done.");
    // downloadLinks.forEach(async link => {
    //     var linkCopy = link.toLowerCase();
    //     if(linkCopy.includes("application") || linkCopy.includes("form") || linkCopy.includes("faq") || linkCopy.includes("guideline")){
    //         downloadLinks.delete(link);//gets rid of random pdfs that are not course outlines
    //     }else{
    //         var fileName = link.split("/");
    //         fileName = fileName[fileName.length - 1];
    //         console.log(fileName);

    //     }
    // });

    // console.log("Links Downloaded Size: ",downloadLinks.size);
});

//URL to scrape child care info from
c.add('https://geoegl.msp.gouv.qc.ca/mfa/fiche-bureau-coordonnateur.php?id=BC70054275&langue=en');