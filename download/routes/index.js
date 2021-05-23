const express = require('express')
const AWS = require('aws-sdk')

const router = express.Router()
const S3 = new AWS.S3()

router.get('/list', async (req, res) => {
  try {
    const prefix = req.query.prefix || ''
    const delimiter = req.query.delimiter || ''
    const objects = await S3.listObjectsV2({ Bucket: process.env.BUCKET, Prefix: prefix, Delimiter: delimiter }).promise()
    res.send(objects)
  } catch (e) {
    console.error(e)
    res.status(502).send({ message: 'Unable to list files on S3' });
  }
})

router.get('/get-object', async (req, res) => {
  try {
    const key = req.query.key
    console.info(`${req.jiraUser.emailAddress} requested to download ${key}`)
    const metadata = await S3.headObject({ Bucket: process.env.BUCKET, Key: key }).promise()
    res.set('Content-Type', metadata.ContentType)
    res.set('Content-Length', metadata.ContentLength)
    res.attachment(key)
    const stream = S3.getObject({ Bucket: process.env.BUCKET, Key: key }).createReadStream()
    stream.on('error', (err) => {
      console.error(err)
      res.status(502).send({ message: 'Unable to get download object' });
    })
    stream.pipe(res);
  } catch (e) {
    console.error(e)
    res.status(502).send({ message: 'Unable to get download link' });
  }
})

module.exports = router