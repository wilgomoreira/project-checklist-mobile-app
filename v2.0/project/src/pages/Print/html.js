import ImgToBase64 from 'react-native-image-base64';

export async function htmlChecklist(questions, results, comments, photos, photosSnaped) {
    let html = ''

    html += startHtml()
    html += styleOfHtml()

    html += titleOfHtml()
    html += await itemsOfHtml(questions, results, comments, photos, photosSnaped)
    html += endOfHtml()

    return html
}

function startHtml() {
    let html = '<!DOCTYPE html> <html> '
    return html
}

function styleOfHtml() {
    let html = ''

    html += `<head>
                <style>

                h1 {
                    text-align: center;
                }
                
                .rotate90 {
                    -webkit-transform: rotate(90deg);
                    -moz-transform: rotate(90deg);
                    -o-transform: rotate(90deg);
                    -ms-transform: rotate(90deg);
                    transform: rotate(90deg);
                }

                table {
                    font-family: arial, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                }

                td, th {
                    border: 1px solid #dddddd;
                    text-align: center;
                    padding: 5px;
                    font-size: 12px;
                 }

                tr {
                    page-break-inside: avoid;
                }

                .td-question{
                    text-align: left;
                    width: 25%
                }
                  
                .td-result{
                    text-align: center;
                    width: 20%
                }

                .td-comment{
                    text-align: left;
                    width: 25%
                }

                .td-image{
                    text-align: center;
                    width: 30%
                }
                .td-nophoto{
                    height: 200px;
                }

                </style>
            </head>`

    return html
}

function titleOfHtml() {
    let html = ''

    html += `<body>
            <h1> Checklist of Equipament </h1>
            </br> 
            </br>`

    return html
}

async function itemsOfHtml(questions, results, comments, photos, photosSnaped) {
    let html = ''

    html += `<table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Result</th>
            <th>Comment</th>
            <th>Photo</th>
          </tr>
        </thead>`
        
    html += '<tbody> '

    for (let index = 0; index < questions.length; index++) {
        html += '<tr>'
        html += `<td class="td-question"> ${index+1}. ${questions[index]} </td>`
        html += `<td class="td-result"> ${results[index]} </td>`
        html += `<td class="td-comment"> ${comments[index]} </td>`
        if(photos[index]){
            html += await handleImageHtml(photos[index], photosSnaped[index])
        }
        else{
            html += `<td class="td-nophoto"> NO PHOTO </td>`
        }
        html += '</tr>'    
    }

    html += '</tbody> </table>'

    return html
}

function endOfHtml() {
    let html = `</body> </html>`
    return html
}

async function handleImageHtml(image, imageSnaped) {
    try{
        const imgHtml = await ImgToBase64.getBase64String(image)
        if(imageSnaped){
            return `<td class="td-image"><img src="data:image/png;base64, ${imgHtml}" width="200px" height="200px" class="rotate90"> </td>`
        }
        else{
            return `<td class="td-image"><img src="data:image/png;base64, ${imgHtml}" width="200px" height="200px"> </td>`
        }
    }catch(e){
        console.log(e)
    }
}








