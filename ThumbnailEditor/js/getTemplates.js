fetch('.\\svg\\templates.txt').then(data=> data.text()).then(imgs =>{
    img_list = imgs.split('\r\n')
    for (img of img_list) {
        var div_container = document.createElement('div')
        div_container.classList.add('template_option_container')
        var div = document.createElement('div')
        div.id = img
        div.classList.add('template_option')
        let image = document.createElement('img')
        image.src = `.\\svg\\template_icons\\${img}`
        image.classList.add("resize_image_template")
        div.appendChild(image)
        div_container.addEventListener('click', chooseTemplate)
        div_container.append(div)
        document.getElementById('choose_template_modal').appendChild(div_container)
    }
})