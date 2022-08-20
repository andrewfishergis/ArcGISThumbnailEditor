//Initialize variable to hold svd document object
let fontsizes = {
    'typetext': '16px',
    'nametext': '32px'
}

let iconset = {
    'Web Map': 'webmap.png',
    'Web Map Application': 'webapplication.png',
    'Dashboards': 'Dashboards.png',
    'Story Maps': 'StoryMaps.png',
    'Web Experience': 'ExperienceBuilder.png',
    'AGOL Feature Layer': 'agolfeaturelayer.png',
    'Portal Feature Layer': 'portalfeaturelayer.png',
    'Portal Locator': 'portalLocator.png',
    'Open Data Feature Layer': 'opendatafeaturelayer.png',
    'Portal Layer View': 'portallayerview.png',
    'Vector Tiles': 'vectortiles.png'
}

let svg_thumbnail;

let svg_template = 'Thumbnail_public'

//fetch the template svg then initalize the render in svg_canvas element
fetch(`./svg/${svg_template}.svg`)
.then(res => res.text())
.then(data => {let parser = new DOMParser(); svg_thumbnail = parser.parseFromString(data, "image/svg+xml")})
.then(svg => {initialRender()})




//onload initialization of DOM
window.onload = (event) => {
    //this initializes event listeners
    //document.getElementById('az_fill').addEventListener('change', changeProps)
    //document.getElementById('yav_fill').addEventListener('change', changeProps)
    document.getElementById('nametext_input').addEventListener('blur', changeText)
    document.getElementById('typetext_input').addEventListener('change', changeText)
    document.getElementById('organization_input').addEventListener('blur', changeText)
    //document.getElementById('background_input').addEventListener('change', changeBackgroundImage)
    document.getElementById('export').addEventListener('click', exportPNG)
    document.getElementById('nameplatecolor').addEventListener('change', changeProps)
    document.getElementById('typeplatecolor').addEventListener('change', changeProps)
    document.getElementById('cs').addEventListener('change', async function(e){
        if (e.target.checked) {
            let cc = await turnOffColorControls()
            changeColorScheme()
        } else {
            let cc = await turnOnColorControls()
            changeToUserColors()
        }
    })
    //custom dropdown for background selection
    document.getElementById('custom_bg').addEventListener('click', expandBGDropdown)
    document.addEventListener('click', function(e){
        if (e.target.parentElement.classList.contains('custom_option')) {
            changeBackgroundImage(`${e.target.parentElement.id}`, 'dropdown')
            document.getElementById('bg_chooser').style.opacity = 0;
            document.getElementById('bg_chooser').style.display = 'none'
        }
    })
    document.getElementById('cs').addEventListener('change', async function(e){
        if (e.target.checked) {
            let cc = await turnOffColorControls()
            changeColorScheme()
        } else {
            let cc = await turnOnColorControls()
            changeToUserColors()
        }
    })
    //document.getElementById('az_fill').addEventListener('change', changeProps)
    //document.getElementById('yav_fill').addEventListener('change', changeProps)
    document.getElementById('nametext_input').addEventListener('blur', changeText)
    document.getElementById('typetext_input').addEventListener('change', changeText)
    document.getElementById('datetext_input').addEventListener('change', changeText)
    //document.getElementById('background_input').addEventListener('change', changeBackgroundImage)
    document.getElementById('export').addEventListener('click', exportPNG)
    document.getElementById('nameplatecolor').addEventListener('change', changeProps)
    document.getElementById('typeplatecolor').addEventListener('change', changeProps)
    document.getElementById('upload_image').addEventListener('change', function(e){
        if (this.files && this.files[0]) {
            var url = URL.createObjectURL(this.files[0])
            console.log(url)
            changeBackgroundImage(url, 'upload')
        }
    })
    document.getElementById('upload_seal').addEventListener('change', function(e){
        if (this.files && this.files[0]) {
            var url = URL.createObjectURL(this.files[0])
            console.log(url)
            updateSealIcon(url)
            
        }
    })
    //populate year dropdown
    var ddlYears = document.getElementById("datetext_input");
    console.log(ddlYears)
    //Determine the Current Year.
    var currentYear = (new Date()).getFullYear();
    var blankoption = document.createElement("OPTION")
    blankoption.innerHTML = "No Year"
    blankoption.value= ""
    ddlYears.appendChild(blankoption)
    //Loop and add the Year values to DropDownList.
    for (var i = currentYear; i >= currentYear-50; i--) {
        var option = document.createElement("OPTION");
        option.innerHTML = i;
        option.value = i;
        console.log(option)
        ddlYears.appendChild(option);
    }
    ddlYears.value = 'none'

    //linking github
    document.getElementById('#github').addEventListener('click', function(){
        window.open('https://github.com/andrewfishergis/ArcGISThumbnailEditor', '_blank')
    })
}

//This is only called initally to render the template svg
async function initialRender(data){
    svg_canvas = document.querySelector('#svg_canvas');
    ctx = svg_canvas.getContext('2d');
    //User Canvg library to load template svg
    v = await canvg.Canvg.from(ctx, './svg/Thumbnail_public.svg');
    // Start SVG rendering with animations and mouse handling.
    v.start();
    fetch(`./svg/${svg_template}.svg`)
    .then(res => res.text())
    .then(data=>generateCustomVectors(data))
}

//This is the secret sauce. This will render changes made to svg_thumbnail global svg document element
async function newSVGRender() {
    let svg_text = new XMLSerializer().serializeToString(svg_thumbnail.documentElement)
    console.log(svg_text)
    console.log('new svg')
    svg_canvas = document.querySelector('#svg_canvas');
    ctx = svg_canvas.getContext('2d');
    
    v = await canvg.Canvg.fromString(ctx, svg_text);

    v.start()
}

//Used to change properties such as fill and stroke
function changeProps(e) {
    let id = e.target.id
    let color = e.target.value
    let p = e.target.parentElement.id
    let type = "fill"
    updateSVG(p, type, color)
}

//Used to change text items
function changeText(e) {
    let p = e.target.parentElement.id
    if (p == 'nametext') {
        updateSVGText(p, e.target.value)
    } else if (p == 'typetext'){
        updateSVGText(p, e.target.options[e.target.selectedIndex].text)
        updateTypeIcon(e.target.options[e.target.selectedIndex].value)
    } else if (p == 'featurelayertext') {
        updateSVGText(p, e.target.value)
    } else if (p == 'datetext'){
        updateSVGText(p, e.target.value)
    } else if (p == 'organization') {
        updateSVGText(p, e.target.value)
    }
}

async function changeBackgroundImage(image_name, type) {
    //image_name = `${e.target.options[e.target.selectedIndex].value}.png`
    image_path = type == 'upload' ? image_name : `.\\images\\${image_name}`
    svg_thumbnail.querySelectorAll('#BACKGROUND')[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', image_path)
    if (document.getElementById('cs').checked) {
        let cs = await getColorScheme()
        let np = await changePlateColors(cs)
        let gf = await changeGraphicColors(cs)
    }
    newSVGRender()
}

//Used to add text objects to LAYERINFOS object in svg
function addLayerInfo(e){
    //grab text elements from #LAYERINFOS in svg
    l = svg_thumbnail.querySelectorAll('#layer7 > text')
    //get the last text element added
    prev_text = l[l.length-1]
    //This was hardcoded, maybe there's a way to get the correct x position dynamically?
    let x = "260"
    //grab y value from previous text element then apply a transformation of 20px to it. This fakes a new line.
    let y = prev_text.attributes['y'].value
    let newy = parseFloat(y)
    newy = newy+20
    newy = newy.toString()
    //grab style attribute from the previous text element    
    let style = prev_text.attributes['style'].value
    //set up new text node
    var svgNS = "http://www.w3.org/2000/svg";
    var newText = svg_thumbnail.createElementNS(svgNS,"text");
    newText.setAttribute("x",x);   
    newText.setAttribute("y",newy ); 
    newText.style = style
    newText.style.fontSize = '10px'
    var textNode = svg_thumbnail.createTextNode(`- ${document.getElementById('layer_info').value}`);
    newText.appendChild(textNode);
    svg_thumbnail.getElementById('layer7').appendChild(newText);
    //render svg with changes!!!!
    newSVGRender()
}

//this function helps us update color changes in our SVG document object
function updateSVG(id, type, color) {
    console.log(color)
    let path
    if (["NAMEPLATE", "TYPEPLATE"].includes(id)){
        path = svg_thumbnail.getElementById(`${id}`)
    } else if (id.includes('V_')) {
        path = svg_thumbnail.querySelectorAll(`#${id}`)[0]
    } else {
        path = svg_thumbnail.querySelectorAll(`#${id} > g > path`)[0]
    }
    console.log(path.style.fill)
    if (type == "fill") {
        console.log('changing fill')
        path.style.fill = color
    }
    console.log(path.style.fill)
    newSVGRender()
}


//this function helps us update the text content in our SVG Document element. Used only for layer name currently
function updateSVGText(id, text) {
    if (id == 'datetext') {
        svg_thumbnail.querySelectorAll('#datetext')[0].style.opacity = '1'
        let t = svg_thumbnail.querySelectorAll(`#${id} > tspan`)[0]
        t.textContent = text

    } else {
        if (id == 'nametext') {
            let fontsize = determineFontSize(text, 'name')
        let t = svg_thumbnail.querySelectorAll(`#${id} > tspan`)[0]
        t.textContent = text
        t.style.fontSize = fontsize
        } else {
            let fontsize = determineFontSize(text, 'type')
            let t = svg_thumbnail.querySelectorAll(`#${id} > tspan`)[0]
            t.textContent = text
            t.style.fontSize = fontsize
        }
        
    }
    newSVGRender()
}

function updateTypeIcon(id) {
    let icon = `.\\icons\\${iconset[id]}`
    svg_thumbnail.querySelectorAll('#ICON')[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', icon)
    newSVGRender()
    
}

//Export our svg_canvas to SVG and download!
function exportPNG() {
    let svg_canvas = document.getElementById('svg_canvas')
    var link = document.getElementById('link');
    var name = document.getElementById('png_name').value
    link.setAttribute('download', `${name}.png`);
    link.setAttribute('href', svg_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
}

function determineFontSize(s, t){
    let l = s.length
    let f
    if (l > 0 && l < 11) {
        f = t == 'name' ? '72px' : '40px'
    } else if (l > 10 && l < 16) {
        f = t == 'name' ? '44px' : '34px'
    } else if (l > 15 && l < 21) {
        f = t == 'name' ? '38px' : '30px'
    } else if (l > 20 && l < 26) {
        f = t == 'name' ? '32px' : '24px'
    } else if (l > 25 && l < 31) {
        f = t == 'name' ? '26px' : '20px'
    } else {
        f = t == 'name' ? '24px' : '16px'
    }
    return f
}

async function getColorScheme() {
    var scheme = 'vibrant'
    let nameplatecolor;
    let typeplatecolor;
    let azcolor;
    let yavcolor;
    let bgimg_path;
    let image = new Image();
    let imageload = onload2promise(image)
    let bgimg = svg_thumbnail.querySelectorAll('#BACKGROUND')[0].attributes['xlink:href'].textContent
    let per = bgimg.match(/\./g).length
    if (per == 3) {
        if (bgimg.includes('blob')) {
            bgimg_path = bgimg
        } else {
            bgimg_path = bgimg.slice(1, bgimg.length)
        }

    } else {
        bgimg_path = bgimg
    }
    image.src = bgimg_path
    await imageload
    var vibrant = new Vibrant(image);
    var swatches = vibrant.swatches()
    if (scheme == 'vibrant') {
        if (swatches.DarkVibrant) {
            nameplatecolor = swatches.DarkVibrant.rgb
            azcolor = swatches.DarkVibrant.rgb
        } else if (swatches.MuteVibrant) {
            nameplatecolor = swatches.MuteVibrant.rgb
            azcolor = swatches.MuteVibrant.rgb
        } else if (swatches.Vibrant) {
            nameplatecolor = darkenColor(swatches.Vibrant.rgb)
            azcolor = darkenColor(swatches.Vibrant.rgb)
        } else if (swatches.LightVibrant) {
            nameplatecolor = darkenColor(swatches.LightVibrant.rgb)
            azcolor = darkenColor(swatches.LightVibrant.rgb)
        } else if (swatches.Muted){
            nameplatecolor = darkenColor(swatches.Muted.rgb)
            azcolor = darkenColor(swatches.Muted.rgb)
        } else {
            nameplatecolor = [100, 100, 100]
            azcolor = [100, 100, 100]
        }
        if (swatches.LightVibrant) {
            typeplatecolor = swatches.LightVibrant.rgb
            yavcolor = swatches.LightVibrant.rgb
        } else if (swatches.Vibrant) {
            typeplatecolor = lightenColor(swatches.Vibrant.rgb)
            yavcolor = lightenColor(swatches.Vibrant.rgb)
        } else if (swatches.MuteVibrant) {
            typeplatecolor = lightenColor(swatches.MuteVibrant.rgb)
            yavcolor = lightenColor(swatches.MuteVibrant.rgb)
        } else if (swatches.Muted){
            typeplatecolor = darkenColor(swatches.Muted.rgb)
            yavcolor = darkenColor(swatches.Muted.rgb)
        } else {
            typeplatecolor = [50, 50, 50]
            yavcolor = [50, 50, 50]
        }
        
    }
    let colors
    let namergb = `rgb(${nameplatecolor[0]}, ${nameplatecolor[1]}, ${nameplatecolor[2]})`
    let typergb = `rgb(${typeplatecolor[0]}, ${typeplatecolor[1]}, ${typeplatecolor[2]})`
    let azcolorrgb = `rgb(${azcolor[0]}, ${azcolor[1]}, ${azcolor[2]})`
    let yavcolorrgb = `rgb(${yavcolor[0]}, ${yavcolor[1]}, ${yavcolor[2]})`
    colors = {
        'name': namergb,
        'type': typergb,
        'az': azcolorrgb,
        'yav': yavcolorrgb
    }
    return colors 
}

function onload2promise(obj) {
    return new Promise((resolve, reject) =>{
        obj.onload = () => resolve(obj);
        obj.onerror = reject
    })
}


async function changePlateColors(colors) {
    svg_thumbnail.getElementById('NAMEPLATE').style.fill = colors['name']
    svg_thumbnail.getElementById('TYPEPLATE').style.fill = colors['type']
}

async function changeGraphicColors(colors) {
    
}

async function changeColorScheme() {
    let cs = await getColorScheme()
    let pc = await changePlateColors(cs)
    let sc = await changeGraphicColors(cs)
    newSVGRender()
}

async function changeToUserColors() {
    let colors = {}
    for (var c of document.querySelectorAll('input[type="color"]')) {
        let id = c.parentElement.id
        colors[id] = c.value
    }
    for (var i in colors) {
        let path;
        if (["NAMEPLATE", "TYPEPLATE"].includes(i)){
            path = svg_thumbnail.getElementById(`${i}`)
        } else if (i.includes('V_')) {
            path = svg_thumbnail.getElementById(`${i}`)
        } else{
            path = svg_thumbnail.querySelectorAll(`#${i} > g > path`)[0]
        }
        path.style.fill = colors[i]
    }
    newSVGRender()
}

async function turnOffColorControls() {
    for (var c of document.querySelectorAll('input[type="color"]')) {
        c.disabled = true
    }

    for (var e of document.querySelectorAll('.color_input')) {
        e.classList.add('inactive')
    }
}

async function turnOnColorControls() {
    for (var c of document.querySelectorAll('input[type="color"]')) {
        c.disabled = false
    }
    for (var e of document.querySelectorAll('.color_input')) {
        e.classList.remove('inactive')
    }
}

function lightenColor(rgb) {
    l = rgb.map(c => Math.floor(c*2))
    newrgb = []
    for (let color of l) {
        if (parseInt(color) > 255) {
            color = '255'
            newrgb.push(color)
        } else {
            newrgb.push(color)
        }
    }
    return newrgb
}

function darkenColor(rgb) {
    newrgb = rgb.map(c => Math.floor(c/1.75))
    return newrgb
}

function expandBGDropdown(){
    var dd = document.getElementById('bg_chooser')
    if (dd.style.opacity == 1){
        dd.style.opacity = 0
        dd.style.display = 'none'
        return
    }
    document.getElementById('bg_chooser').style.opacity = 1
    document.getElementById('bg_chooser').style.display = 'flex'
    if (dd.children.length == 0) {
        generateImageThumbnailsDropdown()
    }
}

function generateImageThumbnailsDropdown() {
    fetch('.\\images\\images.txt').then(data=> data.text()).then(imgs =>{
        img_list = imgs.split('\r\n')
        for (img of img_list) {
            if (!img.includes('_icon')){
                let div = document.createElement('div')
            div.id = img
            div.classList.add('custom_option')
            let image = document.createElement('img')
            image.src = `.\\images\\${img}`
            image.classList.add("resize_image")
            div.appendChild(image)
            document.getElementById('bg_chooser').appendChild(div)
            }
        }
    })
}

function uploadImage(image) {
    console.log(image)
}

function generateCustomVectors(svg) {
    let parser = new DOMParser(); 
    svg_tree = parser.parseFromString(svg, "image/svg+xml")
    custom_v = svg_tree.querySelectorAll('[id^="V_"')
    console.log(custom_v)
    for (var v of custom_v) {
        generateColorChooser(v.id)
    }
    //var vectors = svg.querySelectorAll('#BACKGROUND')[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', image_path)
}

function updateSealIcon(seal) {
    image_path = seal
    svg_thumbnail.querySelectorAll('#SEAL')[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', image_path)
    newSVGRender()
}

function generateColorChooser(item_name) {
    var name = item_name.replace("V_", "")
    custom_vectors = document.getElementById('custom_vector')
    var vector_div = document.createElement('div')
    vector_div.classList.add('color_input')
    var input_div_container = document.createElement('div')
    input_div_container.classList.add('input_container')
    input_div_container.id = item_name
    var label_div = document.createElement('div')
    label_div.innerHTML = `Choose color for ${name}`
    input_div_container.append(label_div)
    var input_div = document.createElement('input')
    input_div.id = `${item_name}color`
    input_div.type = 'color'
    input_div.addEventListener('change', changeProps)
    input_div_container.append(input_div)
    vector_div.append(input_div_container)
    custom_vectors.append(vector_div)
    console.log(item_name)

}

function chooseTemplate(svg_temp) {
    svg_name = svg_temp.target.children[0].id.replace('.png', '')
    svg_template = svg_name
    try {
        document.getElementById('intro-modal').style.display = 'none'
        fetch(`./svg/${svg_template}.svg`)
        .then(res => res.text())
        .then(data => {let parser = new DOMParser(); svg_thumbnail = parser.parseFromString(data, "image/svg+xml")})
        .then(svg => {newSVGRender()})
    } catch {
        console.log('error getting template')
    }
    newSVGRender();
}

