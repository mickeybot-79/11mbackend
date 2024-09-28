const View = require('../model/View')

const addPageView = async (req, res) => {
    const viewsObject = await View.findOne({ _id: '66f765222deb5e782e782d57'}).exec()
    viewsObject.allViews++
    await viewsObject.save()
    res.status(201).json({'message': 'view added'})
}

const getPageViews = async (req, res) => {
    const allViews = await View.findOne({ _id: '66f765222deb5e782e782d57'}).exec()
    res.json(allViews)
}

module.exports = { addPageView, getPageViews }