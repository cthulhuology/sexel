// sexel.mjs
//
// MIT License 
// 
// Copyright (c) 2024 David J. Goehrig <dave@dloh.org> 
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy 
// of this software and associated documentation files (the "Software"), to deal 
// in the Software without restriction, including without limitation the rights 
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions: 
// 
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software. 
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
// SOFTWARE. 
//

window.$ = function(x) { return document.getElementById(x) }

export class Sexel extends HTMLElement {

	constructor(element,attributes,handlers) {
		super()
		const self = this
		self.__proto__.constructor.obseveredAttributes = attributes
		self._template = document.getElementById(element).content.cloneNode(true)
		if (self._template) self.appendChild(self._template)
		self._attributes = attributes.map( (k) => {
			self[k] = function (v) {
				if (v) self.setAttribute(k,v);
				return self.getAttribute(k)
			}
			return k
		})
		self.ondraw = function() {
			self._attributes.map( (k) => {
				const v = self.querySelector('#'+k)
				if (v) v.textContent = self[k]()
			})
		}
		Object.entries(handlers).map( ([k,v])  => { self[k] = v })
		return this;
	}

	connectedCallback() {
		if (typeof(this['onconnect']) == 'function') this['onconnect'].apply(this)
		if (typeof(this['ondraw']) == 'function') this['ondraw'].apply(this)
	}

	disconnectedCallback () {
		if (typeof(this['ondisconnect']) == 'function') 
			this['ondisconnect'].apply(this)
	}

	adoptedCallback() { 
		if (typeof(this['onadoption']) == 'function') 
			this['onadoption'].apply(this)
	}

	attributeChangedCallback(name,old,value) {
		if (typeof(this['onchange']) == 'function') 
			this['onchange'].apply(this,[name,old,value])
		if (typeof(this['ondraw']) == 'function') this['ondraw'].apply(this)
	}
}

Sexel.tag = function(tag,attributes,handlers) {
	const c = class extends Sexel {
		static observedAttributes = attributes
		constructor() { return super(tag, attributes,handlers) }
	}
	customElements.define(tag,c)
	return c;
}

