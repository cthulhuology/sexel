#!/usr/bin/env node

import express from 'express'
import { WebSocketServer } from 'ws'
import { watch } from 'fs'
import { cwd } from 'process'

const _dir = cwd()

const wss = new WebSocketServer({ port: 4000 })
wss.on('connection', (ws) => {
	console.log("got webocket")
	ws.on('message',handler({
		"log" : (m) => { console.log(m) },
		"echo" : (m) => { ws.send(m) }
	}))
})

const app = express()

app.use(express.json())

app.use(express.static(_dir ))

app.get("/", (req,res) => {
	res.sendFile(_dir + "/index.html")
})

app.post('/login', (req,res) => {
	console.log("login", req.body)
	res.send('["login","ok"]')	
})

app.listen(3000)


