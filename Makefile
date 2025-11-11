.PHONY:

all: components.html start

start: components.html
	node ./app

components.html: components/*
	cat components/* > components.html

website:
	cd ../sexel.tech && $(MAKE)
