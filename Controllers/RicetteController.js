const { title } = require('process');
const ricette = require('../database/db.js')
const fs = require('fs');
const send = require('send');
const { count } = require('console');

const index = (req, res) => {
    // let list = ''
    // ricette.forEach(ricetta => {
    //     list += `<li>${ricetta.title}</li>`
    // });
    // const unorderlist = `<ul>${list}</ul>`
    // res.send(unorderlist)
    res.json({
        data: ricette,
        count: ricette.length
    })
}

const show = (req, res) =>{  
    
    
    const ricetta = ricette.find( (ricetta) => ricetta.slug === req.params.slug)
    
    
    if(!ricetta){
        return res.status(404).json({error: "Nessuna ricetta trovata"})
    }
    return res.status(200).json({ data: ricetta })
}

const store = (req, res) => {
    
    const ricetta = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }
    console.log(ricetta);
    
    ricette.push(ricetta)

    fs.writeFileSync('./database/db.js', `module.exports = ${JSON.stringify(ricette, null, 4)}`)

    return res.status(201).json({
        status: 201,
        data: ricette,
        count: ricette.length
    })
}

const update = (req, res) =>{
    console.log(req.params);
    const id = req.params.slug
    const { title, slug, content, image, tags} = req.body
    const ricetta = ricette.find(ricetta => ricetta.slug.toLowerCase() === id)
    if (!ricetta){
        return res.status(404).json({error: `Nessuna ricetta da aggiornare con il nome ${id}`})
    }
     ricetta.title = title
     ricetta.content = content
     ricetta.image = image
     ricetta.tags = tags

     fs.writeFileSync('./database/db.js', `module.exports = ${JSON.stringify(ricette, null, 4)}`)
     
     return res.status(201).json({
        status:201,
        data: ricette
     })

    
     

}

const destroy = (req, res) => {
    const id = req.params.slug
    console.log(id);
    
    const ricetta = ricette.find( ricetta => ricetta.slug.toLowerCase() === id)
    console.log(ricetta);
    
if(!ricetta) {
    return res.status(404).json({
        error: `Nessuna ricetta con nome ${id} è presente da eliminare`
    })
}
const newRicette = ricette.filter( ricetta => ricetta.slug.toLowerCase() !== req.params.slug )
    fs.writeFileSync('./database/db.js', `module.exports = ${JSON.stringify(newRicette, null, 4)}`)
return res.status(200).json({
    data: newRicette,
    counter: newRicette.length
})
}
// const showFilterTags = (req, res) =>{
//     console.log(req.params.tags);
    
//     // const filterTags = ricette.filter( (ricetta) => ricetta.tags === req.params.tags)
//     // res.json({
//     //     tags: 
//     // })
// }

module.exports = {
    index,
    show,
    store,
    update,
    destroy
}






