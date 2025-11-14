.PHONY:

all: components.html

start: components.html
	node ./app

components.html: components/*
	cat components/* > components.html

