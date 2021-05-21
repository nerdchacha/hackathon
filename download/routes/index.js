const express = require('express')
const router = express.Router()
const AWS = require('aws-sdk')

const S3 = new AWS.S3()

router.get('/list', async (req, res) => {
  try {
    const prefix = req.query.prefix || ''
    const delimiter = req.query.delimiter || ''
    const objects = await S3.listObjectsV2({ Bucket: process.env.BUCKET, Prefix: prefix, Delimiter: delimiter }).promise()
    res.send(objects)
  } catch (e) {
    console.log(e)
    res.status(502).send({message: 'Unable to list files on S3'});
  }
})

router.get('/get-signed-url', async (req, res) => {
  try {
    const expires = req.query.expires ? parseInt(req.query.expires) : 600
    const key = req.query.key
    const link = await S3.getSignedUrlPromise('getObject', { Bucket: process.env.BUCKET, Key: key, Expires: expires })
    res.json({ link })
  } catch (e) {
    console.log(e)
    res.status(502).send({ message: 'Unable to get download link' });
  }
})

module.exports = router