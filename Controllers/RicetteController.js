const ricette = require('../database/db.js')
const fs = require('fs');
const connection = require('../database/connection.js')


const index = (req, res) => {


    const sql = 'SELECT * FROM posts'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const responseData = {
            data: results,
            counter: results.length
        }
        res.status(200).json(responseData)
    })
}

const show = (req, res) => {
    const id = req.params.slug
    console.log('questo', id);
    console.log(req.params);


    const sql = 'SELECT * FROM posts WHERE id=?'

    const tagsSql = 'SELECT tags.* FROM tags JOIN post_tag ON tags.id = post_tag.tag_id WHERE post_tag.post_id = ?'

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err })
        if (!results[0]) return res.status(404).json({ error: `404! NO item found with slug: ${id}` })

        const ricetta = results[0]

        connection.query(tagsSql, [id], (err, tagsRes) => {

            if (err) return res.status(500).json({ error: err })

            ricetta.tags = tagsRes

            const respData = {
                data: ricetta
            }

            res.status(200).json(respData)

        })
    })

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

const update = (req, res) => {
    console.log(req.params);
    const id = req.params.slug
    const { title, slug, content, image, tags } = req.body
    const ricetta = ricette.find(ricetta => ricetta.slug.toLowerCase() === id)
    if (!ricetta) {
        return res.status(404).json({ error: `Nessuna ricetta da aggiornare con il nome ${id}` })
    }
    ricetta.title = title
    ricetta.content = content
    ricetta.image = image
    ricetta.tags = tags

    fs.writeFileSync('./database/db.js', `module.exports = ${JSON.stringify(ricette, null, 4)}`)

    return res.status(201).json({
        status: 201,
        data: ricette
    })




}

const destroy = (req, res) => {
    const id = req.params.slug
    console.log(id);

    const sql = 'DELETE FROM posts WHERE id=?'
    connection.query(sql, [id], (err, results) => {
        console.log(err, results);
        if (err) return res.status(500).json({ error: err })
        if (results.affectedRows === 0) return res.status(404).json({ error: `404! no item found with with this slug: ${id}` })
        return res.json({ status: 204, affectedRows: results.affectedRows })
    })
}


module.exports = {
    index,
    show,
    store,
    update,
    destroy
}






